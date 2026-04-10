import { useState, useMemo } from 'react'
import { cards as allCards } from '../data/cards'

const ISSUER_ORDER = [
  'Capital One',
  'Chase',
  'Citi',
  'American Express',
  'Bank of America',
  'Discover',
  'Wells Fargo',
  'U.S. Bank',
  'Goldman Sachs',
]

const animClassMap = {
  idle: '',
  out: 'anim-slide-out-left',
  'out-right': 'anim-slide-out-right',
  in: 'anim-slide-in-right',
  'in-left': 'anim-slide-in-left',
}

// ── Custom checkbox ─────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, label, subtle }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      padding: '10px 16px',
      userSelect: 'none',
    }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <div style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--card-border)'}`,
        background: checked ? 'var(--accent)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 3.5L3.8 6.5L9 1" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{
        fontFamily: 'var(--font)',
        fontSize: subtle ? '0.82rem' : '0.88rem',
        color: subtle ? 'var(--text-secondary)' : 'var(--text-primary)',
        lineHeight: 1.4,
      }}>
        {label}
      </span>
    </label>
  )
}

// ── Issuer accordion row ─────────────────────────────────────────────────────
function IssuerAccordion({ issuer, cards, selected, onToggle }) {
  const [open, setOpen] = useState(false)
  const selectedCount = cards.filter(c => selected.has(c.id)).length

  return (
    <div style={{
      border: '1px solid var(--card-border)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: open ? 'var(--option-hover)' : 'var(--surface)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          minHeight: 52,
        }}
      >
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          {issuer}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selectedCount > 0 && (
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              borderRadius: 20,
              padding: '2px 9px',
            }}>
              {selectedCount} selected
            </span>
          )}
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
          >
            <path d="M4 6L8 10L12 6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Card list */}
      {open && (
        <div style={{ borderTop: '1px solid var(--card-border)' }}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              style={{
                borderTop: i > 0 ? '1px solid var(--card-border)' : 'none',
              }}
            >
              <Checkbox
                checked={selected.has(card.id)}
                onChange={() => onToggle(card.id)}
                label={card.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function WalletStep({ animState, onComplete }) {
  const [selected, setSelected] = useState(new Set())
  const [noneOfAbove, setNoneOfAbove] = useState(false)
  const [otherText, setOtherText] = useState('')

  const byIssuer = useMemo(() => {
    const groups = {}
    allCards.forEach(card => {
      if (!groups[card.issuer]) groups[card.issuer] = []
      groups[card.issuer].push(card)
    })
    return ISSUER_ORDER
      .filter(i => groups[i])
      .map(i => ({ issuer: i, cards: groups[i] }))
  }, [])

  const toggleCard = (id) => {
    setNoneOfAbove(false)
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleNone = () => {
    const next = !noneOfAbove
    setNoneOfAbove(next)
    if (next) setSelected(new Set())
  }

  const handleContinue = () => onComplete(Array.from(selected))

  const count = selected.size

  return (
    <>
      <div
        className={animClassMap[animState] || ''}
        style={{ width: '100%', maxWidth: 560, paddingBottom: 96 }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.8vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 12,
            letterSpacing: '-0.025em',
          }}>
            What's in your wallet?
          </h2>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
          }}>
            Select any cards you already own — we'll only recommend what's new for you.
          </p>
        </div>

        {/* Issuer accordions */}
        {byIssuer.map(({ issuer, cards }) => (
          <IssuerAccordion
            key={issuer}
            issuer={issuer}
            cards={cards}
            selected={selected}
            onToggle={toggleCard}
          />
        ))}

        {/* Divider */}
        <div style={{
          borderTop: '1px solid var(--card-border)',
          margin: '20px 0',
        }} />

        {/* None of the above */}
        <div style={{
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          marginBottom: 12,
        }}>
          <Checkbox
            checked={noneOfAbove}
            onChange={toggleNone}
            label="None of the above"
            subtle
          />
        </div>

        {/* Other text input */}
        <div style={{
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          padding: '12px 16px',
          background: 'var(--surface)',
        }}>
          <label style={{
            fontFamily: 'var(--font)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: 8,
          }}>
            Other
          </label>
          <input
            type="text"
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
            placeholder="e.g. Robinhood Gold Card, Petal 2…"
            style={{
              width: '100%',
              fontFamily: 'var(--font)',
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      {/* Sticky continue bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg)',
        borderTop: '1px solid var(--card-border)',
        padding: '14px 20px',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 50,
      }}>
        {count > 0 && (
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
          }}>
            {count} card{count !== 1 ? 's' : ''} excluded
          </p>
        )}
        <button
          onClick={handleContinue}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#fff',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            padding: '13px 32px',
            cursor: 'pointer',
            minHeight: 48,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          {count > 0 ? 'Continue →' : 'Continue →'}
        </button>
      </div>
    </>
  )
}
