import { useState } from 'react'
import { getMatchReasons } from '../utils/recommend'
import { trackEvent, Events } from '../utils/track'
import CardVisual from './CardVisual'
import Footer from './Footer'

export default function Results({ recommendations, answers, onRestart, onPrivacy }) {
  const [expanded, setExpanded] = useState(0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        flex: 1,
        maxWidth: 780,
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(72px, 18vw, 100px) 20px 48px',
      }}>
        <div style={{
          marginBottom: 32,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: 10,
            letterSpacing: '-0.03em',
          }}>
            Your recommendations.
          </h2>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            fontWeight: 400,
            color: 'var(--text-secondary)',
          }}>
            Ranked by how well they match your profile. Tap any card to see details and reviews.
          </p>
        </div>

        {/* Disclosure */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--card-border)',
          borderRadius: 10,
          padding: '11px 16px',
          marginBottom: 20,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both',
        }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>ⓘ</span>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.82rem',
            fontWeight: 400,
            color: 'var(--text-muted)',
            lineHeight: 1.55,
          }}>
            Card links are provided for reference only. We do not earn any commission. Rankings are based purely on your profile.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recommendations.map((card, i) => (
            <ResultCard
              key={card.id}
              card={card}
              rank={i}
              answers={answers}
              isExpanded={expanded === i}
              onToggle={() => {
                const opening = expanded !== i
                setExpanded(opening ? i : -1)
                if (opening) {
                  trackEvent(Events.CARD_EXPANDED, { card_id: card.id, rank: i + 1 })
                } else {
                  trackEvent(Events.CARD_COLLAPSED, { card_id: card.id })
                }
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <button
            onClick={onRestart}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: 40,
              padding: '12px 28px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.borderColor = 'var(--text-muted)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--card-border)'
            }}
          >
            Start over
          </button>
        </div>
      </div>

      <Footer onPrivacy={onPrivacy} />
    </div>
  )
}

