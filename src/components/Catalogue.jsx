import { useState, useMemo } from 'react'
import { cards } from '../data/cards'

// ── Filters ──────────────────────────────────────────────────────────────────

const FILTERS = [
  // Reward type
  { id: 'cash_back',       label: 'Cash Back',       group: 'Reward',    match: c => c.goals.includes('cash_back') },
  { id: 'travel',          label: 'Travel',           group: 'Reward',    match: c => c.goals.includes('travel') || c.spending.includes('travel') },
  { id: 'building_credit', label: 'Building Credit',  group: 'Reward',    match: c => c.goals.includes('building_credit') },
  { id: 'premium',         label: 'Premium',          group: 'Reward',    match: c => c.goals.includes('premium') },
  // Best for
  { id: 'dining',          label: 'Dining',           group: 'Best For',  match: c => c.spending.includes('dining') },
  { id: 'groceries',       label: 'Groceries',        group: 'Best For',  match: c => c.spending.includes('groceries') },
  { id: 'gas',             label: 'Gas',              group: 'Best For',  match: c => c.spending.includes('gas') },
  { id: 'online',          label: 'Online Shopping',  group: 'Best For',  match: c => c.spending.includes('online') },
  // Annual fee
  { id: 'no_fee',          label: 'No Annual Fee',    group: 'Fee',       match: c => c.annualFee === 0 },
  { id: 'low_fee',         label: 'Under $100/yr',    group: 'Fee',       match: c => c.annualFee > 0 && c.annualFee < 100 },
  { id: 'premium_fee',     label: '$100+ /yr',        group: 'Fee',       match: c => c.annualFee >= 100 },
  // Lifestyle
  { id: 'everyday',        label: 'Everyday Use',     group: 'Lifestyle', match: c => c.lifestyle.includes('everyday') },
  { id: 'traveler',        label: 'Frequent Flyer',   group: 'Lifestyle', match: c => c.lifestyle.includes('traveler') },
  { id: 'luxury',          label: 'Luxury Perks',     group: 'Lifestyle', match: c => c.lifestyle.includes('luxury') },
  { id: 'simple',          label: 'Keep It Simple',   group: 'Lifestyle', match: c => c.lifestyle.includes('simple') },
]

const ISSUER_ORDER = [
  'American Express', 'Bank of America', 'Capital One', 'Chase', 'Citi',
  'Discover', 'Goldman Sachs', 'U.S. Bank', 'Wells Fargo',
]

