import { useState } from 'react'
import { getMatchReasons } from '../utils/recommend'
import CardVisual from './CardVisual'

export default function Results({ recommendations, answers, onRestart }) {
  const [expanded, setExpanded] = useState(0)

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 24px 60px',
      maxWidth: 720,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: 48,
        animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      }}>
        <h2 style={{
          fontFamily: 'var(--font)',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: 10,
        }}>
          Your recommendations.
        </h2>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
        }}>
          Ranked by how well they match your profile.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {recommendations.map((card, i) => (
          <ResultCard
            key={card.id}
            card={card}
            rank={i}
            answers={answers}
            isExpanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? -1 : i)}
          />
        ))}
      </div>

      {/* Restart */}
      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <button
          onClick={onRestart}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
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
        <p style={{
          marginTop: 16,
          fontFamily: 'var(--font)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}>
          Approval not guaranteed — always verify your eligibility with the issuer.
        </p>
      </div>
    </div>
  )
}

function ResultCard({ card, rank, answers, isExpanded, onToggle }) {
  const reasons = getMatchReasons(card, answers)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${isExpanded ? 'var(--accent)' : hovered ? 'var(--text-muted)' : 'var(--card-border)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        animation: `fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${rank * 0.08}s both`,
        cursor: 'pointer',
      }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '24px 24px',
      }}>
        {/* Rank badge */}
        <div style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: rank === 0 ? 'var(--accent-dim)' : 'var(--surface)',
          border: `1px solid ${rank === 0 ? 'var(--accent)' : 'var(--card-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font)',
          fontSize: '0.85rem',
          color: rank === 0 ? 'var(--accent)' : 'var(--text-muted)',
        }}>
          {rank + 1}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              {card.name}
            </span>
            {rank === 0 && (
              <span style={{
                fontFamily: 'var(--font)',
                fontSize: '0.72rem',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 20,
                padding: '1px 8px',
                letterSpacing: '0.05em',
              }}>
                Top Pick
              </span>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            {card.tag}
          </div>
        </div>

        {/* Annual fee */}
        <div style={{
          flexShrink: 0,
          textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: card.annualFee === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
          }}>
            {card.annualFee === 0 ? 'No fee' : `$${card.annualFee}/yr`}
          </div>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            {card.issuer}
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          flexShrink: 0,
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          transform: isExpanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.25s ease',
          marginLeft: 4,
        }}>
          ↓
        </div>
      </div>

      {/* Match reasons */}
      {reasons.length > 0 && (
        <div style={{
          padding: '0 24px 20px',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          {reasons.map((r, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 20,
              padding: '3px 12px',
            }}>
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--card-border)',
            padding: '28px 24px',
            animation: 'fadeIn 0.25s ease both',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Visual card */}
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <CardVisual card={card} />
          </div>

          {/* Rewards */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Rewards</SectionLabel>
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
            }}>
              {card.rewards}
            </p>
          </div>

          {/* Sign-up bonus */}
          {card.signupBonus && card.signupBonus !== 'None' && (
            <div style={{ marginBottom: 24 }}>
              <SectionLabel>Welcome Offer</SectionLabel>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}>
                {card.signupBonus}
              </p>
            </div>
          )}

          {/* Key benefits */}
          <div>
            <SectionLabel>Key Benefits</SectionLabel>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {card.keyBenefits.map((b, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: 10,
                  fontFamily: 'var(--font)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font)',
      fontSize: '0.72rem',
      letterSpacing: '0.12em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: 8,
    }}>
      {children}
    </div>
  )
}
