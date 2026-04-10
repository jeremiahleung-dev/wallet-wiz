// api/cards.js — GET /api/cards
// Edge runtime: zero cold start, globally distributed
// Merges live KV fields over the static card array and CDN-caches the result.

import { Redis } from '@upstash/redis'
import { cards as staticCards } from '../src/data/cards.js'

export const config = { runtime: 'edge' }

const LIVE_FIELDS = ['annualFee', 'annualFeeTier', 'rewards', 'signupBonus', 'keyBenefits', 'rating', 'ratingCount']

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    // Pipeline all 68 HGETALL calls — one network round-trip to Redis
    const pipeline = redis.pipeline()
    for (const card of staticCards) {
      pipeline.hgetall(`card:${card.id}`)
    }
    const kvResults = await pipeline.exec()

    // Merge: static base + live KV fields (KV wins for mutable fields only)
    const merged = staticCards.map((card, i) => {
      const live = kvResults[i]
      if (!live || Object.keys(live).length === 0) return card

      return {
        ...card,
        annualFee:     live.annualFee     != null ? Number(live.annualFee)          : card.annualFee,
        annualFeeTier: live.annualFeeTier                                            ?? card.annualFeeTier,
        rewards:       live.rewards                                                  ?? card.rewards,
        signupBonus:   live.signupBonus                                              ?? card.signupBonus,
        keyBenefits:   live.keyBenefits   ? JSON.parse(live.keyBenefits)            : card.keyBenefits,
        rating:        live.rating        != null ? Number(live.rating)             : card.rating,
        ratingCount:   live.ratingCount                                              ?? card.ratingCount,
      }
    })

    return new Response(JSON.stringify(merged), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // CDN serves stale for up to 23h while revalidating in background
        // Browser caches for 5 minutes
        'Cache-Control': 's-maxage=82800, stale-while-revalidate=3600, max-age=300',
      },
    })
  } catch (err) {
    console.error('[api/cards] KV error, falling back to static data:', err.message)
    // Never return 500 — fall back to static array so the app always works
    return new Response(JSON.stringify(staticCards), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  }
}
