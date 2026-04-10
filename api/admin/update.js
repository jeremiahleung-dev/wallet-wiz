// api/admin/update.js — POST /api/admin/update
// Manual override for any live card field. Protected by ADMIN_API_KEY.
// Usage:
//   curl -X POST https://your-app.vercel.app/api/admin/update \
//     -H "x-api-key: $ADMIN_API_KEY" \
//     -H "Content-Type: application/json" \
//     -d '{"id":"chase-sapphire-reserve","fields":{"annualFee":795}}'

import { Redis } from '@upstash/redis'

const LIVE_FIELDS = new Set(['annualFee', 'annualFeeTier', 'rewards', 'signupBonus', 'keyBenefits', 'rating', 'ratingCount'])

function deriveFeeTier(fee) {
  if (fee === 0)    return 'none'
  if (fee <= 100)   return 'low'
  if (fee <= 300)   return 'medium'
  return 'high'
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Bad Request: invalid JSON', { status: 400 })
  }

  const { id, fields } = body
  if (!id || typeof id !== 'string') {
    return new Response('Bad Request: missing id', { status: 400 })
  }
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return new Response('Bad Request: missing fields object', { status: 400 })
  }

  // Sanitize: only accept known mutable fields with correct types
  const sanitized = {}
  for (const [key, value] of Object.entries(fields)) {
    if (!LIVE_FIELDS.has(key)) continue

    if (key === 'keyBenefits') {
      if (!Array.isArray(value)) {
        return new Response('Bad Request: keyBenefits must be an array', { status: 400 })
      }
      sanitized.keyBenefits = JSON.stringify(value)
    } else if (key === 'annualFee') {
      const n = Number(value)
      if (isNaN(n) || n < 0) {
        return new Response('Bad Request: annualFee must be a non-negative number', { status: 400 })
      }
      sanitized.annualFee     = String(n)
      sanitized.annualFeeTier = deriveFeeTier(n)  // always keep in sync
    } else if (key === 'rating') {
      const n = parseFloat(value)
      if (isNaN(n) || n < 1 || n > 5) {
        return new Response('Bad Request: rating must be between 1 and 5', { status: 400 })
      }
      sanitized.rating = String(n)
    } else if (key === 'annualFeeTier') {
      // Silently skip — always derived from annualFee
      continue
    } else {
      sanitized[key] = String(value)
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return new Response('Bad Request: no valid fields provided', { status: 400 })
  }

  sanitized.updatedAt = new Date().toISOString()
  sanitized.updatedBy = 'admin'

  const redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  await redis.hset(`card:${id}`, sanitized)

  return new Response(
    JSON.stringify({ ok: true, id, updated: Object.keys(sanitized) }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
