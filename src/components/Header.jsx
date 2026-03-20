import { useEffect, useState } from 'react'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 36px',
      pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '1.25rem',
          fontWeight: 500,
          fontStyle: 'italic',
          color: 'var(--accent)',
          letterSpacing: '0.01em',
        }}>
          Wallet Wiz
        </span>
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        style={{
          pointerEvents: 'auto',
          background: 'none',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '6px 14px',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'var(--surface)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.borderColor = 'var(--text-muted)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.borderColor = 'var(--card-border)'
        }}
      >
        {theme === 'dark' ? '☀ Light' : '◗ Dark'}
      </button>
    </header>
  )
}
