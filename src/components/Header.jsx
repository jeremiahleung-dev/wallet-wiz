export default function Header({ theme, onToggleTheme, onHome }) {
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
      padding: 'max(16px, env(safe-area-inset-top)) 24px 0',
      pointerEvents: 'none',
    }}>
      <button
        onClick={onHome}
        aria-label="Go to home"
        style={{
          pointerEvents: 'auto',
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
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        optimal
      </button>

      <button
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        style={{
          pointerEvents: 'auto',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '50%',
          width: 44,
          height: 44,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow)',
          flexShrink: 0,
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
        {theme === 'dark' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  )
}
