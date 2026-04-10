// api/cron/scrape.js — GET /api/cron/scrape
// Invoked nightly by Vercel cron (schedule: 0 2 * * *).
// Scrapes each card's NerdWallet review page for live field data.
// Falls back to issuer page if NerdWallet fails.
// Only writes fields that were successfully extracted — never overwrites with empty.

import { Redis } from '@upstash/redis'
import * as cheerio from 'cheerio'
import { cards as staticCards } from '../../src/data/cards.js'

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function parseAnnualFee(text) {
  if (!text) return null
  const normalized = text.toLowerCase().trim()
  if (normalized.includes('no annual fee') || normalized === '$0' || normalized === '0') return 0
  const match = normalized.match(/\$?([\d,]+)(?:\.\d{0,2})?(?:\/yr)?/)
  if (match) {
    const val = parseInt(match[1].replace(/,/g, ''), 10)
    return isNaN(val) ? null : val
  }
  return null
}

function deriveFeeTier(fee) {
  if (fee === 0)    return 'none'
  if (fee <= 100)   return 'low'
  if (fee <= 300)   return 'medium'
  return 'high'
}

function formatReviewCount(raw) {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return raw
  const n = parseInt(digits, 10)
  if (n >= 1000) {
    const rounded = Math.floor(n / 100) * 100
    return rounded.toLocaleString('en-US') + '+'
  }
  return `${n}+`
}

// ── NerdWallet scraper ────────────────────────────────────────────────────────

