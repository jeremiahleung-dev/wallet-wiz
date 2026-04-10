export default function Footer({ onPrivacy }) {
  return (
    <footer style={{
      padding: '20px 24px',
      borderTop: '1px solid var(--card-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <p style={{
        fontFamily: 'var(--font)',
        fontSize: '0.82rem',
        fontWeight: 400,
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        maxWidth: 560,
      }}>
        Card links are provided for reference only. We do not earn any commission. Recommendations are not financial advice. Always review the full terms on the issuer's website before applying.
      </p>
      <div style={{ display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={onPrivacy}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.82rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 4px',
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          Privacy Policy
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font)', fontWeight: 400 }}>
          © {new Date().getFullYear()} optimal
        </span>
      </div>
    </footer>
  )
}
