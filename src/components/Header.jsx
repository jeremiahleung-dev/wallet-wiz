export default function Header({ onHome, savedCount = 0, onMyCards }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'max(16px, env(safe-area-inset-top)) 24px 12px',
      gap: 8,
    }}>
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


      {/* My Cards tab — far right */}
      <button
        onClick={onMyCards}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font)',
          fontSize: '0.82rem',
          fontWeight: 500,
          color: savedCount > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
          background: 'none',
          border: '1px solid var(--card-border)',
          borderRadius: 8,
          padding: '6px 14px',
          cursor: 'pointer',
          minHeight: 36,
          transition: 'border-color 0.2s, color 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
      >
        My Cards
        {savedCount > 0 && (
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
            {savedCount}
          </span>
        )}
      </button>
    </header>
  )
}