async function scrapeFromNerdWallet(card) {
  const res = await fetch(card.reviewUrl, {
    headers: {
      'User-Agent':      BROWSER_UA,
      'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control':   'no-cache',
      'Referer':         'https://www.nerdwallet.com/',
    },
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  // Strategy 1: __NEXT_DATA__ JSON (most stable — NerdWallet is a Next.js app)
  const nextDataText = $('script#__NEXT_DATA__').html()
  if (nextDataText) {
    try {
      const nextData = JSON.parse(nextDataText)
      const fields = extractFromNextData(nextData)
      if (Object.keys(fields).length >= 3) return fields
    } catch (_) {
      // fall through to CSS selectors
    }
  }

  // Strategy 2: CSS selectors (fallback when __NEXT_DATA__ structure changes)
  return extractFromHTML($)
}

function extractFromNextData(nextData) {
  const fields = {}
  const pageProps = nextData?.props?.pageProps ?? {}
  // NerdWallet stores card data under various paths depending on page version
  const product = pageProps.cardData ?? pageProps.product ?? pageProps.card ?? {}

  const fee = product.annualFee ?? product.annual_fee
  if (fee != null) {
    const parsed = parseAnnualFee(String(fee))
    if (parsed != null) {
      fields.annualFee     = String(parsed)
      fields.annualFeeTier = deriveFeeTier(parsed)
    }
  }

  const rewardsStr = product.rewardsRate ?? product.rewards_rate ?? product.rewardRate ?? product.rewardsDescription
  if (typeof rewardsStr === 'string' && rewardsStr.length > 5) {
    fields.rewards = rewardsStr.trim()
  }

  const bonus = product.welcomeOffer ?? product.signupBonus ?? product.bonusOffer ?? product.welcomeBonus
  if (typeof bonus === 'string' && bonus.length > 5) {
    fields.signupBonus = bonus.trim()
  }

  const rawBenefits = product.highlights ?? product.keyBenefits ?? product.pros ?? product.benefits
  if (Array.isArray(rawBenefits) && rawBenefits.length > 0) {
    const benefits = rawBenefits
      .map(b => typeof b === 'string' ? b : (b?.text ?? b?.description ?? b?.title ?? ''))
      .filter(s => s.length > 0)
      .slice(0, 5)
    if (benefits.length > 0) fields.keyBenefits = JSON.stringify(benefits)
  }

  const ratingVal = product.starRating ?? product.rating ?? product.nerdwalletRating ?? product.overallRating
  if (ratingVal != null) {
    const r = parseFloat(String(ratingVal))
    if (!isNaN(r) && r >= 1 && r <= 5) fields.rating = String(r)
  }

  const countStr = product.numberOfReviews ?? product.reviewCount ?? product.ratingCount
  if (countStr != null) fields.ratingCount = formatReviewCount(String(countStr))

  return fields
}

function extractFromHTML($) {
  const fields = {}

  // Annual fee
  const feeText = (
    $('[data-testid="annual-fee-value"]').first().text()  ||
    $('[data-testid="annualFee"]').first().text()         ||
    $('dt').filter((_, el) => /annual fee/i.test($(el).text())).first().next('dd').text()
  ).trim()

  if (feeText) {
    const parsed = parseAnnualFee(feeText)
    if (parsed != null) {
      fields.annualFee     = String(parsed)
      fields.annualFeeTier = deriveFeeTier(parsed)
    }
  }

  // Rewards rate
  const rewardsText = (
    $('[data-testid="rewards-rate"]').first().text()   ||
    $('[data-testid="rewardsRate"]').first().text()    ||
    $('[class*="rewards-rate"]').first().text()
  ).trim()
  if (rewardsText.length > 5) fields.rewards = rewardsText

  // Signup bonus / welcome offer
  const bonusText = (
    $('[data-testid="welcome-offer"]').first().text()   ||
    $('[data-testid="bonus-offer"]').first().text()     ||
    $('[data-testid="signupBonus"]').first().text()     ||
    $('dt').filter((_, el) => /bonus offer|welcome offer|sign-?up bonus/i.test($(el).text())).first().next('dd').text()
  ).trim()
  if (bonusText.length > 5) fields.signupBonus = bonusText

  // Key benefits — try several known list containers
  const benefitSelectors = [
    '[data-testid="highlights-list"] li',
    '[data-testid="pros-list"] li',
    '[data-testid="key-benefits"] li',
    '[class*="highlights"] li',
  ]
  for (const sel of benefitSelectors) {
    const items = $(sel)
    if (items.length > 0) {
      const benefits = items.map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 5)
      if (benefits.length > 0) {
        fields.keyBenefits = JSON.stringify(benefits)
        break
      }
    }
  }

  // Star rating
  const ratingText = (
    $('[data-testid="star-rating-value"]').first().text()       ||
    $('[data-testid="nerdwallet-rating"]').first().text()       ||
    $('meta[itemprop="ratingValue"]').attr('content')           ||
    ''
  ).trim()
  const ratingNum = parseFloat(ratingText)
  if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
    fields.rating = String(ratingNum)
  }

  // Review count
  const countText = (
    $('[data-testid="review-count"]').first().text()  ||
    $('meta[itemprop="reviewCount"]').attr('content') ||
    ''
  ).trim()
  if (countText) fields.ratingCount = formatReviewCount(countText)

  return fields
}

// ── Issuer fallback scraper ───────────────────────────────────────────────────
// Used when NerdWallet blocks or returns too few fields.
// Each issuer has consistent patterns — we only extract annualFee reliably here.

