import { useState } from 'react'
import { cards as allCards } from '../data/cards'
import { trackEvent, Events } from '../utils/track'

function trimBenefit(text) {
  const cleaned = text.replace(/—/g, '').replace(/\s+/g, ' ').trim()
  const words = cleaned.split(' ')
  return words.length <= 12 ? cleaned : words.slice(0, 12).join(' ')
}

// ── Mini star row ───────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => {
        const fill = Math.min(1, Math.max(0, rating - (n - 1)))
        return (
          <div key={n} style={{ position: 'relative', width: 13, height: 13 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 4H13L9.5 8l1.5 4L7 10l-4 2 1.5-4L1 5h4.5z"
                stroke="var(--text-muted)" strokeWidth="1" fill="none" />
            </svg>
            {fill > 0 && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${fill * 100}%` }}>
                <svg width="13" height="13" viewBox="0 0 14 14">
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

// ── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font)',
      fontSize: '0.68rem',
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: 12,
      marginTop: 32,
      paddingBottom: 8,
      borderBottom: '1px solid var(--card-border)',
    }}>
      {children}
    </div>
  )
}

// ── Card chip (horizontal scroll row) ──────────────────────────────────────
function CardChip({ card, onRemove }) {
  const [g1, g2] = card.gradient
  return (
    <div style={{
      flexShrink: 0,
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      width: 140,
      background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
      position: 'relative',
    }}>
      <div style={{ padding: '10px 12px 10px' }}>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.3,
          marginBottom: 4,
          paddingRight: 20,
        }}>
          {card.name}
        </p>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.65)',
        }}>
          {card.annualFee === 0 ? 'No annual fee' : `$${card.annualFee}/yr`}
        </p>
      </div>
      <button
        onClick={onRemove}
        aria-label={`Remove ${card.name}`}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.75rem',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}

// ── Single card attribute cell ──────────────────────────────────────────────
function CardCell({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--card-border)',
      borderRadius: 10,
      padding: '14px 16px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardCellLabel({ name }) {
  return (
    <p style={{
      fontFamily: 'var(--font)',
      fontSize: '0.72rem',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.55)',
      marginBottom: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      {name}
    </p>
  )
}

// ── Best pill ────────────────────────────────────────────────────────────────
function BestPill() {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'var(--font)',
      fontSize: '0.68rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: 'var(--accent)',
      background: 'var(--accent-dim)',
      borderRadius: 20,
      padding: '2px 8px',
      marginBottom: 6,
    }}>
      ✓ Best
    </span>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ onBack, backLabel = '← Back to results', emptyMessage = 'Tap the bookmark icon on any result card to save it here for comparison.' }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 10,
      }}>
        No cards saved yet
      </p>
      <p style={{
        fontFamily: 'var(--font)',
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        maxWidth: 300,
        marginBottom: 32,
      }}>
        {emptyMessage}
      </p>
      <button
        onClick={onBack}
        style={{
          fontFamily: 'var(--font)',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: 'var(--accent)',
          background: 'none',
          border: '1px solid var(--accent)',
          borderRadius: 10,
          padding: '12px 28px',
          cursor: 'pointer',
        }}
      >
        {backLabel}
      </button>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function SavedCards({ savedIds, scoreMap = {}, onRemove, onClearAll, onBack, title = 'Compare', emptyMessage, backLabel }) {
  const [applyHovered, setApplyHovered] = useState(null)

  const savedCards = savedIds
    .map(id => allCards.find(c => c.id === id))
    .filter(Boolean)

  if (savedCards.length === 0) return <EmptyState onBack={onBack} backLabel={backLabel} emptyMessage={emptyMessage} />

  // ── Clear winner logic ───────────────────────────────────────────────────
  const ranked = [...savedCards]
    .map(c => ({ id: c.id, score: scoreMap[c.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)
  const gap = ranked.length >= 2 ? ranked[0].score - ranked[1].score : 999
  const winnerCardId = ranked.length >= 2 && ranked[0].score > 0 && gap >= 10 ? ranked[0].id : null
  const winnerCard = winnerCardId ? savedCards.find(c => c.id === winnerCardId) : null

  const cardGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  }

  const cellStyle = { flex: '1 1 220px', maxWidth: 280 }
  const winnerCellStyle = {
    ...cellStyle,
    border: '1.5px solid var(--accent)',
    boxShadow: '0 0 0 3px var(--accent-dim)',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 860,
      width: '100%',
      margin: '0 auto',
      padding: 'clamp(20px, 4vw, 40px) 20px 80px',
    }}>

      {/* Page header */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 24,
        minHeight: 44,
      }}>
        <button
          onClick={onBack}
          aria-label={backLabel || 'Back'}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            background: 'none',
            border: '1px solid var(--card-border)',
            borderRadius: 8,
            padding: '0',
            width: 44,
            height: 44,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <h2 style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {title}
        </h2>
        <button
          onClick={onClearAll}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 4px',
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          Clear all
        </button>
      </div>

      {/* Clear winner banner */}
      {winnerCard && (
        <div style={{
          marginBottom: 16,
          padding: '14px 18px',
          borderRadius: 12,
          border: '1.5px solid var(--accent)',
          background: 'var(--accent-dim)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>✓</span>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.92rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}>
            Based on your profile, <strong>{winnerCard.name}</strong> is your clear winner.
          </p>
        </div>
      )}

      {/* Card chips — centered */}
      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 4,
      }}>
        {savedCards.map(card => (
          <CardChip
            key={card.id}
            card={card}
            onRemove={() => onRemove(card.id)}
          />
        ))}
      </div>

      {/* ── Rewards ── */}
      <SectionLabel>Rewards</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {savedCards.map(card => {
          const isWinner = card.id === winnerCardId
          return (
            <CardCell key={card.id} style={isWinner ? { border: '1.5px solid var(--accent)', boxShadow: '0 0 0 3px var(--accent-dim)' } : undefined}>
              {isWinner && <BestPill />}
              <CardCellLabel name={card.name} />
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}>
                {card.rewards}
              </p>
            </CardCell>
          )
        })}
      </div>

      {/* ── Sign-up Bonus ── */}
      {savedCards.some(c => c.signupBonus && c.signupBonus !== 'None') && (
        <>
          <SectionLabel>Welcome Offer</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedCards.map(card => {
              const isWinner = card.id === winnerCardId
              return (
                <CardCell key={card.id} style={isWinner ? { border: '1.5px solid var(--accent)', boxShadow: '0 0 0 3px var(--accent-dim)' } : undefined}>
                  {isWinner && <BestPill />}
                  <CardCellLabel name={card.name} />
                  <p style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.88rem',
                    color: card.signupBonus && card.signupBonus !== 'None'
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}>
                    {card.signupBonus && card.signupBonus !== 'None'
                      ? card.signupBonus
                      : 'No welcome offer'}
                  </p>
                </CardCell>
              )
            })}
          </div>
        </>
      )}

      {/* ── Key Benefits ── */}
      <SectionLabel>Key Benefits</SectionLabel>
      <div style={cardGrid}>
        {savedCards.map(card => {
          const isWinner = card.id === winnerCardId
          return (
          <CardCell key={card.id} style={isWinner ? winnerCellStyle : cellStyle}>
            {isWinner && <BestPill />}
            <CardCellLabel name={card.name} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {card.keyBenefits.map((b, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: 8,
                  fontFamily: 'var(--font)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>·</span>
                  {trimBenefit(b)}
                </li>
              ))}
            </ul>
          </CardCell>
          )
        })}
      </div>

      {/* ── Rating ── */}
      {savedCards.some(c => c.rating) && (
        <>
          <SectionLabel>Rating</SectionLabel>
          <div style={cardGrid}>
            {savedCards.map(card => {
              const isWinner = card.id === winnerCardId
              return (
              <CardCell key={card.id} style={isWinner ? winnerCellStyle : cellStyle}>
                {isWinner && <BestPill />}
                <CardCellLabel name={card.name} />
                {card.rating ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Stars rating={card.rating} />
                      <span style={{
                        fontFamily: 'var(--font)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        {card.rating.toFixed(1)}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'var(--font)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}>
                      {card.ratingCount} reviews · {card.ratingSource}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'var(--font)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    No rating available
                  </p>
                )}
              </CardCell>
              )
            })}
          </div>
        </>
      )}

      {/* ── Apply buttons ── */}
      {savedCards.some(c => c.applyUrl) && (
        <>
          <SectionLabel>Apply</SectionLabel>
          <div style={cardGrid}>
            {savedCards.map(card => (
              <div key={card.id} style={cellStyle}>
                {card.applyUrl ? (
                  <a
                    href={card.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(Events.APPLY_CLICKED, {
                      card_id: card.id, card_name: card.name, issuer: card.issuer,
                    })}
                    onMouseEnter={() => setApplyHovered(card.id)}
                    onMouseLeave={() => setApplyHovered(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      width: '100%',
                      padding: '13px 16px',
                      background: applyHovered === card.id ? 'var(--accent-hover)' : 'var(--accent)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      borderRadius: 10,
                      textDecoration: 'none',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    Apply — {card.issuer} ↗
                  </a>
                ) : (
                  <CardCell>
                    <p style={{ fontFamily: 'var(--font)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Apply at {card.issuer}'s website
                    </p>
                  </CardCell>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
