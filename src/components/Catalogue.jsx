import { useState, useMemo, useRef, useEffect } from 'react'
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterRef = useRef(null)

  const toggleFilter = (id) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  // Close filter panel on outside click
  useEffect(() => {
    if (!filtersOpen) return
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFiltersOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [filtersOpen])

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

      {/* ── Page title + filter trigger ── */}
      <div style={{ padding: '4px 28px 20px', maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 6 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
          }}>
            Card Catalogue
          </h1>

          {/* Filter button */}
          <div ref={filterRef} style={{ position: 'relative', flexShrink: 0, marginTop: 6 }}>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: 'var(--font)',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: filtersOpen || activeFilters.length > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                background: 'var(--card-bg)',
                border: `1px solid ${filtersOpen || activeFilters.length > 0 ? 'var(--accent)' : 'var(--card-border)'}`,
                borderRadius: 8,
                padding: '7px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="4" x2="14" y2="4"/>
                <line x1="4" y1="8" x2="12" y2="8"/>
                <line x1="6" y1="12" x2="10" y2="12"/>
              </svg>
              Filters
              {activeFilters.length > 0 && (
                <span style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  lineHeight: '16px',
                }}>
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Filter dropdown panel */}
            {filtersOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--card-border)',
                borderRadius: 14,
                padding: '16px 18px 14px',
                minWidth: 320,
                maxWidth: 'min(480px, calc(100vw - 48px))',
                boxShadow: 'var(--shadow-card)',
                zIndex: 30,
                animation: 'fadeIn 0.15s ease',
              }}>
                {groups.map((group, i) => {
                  const groupFilters = FILTERS.filter(f => f.group === group)
                  return (
                    <div key={group} style={{ marginBottom: i < groups.length - 1 ? 14 : 0 }}>
                      <div style={{
                        fontFamily: 'var(--font)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 8,
                      }}>
                        {group}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {groupFilters.map(f => (
                          <FilterPill
                            key={f.id}
                            label={f.label}
                            active={activeFilters.includes(f.id)}
                            onClick={() => toggleFilter(f.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => setActiveFilters([])}
                    style={{
                      marginTop: 14,
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
                    Clear all ×
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '0.92rem',
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
                  fontSize: '0.92rem',
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 10,
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
        padding: '8px 10px 10px',
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
            fontSize: '0.48rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            borderRadius: 4,
            padding: '2px 5px',
          }}>
            {card.annualFee === 0 ? 'NO FEE' : `$${card.annualFee}/YR`}
          </span>

          {/* Network badge */}
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '0.44rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.45)',
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
            fontSize: '0.58rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.3,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}>
            {card.name}
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div style={{
        padding: '6px 10px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
      }}>
        {card.tag ? (
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '0.58rem',
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
            borderRadius: 6,
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: saved ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.68rem',
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
