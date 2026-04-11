import { useState, useEffect, useRef } from 'react'

export default function Header({ onHome, savedCount = 0, onMyCards, onCatalogue, onFeedback, activeScreen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleNav = (fn) => {
    setMenuOpen(false)
    fn()
  }

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'max(16px, env(safe-area-inset-top)) 24px 12px',
      gap: 8,
    }}>
      {/* Logo */}
      <button
        onClick={onHome}
        aria-label="Go to home"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px 8px',
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        optimal
      </button>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* Feedback — plain text */}
        <button
          onClick={onFeedback}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.82rem',
            fontWeight: 400,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          Feedback?
        </button>

        {/* Hamburger menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              position: 'relative',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
          >
            <span style={{ display: 'block', width: 14, height: 1.5, background: 'var(--text-secondary)', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 14, height: 1.5, background: 'var(--text-secondary)', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 14, height: 1.5, background: 'var(--text-secondary)', borderRadius: 1 }} />
            {savedCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '50%',
                minWidth: 16,
                height: 16,
                fontSize: '0.62rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
              }}>
                {savedCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 12,
              padding: '6px',
              minWidth: 160,
              boxShadow: 'var(--shadow)',
              zIndex: 50,
              animation: 'fadeIn 0.15s ease',
            }}>
              <MenuItem
                label="Catalogue"
                active={activeScreen === 'catalogue'}
                onClick={() => handleNav(onCatalogue)}
              />
              <MenuItem
                label="My Cards"
                active={activeScreen === 'my-cards'}
                badge={savedCount > 0 ? savedCount : null}
                onClick={() => handleNav(onMyCards)}
              />
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

function MenuItem({ label, active, badge, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '9px 14px',
        background: active || hovered ? 'var(--accent-dim)' : 'none',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontFamily: 'var(--font)',
        fontSize: '0.88rem',
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--accent)' : 'var(--text-primary)',
        textAlign: 'left',
        transition: 'background 0.15s',
        gap: 8,
      }}
    >
      {label}
      {badge && (
        <span style={{
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '50%',
          minWidth: 18,
          height: 18,
          fontSize: '0.68rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}
