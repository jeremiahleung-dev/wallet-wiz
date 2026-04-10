// scripts/seed-kv.js
// One-time KV seeder — run locally before first deploy:
//   npm run seed-kv
//
// Pipelines HSET for all 68 cards from the current static array so
// /api/cards has data before the first nightly scrape runs.

import { Redis } from '@upstash/redis'
import { cards as staticCards } from '../src/data/cards.js'

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

function deriveFeeTier(fee) {
  if (fee === 0)    return 'none'
  if (fee <= 100)   return 'low'
  if (fee <= 300)   return 'medium'
  return 'high'
}

async function seed() {
  const pipeline = redis.pipeline()

  for (const card of staticCards) {
    const fields = {
      annualFee:     String(card.annualFee ?? 0),
      annualFeeTier: card.annualFeeTier ?? deriveFeeTier(card.annualFee ?? 0),
      seededAt:      new Date().toISOString(),
    }

    if (card.rewards)      fields.rewards      = card.rewards
    if (card.signupBonus)  fields.signupBonus  = card.signupBonus
    if (Array.isArray(card.keyBenefits) && card.keyBenefits.length > 0) {
      fields.keyBenefits = JSON.stringify(card.keyBenefits)
    }
    if (card.rating != null) fields.rating = String(card.rating)
    if (card.ratingCount)    fields.ratingCount = card.ratingCount

    pipeline.hset(`card:${card.id}`, fields)
  }

  const results = await pipeline.exec()
  const errors = results.filter(r => r instanceof Error)

  if (errors.length > 0) {
    console.error(`Seed complete with ${errors.length} errors:`, errors)
    process.exit(1)
  }

  console.log(`Seeded ${staticCards.length} cards successfully.`)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
