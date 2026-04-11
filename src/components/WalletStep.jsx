import { useState, useMemo, useRef } from 'react'
import { cards as allCards } from '../data/cards'
import { trackEvent, Events } from '../utils/track'

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

const WALLET_KEY = 'optimal_wallet'

function loadWallet() {
  try { return new Set(JSON.parse(localStorage.getItem(WALLET_KEY) || '[]')) } catch { return new Set() }
}

function saveWallet(set) {
  try { localStorage.setItem(WALLET_KEY, JSON.stringify([...set])) } catch {}
}

// Strip trademark symbols and issuer prefix noise for display in the dropdown.
function walletDisplayName(name, issuer) {
  let n = name.replace(/[®℠™]/g, '').replace(/\s+/g, ' ').trim()

  // Strip " from Amex" suffix
  n = n.replace(/\s+from\s+Amex$/i, '')
  // Strip " by Citi" suffix
  n = n.replace(/\s+by\s+Citi$/i, '')
  // Strip leading "The "
  n = n.replace(/^The\s+/i, '')

  // Strip issuer prefix, but only when the remainder starts with an uppercase letter
  // (avoids mangling "Discover it Secured" → "it Secured")
  const escaped = issuer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const prefixRe = new RegExp('^' + escaped + '\\s+', 'i')
  if (prefixRe.test(n)) {
    const rest = n.replace(prefixRe, '')
    if (/^[A-Z]/.test(rest)) n = rest
  }

  // Strip trailing network/type noise
  n = n
    .replace(/\s+Visa\s+Infinite\s+Card$/i, '')
    .replace(/\s+Visa\s+Signature\s+Card$/i, '')
    .replace(/\s+Visa\s+Signature$/i, '')
    .replace(/\s+Credit\s+Card$/i, '')
    .trim()

  return n
}

const animClassMap = {
  idle: '',
  out: 'anim-fade-out',
  'out-right': 'anim-fade-out',
  in: 'anim-fade-in',
  'in-left': 'anim-fade-in',
}

// ── Custom checkbox row ──────────────────────────────────────────────────────
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

// ── Issuer accordion ─────────────────────────────────────────────────────────
function IssuerAccordion({ issuer, cards, selected, onToggle }) {
  const [open, setOpen] = useState(false)
  const selectedCount = cards.filter(c => selected.has(c.id)).length

  const handleToggle = () => {
    const opening = !open
    setOpen(opening)
    if (opening) trackEvent(Events.WALLET_ACCORDION_OPENED, { issuer })
  }

  return (
    <div style={{
      border: '1px solid var(--card-border)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      <button
        onClick={handleToggle}
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
          color: open ? '#0B1A35' : 'var(--text-primary)',
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

      {open && (
        <div style={{ borderTop: '1px solid var(--card-border)' }}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              style={{ borderTop: i > 0 ? '1px solid var(--card-border)' : 'none' }}
            >
              <Checkbox
                checked={selected.has(card.id)}
                onChange={() => onToggle(card.id)}
                label={walletDisplayName(card.name, issuer)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Highlight matched substring ──────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── Search result row ────────────────────────────────────────────────────────
function SearchResultRow({ card, query, checked, onToggle, isLast }) {
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--card-border)' }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        padding: '11px 16px',
        userSelect: 'none',
      }}>
        <input type="checkbox" checked={checked} onChange={onToggle} style={{ display: 'none' }} />
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
        <div>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.88rem',
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}>
            <Highlight text={card.displayName} query={query} />
          </p>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 1,
          }}>
            {card.issuer}
          </p>
        </div>
      </label>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function WalletStep({ animState, onComplete }) {
  const [selected, setSelected] = useState(loadWallet)
  const [noneOfAbove, setNoneOfAbove] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const searchDebounceRef = useRef(null)

  // Flat list with pre-computed display names for fast filtering
  const allCardsMapped = useMemo(() =>
    allCards.map(card => ({
      ...card,
      displayName: walletDisplayName(card.name, card.issuer),
    })),
  [])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allCardsMapped.filter(card =>
      card.displayName.toLowerCase().includes(q) ||
      card.name.toLowerCase().includes(q) ||
      card.issuer.toLowerCase().includes(q)
    )
  }, [query, allCardsMapped])

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
      const action = next.has(id) ? 'remove' : 'add'
      if (action === 'remove') next.delete(id)
      else next.add(id)
      saveWallet(next)
      trackEvent(Events.WALLET_CARD_TOGGLED, { card_id: id, action })
      return next
    })
  }

  const toggleNone = () => {
    const next = !noneOfAbove
    setNoneOfAbove(next)
    if (next) {
      trackEvent(Events.WALLET_NONE_SELECTED)
      setSelected(new Set())
      saveWallet(new Set())
    }
  }

  const handleClearAll = () => {
    setSelected(new Set())
    setNoneOfAbove(false)
    saveWallet(new Set())
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

        {/* Search box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          padding: '11px 14px',
          background: 'var(--surface)',
          marginBottom: 16,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" stroke="var(--text-muted)" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              clearTimeout(searchDebounceRef.current)
              if (e.target.value.trim()) {
                searchDebounceRef.current = setTimeout(() => {
                  trackEvent(Events.WALLET_SEARCH_USED, { query_length: e.target.value.trim().length })
                }, 800)
              }
            }}
            placeholder="Search cards…"
            style={{
              flex: 1,
              fontFamily: 'var(--font)',
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); searchRef.current?.focus() }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                color: 'var(--text-muted)',
                fontSize: '1rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Search results OR issuer accordions */}
        {query.trim() ? (
          <div style={{
            border: '1px solid var(--card-border)',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            {searchResults.length > 0 ? (
              searchResults.map((card, i) => (
                <SearchResultRow
                  key={card.id}
                  card={card}
                  query={query.trim()}
                  checked={selected.has(card.id)}
                  onToggle={() => toggleCard(card.id)}
                  isLast={i === searchResults.length - 1}
                />
              ))
            ) : (
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                padding: '16px',
                textAlign: 'center',
              }}>
                No cards found
              </p>
            )}
          </div>
        ) : (
          byIssuer.map(({ issuer, cards }) => (
            <IssuerAccordion
              key={issuer}
              issuer={issuer}
              cards={cards}
              selected={selected}
              onToggle={toggleCard}
            />
          ))
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--card-border)', margin: '20px 0' }} />

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

        {/* Other */}
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
          <>
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}>
              {count} card{count !== 1 ? 's' : ''} excluded
            </p>
            <button
              onClick={handleClearAll}
              style={{
                fontFamily: 'var(--font)',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'none',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                padding: '10px 16px',
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Clear all
            </button>
          </>
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
          Continue →
        </button>
      </div>
    </>
  )
}
