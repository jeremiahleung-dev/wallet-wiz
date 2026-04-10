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

function CardChip({ name, isSelected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        fontFamily: 'var(--font)',
        fontSize: '0.8rem',
        fontWeight: isSelected ? 600 : 400,
        color: isSelected ? '#fff' : 'var(--text-primary)',
        background: isSelected ? 'var(--accent)' : 'var(--surface)',
        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--card-border)'}`,
        borderRadius: 20,
        padding: '7px 13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        minHeight: 36,
        lineHeight: 1.3,
        textAlign: 'left',
      }}
    >
      {name}
    </button>
  )
}

export default function WalletStep({ animState, onComplete }) {
  const [selected, setSelected] = useState(new Set())

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

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleContinue = () => onComplete(Array.from(selected))

  const count = selected.size

  return (
    <>
      <div
        className={animClassMap[animState] || ''}
        style={{ width: '100%', maxWidth: 720, paddingBottom: 96 }}
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

        {/* Issuer groups */}
        {byIssuer.map(({ issuer, cards }) => (
          <div key={issuer} style={{ marginBottom: 20 }}>
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}>
              {issuer}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cards.map(card => (
                <CardChip
                  key={card.id}
                  name={card.name}
                  isSelected={selected.has(card.id)}
                  onToggle={() => toggle(card.id)}
                />
              ))}
            </div>
          </div>
        ))}
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
          {count > 0 ? 'Continue →' : 'None — Continue →'}
        </button>
      </div>
    </>
  )
}
