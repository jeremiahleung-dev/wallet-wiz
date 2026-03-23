export default function Footer({ onPrivacy }) {
  return (
    <footer style={{
      padding: '32px 36px',
      borderTop: '1px solid var(--card-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <p style={{
        fontFamily: 'var(--font)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        maxWidth: 560,
      }}>
        Wallet Wiz is an independent comparison tool. We may earn a commission when you apply for a card through our links — at no cost to you.
        Recommendations are not financial advice. Always review the full terms on the issuer's website before applying.
      </p>
      <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
        <button
          onClick={onPrivacy}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.78rem',
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
          Privacy Policy
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font)' }}>
          © {new Date().getFullYear()} Wallet Wiz
        </span>
      </div>
    </footer>
  )
}