// ── Stars ──────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => {
        const fill = Math.min(1, Math.max(0, rating - (n - 1)))
        return (
          <div key={n} style={{ position: 'relative', width: 15, height: 15 }}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 4H13L9.5 8l1.5 4L7 10l-4 2 1.5-4L1 5h4.5z"
                stroke="var(--text-muted)" strokeWidth="1" fill="none" />
            </svg>
            {fill > 0 && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${fill * 100}%` }}>
                <svg width="15" height="15" viewBox="0 0 14 14">
                  <path d="M7 1l1.5 4H13L9.5 8l1.5 4L7 10l-4 2 1.5-4L1 5h4.5z" fill="var(--accent)" />
                </svg>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Review panel ───────────────────────────────────────────────────────────
function ReviewPanel({ card }) {
  const [hovered, setHovered] = useState(false)
  if (!card.rating) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Stars rating={card.rating} />
          <span style={{
            fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)',
          }}>
            {card.rating.toFixed(1)}
          </span>
          <span style={{ fontFamily: 'var(--font)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ 5</span>
        </div>
        <p style={{ fontFamily: 'var(--font)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {card.ratingCount} reviews · {card.ratingSource}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {card.reviewHighlights?.map((highlight, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--card-border)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <p style={{ fontFamily: 'var(--font)', fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              "{highlight}"
            </p>
          </div>
        ))}
      </div>

      {card.reviewUrl && (
        <a
          href={card.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font)', fontSize: '0.82rem', fontWeight: 500,
            color: hovered ? 'var(--accent-hover)' : 'var(--accent)',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
        >
          Read all reviews on {card.ratingSource}
          <span style={{ fontSize: '0.75rem' }}>↗</span>
        </a>
      )}
    </div>
  )
}

// ── Result card ────────────────────────────────────────────────────────────
function ResultCard({ card, rank, answers, isExpanded, onToggle }) {
  const reasons = getMatchReasons(card, answers)
  const [hovered, setHovered] = useState(false)
  const [applyHovered, setApplyHovered] = useState(false)

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: `1.5px solid ${isExpanded ? 'var(--accent)' : hovered ? 'var(--text-muted)' : 'var(--card-border)'}`,
        borderLeft: rank === 0 ? `3px solid var(--accent)` : undefined,
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        animation: `fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${rank * 0.07}s both`,
        cursor: 'pointer',
      }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Collapsed row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
        {/* Rank badge */}
        <div style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: 8,
          background: rank === 0 ? 'var(--accent)' : 'var(--option-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700,
          color: rank === 0 ? '#FFFFFF' : 'var(--text-muted)',
        }}>
          {rank + 1}
        </div>

        {/* Name + tag */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {card.name}
            </span>
            {rank === 0 && (
              <span style={{
                fontFamily: 'var(--font)', fontSize: '0.68rem', fontWeight: 600,
                color: 'var(--accent)',
                background: 'var(--accent-dim)',
                borderRadius: 20, padding: '2px 9px', letterSpacing: '0.04em',
              }}>
                Top Pick
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
              {card.tag}
            </span>
            {card.rating && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Stars rating={card.rating} />
                <span style={{ fontFamily: 'var(--font)', fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {card.rating.toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Fee + issuer */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 600,
            color: card.annualFee === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
          }}>
            {card.annualFee === 0 ? 'No fee' : `$${card.annualFee}/yr`}
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>
            {card.issuer}
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          flexShrink: 0, color: 'var(--text-muted)', fontSize: '0.8rem',
          transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease',
        }}>
          ↓
        </div>
      </div>

      {/* Match tags */}
      {reasons.length > 0 && (
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {reasons.map((r, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'var(--option-bg)',
              border: '1px solid var(--option-border)',
              borderRadius: 20, padding: '3px 10px',
            }}>
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Expanded detail */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--card-border)',
            padding: '28px 24px 24px',
            animation: 'fadeIn 0.22s ease both',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="card-detail-grid">
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CardVisual card={card} />
              </div>

              <Detail label="Rewards" value={card.rewards} />

              {card.signupBonus && card.signupBonus !== 'None' && (
                <Detail label="Welcome Offer" value={card.signupBonus} />
              )}

              <div>
                <Label>Key Benefits</Label>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {card.keyBenefits.map((b, i) => (
                    <li key={i} style={{
                      display: 'flex', gap: 10,
                      fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 400,
                      color: 'var(--text-primary)', lineHeight: 1.5,
                    }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {card.applyUrl && (
                <>
                  <a
                    href={card.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(Events.APPLY_CLICKED, {
                      card_id: card.id, card_name: card.name, issuer: card.issuer,
                    })}
                    onMouseEnter={() => setApplyHovered(true)}
                    onMouseLeave={() => setApplyHovered(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '13px 24px',
                      background: applyHovered ? 'var(--accent-hover)' : 'var(--accent)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font)', fontSize: '0.92rem', fontWeight: 600,
                      letterSpacing: '0.01em', borderRadius: 10, textDecoration: 'none',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    Apply on {card.issuer}'s website
                    <span style={{ fontSize: '0.85rem' }}>↗</span>
                  </a>
                  <p style={{
                    fontFamily: 'var(--font)', fontSize: '0.72rem', fontWeight: 400,
                    color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, marginTop: -12,
                  }}>
                    You'll be redirected to {card.issuer}'s secure site. Approval is at the issuer's discretion.
                  </p>
                </>
              )}
            </div>

            {/* Right column — Reviews */}
            <ReviewPanel card={card} />
          </div>
        </div>
      )}
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font)', fontSize: '0.68rem', fontWeight: 600,
      letterSpacing: '0.12em', color: 'var(--text-muted)',
      textTransform: 'uppercase', marginBottom: 7,
    }}>
      {children}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <Label>{label}</Label>
      <p style={{ fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.6 }}>
        {value}
      </p>
    </div>
  )
}
