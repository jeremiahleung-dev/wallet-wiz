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
        maxWidth: 720,
        width: '100%',
        margin: '0 auto',
        padding: '100px 24px 48px',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 36,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}>
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            Your recommendations.
          </h2>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
          }}>
            Ranked by how well they match your profile. Tap any card to see details.
          </p>
        </div>

        {/* FTC disclosure */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--card-border)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both',
        }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>ⓘ</span>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
          }}>
            We may earn a commission if you apply through our links — at no cost to you. This does not affect our rankings.
          </p>
        </div>

        {/* Card list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

        {/* Restart */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            onClick={onRestart}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: 40,
              padding: '10px 28px',
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

function ResultCard({ card, rank, answers, isExpanded, onToggle }) {
  const reasons = getMatchReasons(card, answers)
  const [hovered, setHovered] = useState(false)
  const [applyHovered, setApplyHovered] = useState(false)

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${isExpanded ? 'var(--accent)' : hovered ? 'var(--text-muted)' : 'var(--card-border)'}`,
        borderRadius: 16,
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 20px',
      }}>
        {/* Rank */}
        <div style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: rank === 0 ? 'var(--accent-dim)' : 'var(--surface)',
          border: `1px solid ${rank === 0 ? 'var(--accent)' : 'var(--card-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font)',
          fontSize: '0.82rem',
          color: rank === 0 ? 'var(--accent)' : 'var(--text-muted)',
        }}>
          {rank + 1}
        </div>

        {/* Name + tag */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '1.05rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              {card.name}
            </span>
            {rank === 0 && (
              <span style={{
                fontFamily: 'var(--font)',
                fontSize: '0.68rem',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 20,
                padding: '1px 8px',
                letterSpacing: '0.06em',
              }}>
                Top Pick
              </span>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}>
            {card.tag}
          </div>
        </div>

        {/* Fee + issuer */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: card.annualFee === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
          }}>
            {card.annualFee === 0 ? 'No fee' : `$${card.annualFee}/yr`}
          </div>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}>
            {card.issuer}
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          flexShrink: 0,
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          transform: isExpanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.25s ease',
        }}>
          ↓
        </div>
      </div>

      {/* Match tags */}
      {reasons.length > 0 && (
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {reasons.map((r, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 20,
              padding: '2px 10px',
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
          {/* Visual card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <CardVisual card={card} />
          </div>

          <Detail label="Rewards" value={card.rewards} />

          {card.signupBonus && card.signupBonus !== 'None' && (
            <Detail label="Welcome Offer" value={card.signupBonus} />
          )}

          <div style={{ marginBottom: 24 }}>
            <Label>Key Benefits</Label>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {card.keyBenefits.map((b, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: 10,
                  fontFamily: 'var(--font)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Now CTA */}
          {card.applyUrl && (
            <a
              href={card.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(Events.APPLY_CLICKED, {
                card_id: card.id,
                card_name: card.name,
                rank: card.rank,
                issuer: card.issuer,
              })}
              onMouseEnter={() => setApplyHovered(true)}
              onMouseLeave={() => setApplyHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '13px 24px',
                background: applyHovered ? 'var(--accent-hover)' : 'var(--accent)',
                color: 'var(--bg)',
                fontFamily: 'var(--font)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
                marginTop: 8,
              }}
            >
              Apply on {card.issuer}'s website
              <span style={{ fontSize: '0.85rem' }}>↗</span>
            </a>
          )}

          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 1.5,
          }}>
            You'll be redirected to {card.issuer}'s secure site. Approval is determined by the issuer.
          </p>
        </div>
      )}
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font)',
      fontSize: '0.68rem',
      letterSpacing: '0.14em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: 7,
    }}>
      {children}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Label>{label}</Label>
      <p style={{
        fontFamily: 'var(--font)',
        fontSize: '0.92rem',
        color: 'var(--text-primary)',
        lineHeight: 1.6,
      }}>
        {value}
      </p>
    </div>
  )
}