async function scrapeFromIssuer(card) {
  const res = await fetch(card.applyUrl, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept':     'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(12_000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)
  const fields = {}

  // Try schema.org JSON-LD first — most issuers include it
  const jsonLdScripts = $('script[type="application/ld+json"]').map((_, el) => {
    try { return JSON.parse($(el).html()) } catch { return null }
  }).get().filter(Boolean)

  const financialProduct = jsonLdScripts.find(d =>
    d['@type'] === 'FinancialProduct' || d['@type'] === 'CreditCard'
  )
  if (financialProduct?.annualPercentageRate != null || financialProduct?.annualFee != null) {
    const fee = financialProduct.annualFee ?? financialProduct.annualPercentageRate
    const parsed = parseAnnualFee(String(fee))
    if (parsed != null) {
      fields.annualFee     = String(parsed)
      fields.annualFeeTier = deriveFeeTier(parsed)
    }
  }

  if (!fields.annualFee) {
    // Issuer-specific selectors — annualFee appears in rates-and-fees tables (Schumer Box)
    const issuerSelectors = {
      'Chase':           '[data-testid="annual-fee"], .annual-fee-value',
      'American Express':'[class*="AnnualFee"], [id*="annual-fee"]',
      'Capital One':     '[data-testid*="annual"], .annual-fee',
      'Citi':            '[class*="annual"][class*="fee"]',
      'Wells Fargo':     '[class*="annual-fee"]',
      'Discover':        '[class*="annual-fee"], [id*="annual-fee"]',
      'Bank of America': '[class*="annual-fee"]',
    }
    const sel = issuerSelectors[card.issuer]
    if (sel) {
      const feeText = $(sel).first().text().trim()
      const parsed = parseAnnualFee(feeText)
      if (parsed != null) {
        fields.annualFee     = String(parsed)
        fields.annualFeeTier = deriveFeeTier(parsed)
      }
    }
  }

  return fields
}

// ── Main scrape orchestration ─────────────────────────────────────────────────

async function scrapeCard(card) {
  // Try NerdWallet first (richer data)
  try {
    const fields = await scrapeFromNerdWallet(card)
    if (Object.keys(fields).length >= 2) return fields
    // Too few fields extracted — try issuer as supplement
    const issuerFields = await scrapeFromIssuer(card)
    return { ...issuerFields, ...fields }  // NerdWallet wins on conflicts
  } catch (nwErr) {
    console.warn(`[scrape] NerdWallet failed for ${card.id} (${nwErr.message}), trying issuer page`)
    try {
      return await scrapeFromIssuer(card)
    } catch (issuerErr) {
      throw new Error(`NerdWallet: ${nwErr.message} | Issuer: ${issuerErr.message}`)
    }
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req) {
  // Vercel cron injects Authorization: Bearer $CRON_SECRET automatically
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  const startMs = Date.now()
  let successCount = 0
  let errorCount = 0
  const errors = []

  for (const card of staticCards) {
    try {
      const fields = await scrapeCard(card)

      if (Object.keys(fields).length > 0) {
        await redis.hset(`card:${card.id}`, {
          ...fields,
          scrapedAt:  new Date().toISOString(),
          scrapeError: '',
        })
        successCount++
      } else {
        // Page loaded but nothing useful extracted — record but don't touch existing data
        await redis.hset(`card:${card.id}`, { scrapeError: 'No fields extracted' })
        errors.push({ id: card.id, error: 'No fields extracted' })
        errorCount++
      }
    } catch (err) {
      // Isolated failure — existing KV values for this card remain untouched
      await redis.hset(`card:${card.id}`, { scrapeError: err.message })
      errors.push({ id: card.id, error: err.message })
      errorCount++
      console.error(`[scrape] ${card.id}:`, err.message)
    }

    // Rate limit: 500ms base + up to 500ms jitter → ~0.5–1s per card, ~68s total
    await sleep(500 + Math.floor(Math.random() * 500))
  }

  const durationMs = Date.now() - startMs
  const status = errorCount === 0 ? 'success'
               : successCount === 0 ? 'error'
               : 'partial'

  await redis.hset('scrape:meta', {
    lastRunAt:     new Date().toISOString(),
    lastRunStatus: status,
    successCount:  String(successCount),
    errorCount:    String(errorCount),
    durationMs:    String(durationMs),
  })

  if (errors.length > 0) {
    console.error('[scrape] card errors:', JSON.stringify(errors))
  }
  console.log(`[scrape] complete — ${successCount} ok, ${errorCount} failed, ${durationMs}ms`)

  return new Response(
    JSON.stringify({ status, successCount, errorCount, durationMs, errors }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