export default function Catalogue({ savedIds, onToggleSave, onViewMyCards }) {
  const [activeFilters, setActiveFilters] = useState([])

  const toggleFilter = (id) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredCards = useMemo(() => {
    if (activeFilters.length === 0) return cards
    return cards.filter(card =>
      activeFilters.some(id => {
        const f = FILTERS.find(f => f.id === id)
        return f ? f.match(card) : false
      })
    )
  }, [activeFilters])

  const byIssuer = useMemo(() => {
    const groups = {}
    for (const card of filteredCards) {
      if (!groups[card.issuer]) groups[card.issuer] = []
      groups[card.issuer].push(card)
    }
    const sorted = ISSUER_ORDER
      .filter(i => groups[i])
      .map(i => [i, groups[i]])
    // append any issuers not in ISSUER_ORDER
    Object.keys(groups).forEach(i => {
      if (!ISSUER_ORDER.includes(i)) sorted.push([i, groups[i]])
    })
    return sorted
  }, [filteredCards])

  const groups = ['Reward', 'Best For', 'Fee', 'Lifestyle']

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* ── Page title ── */}
      <div style={{ padding: '4px 28px 20px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          marginBottom: 6,
        }}>
          Card Catalogue
        </h1>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
          {activeFilters.length > 0 ? ' matching your filters' : ' across all issuers'}
          {savedIds.length > 0 && (
            <>
              {' · '}
              <button
                onClick={onViewMyCards}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                View {savedIds.length} saved
              </button>
            </>
          )}
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'linear-gradient(180deg, var(--bg) 70%, transparent 100%)',
        paddingBottom: 16,
      }}>
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {groups.map(group => {
            const groupFilters = FILTERS.filter(f => f.group === group)
            return (
              <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  minWidth: 68,
                  flexShrink: 0,
                }}>
                  {group}
                </span>
                {groupFilters.map(f => (
                  <FilterPill
                    key={f.id}
                    label={f.label}
                    active={activeFilters.includes(f.id)}
                    onClick={() => toggleFilter(f.id)}
                  />
                ))}
              </div>
            )
          })}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              style={{
                alignSelf: 'flex-start',
                marginLeft: 76,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                padding: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Clear all filters ×
            </button>
          )}
        </div>
      </div>

      {/* ── Issuer sections ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 28px 48px',
        maxWidth: 1120,
        margin: '0 auto',
        width: '100%',
      }}>
        {byIssuer.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 0',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
          }}>
            No cards match your current filters.
          </div>
        ) : (
          byIssuer.map(([issuer, issuerCards]) => (
            <IssuerSection
              key={issuer}
              issuer={issuer}
              cards={issuerCards}
              savedIds={savedIds}
              onToggleSave={onToggleSave}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font)',
        fontSize: '0.78rem',
        fontWeight: active ? 600 : 400,
        color: active ? '#fff' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: active ? 'var(--accent)' : hovered ? 'var(--card-bg)' : 'transparent',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--card-border)'}`,
        borderRadius: 20,
        padding: '5px 14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  )
}

// ── Issuer section ────────────────────────────────────────────────────────────

function IssuerSection({ issuer, cards, savedIds, onToggleSave }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
      }}>
        <h2 style={{
          fontFamily: 'var(--font)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          flexShrink: 0,
        }}>
          {issuer}
        </h2>
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 10,
          padding: '2px 9px',
        }}>
          {cards.length}
        </span>
        <div style={{
          flex: 1,
          height: 1,
          background: 'var(--card-border)',
          opacity: 0.6,
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: 14,
      }}>
        {cards.map(card => (
          <CardTile
            key={card.id}
            card={card}
            saved={savedIds.includes(card.id)}
            onToggle={onToggleSave}
          />
        ))}
      </div>
    </section>
  )
}

// ── Card tile ─────────────────────────────────────────────────────────────────

function CardTile({ card, saved, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const [g0, g1] = card.gradient

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--card-bg)',
        border: `1px solid ${hovered ? 'var(--card-border)' : 'var(--card-border)'}`,
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        cursor: 'default',
      }}
    >
      {/* Gradient card face */}
      <div style={{
        background: `linear-gradient(135deg, ${g0} 0%, ${g1} 100%)`,
        padding: '14px 16px 18px',
        position: 'relative',
        aspectRatio: '1.7 / 1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Annual fee badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            borderRadius: 6,
            padding: '3px 8px',
          }}>
            {card.annualFee === 0 ? 'NO FEE' : `$${card.annualFee}/YR`}
          </span>

          {/* Network badge */}
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '0.58rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {card.network}
          </span>
        </div>

        {/* Card name on gradient */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.3,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            {card.name}
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div style={{
        padding: '10px 14px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        {card.tag ? (
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '0.68rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            lineHeight: 1.3,
            flex: 1,
          }}>
            {card.tag}
          </span>
        ) : (
          <span style={{ flex: 1 }} />
        )}

        {/* Save / unsave button */}
        <button
          onClick={() => onToggle(card.id)}
          title={saved ? 'Remove from My Cards' : 'Save to My Cards'}
          style={{
            background: saved ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${saved ? 'var(--accent)' : 'var(--card-border)'}`,
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: saved ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.85rem',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!saved) {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={e => {
            if (!saved) {
              e.currentTarget.style.borderColor = 'var(--card-border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }
          }}
        >
          {saved ? '★' : '☆'}
        </button>
      </div>
    </div>
  )
}
