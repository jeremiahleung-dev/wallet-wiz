import { useEffect } from 'react'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{
      fontFamily: 'var(--font)',
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 8,
      letterSpacing: '0.01em',
    }}>
      {title}
    </h3>
    <div style={{
      fontFamily: 'var(--font)',
      fontSize: '0.9rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
    }}>
      {children}
    </div>
  </div>
)

export default function PrivacyModal({ onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-card)',
          animation: 'fadeUp 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 32px 20px',
          borderBottom: '1px solid var(--card-border)',
          position: 'sticky',
          top: 0,
          background: 'var(--card-bg)',
          zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: '1.4rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}>
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              fontFamily: 'var(--font)',
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 32px' }}>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: 28,
          }}>
            Last updated: March 2026
          </p>

          <Section title="What we collect">
            <p>Wallet Wiz does not collect, store, or transmit any personally identifiable information. Your survey answers (credit score range, spending habits, lifestyle preferences) are processed entirely in your browser and are never sent to our servers.</p>
            <br />
            <p>We use Vercel Analytics to collect anonymous, aggregate usage data — such as how many people complete the survey or which screens are visited. This data contains no personal identifiers and cannot be traced back to any individual user. Vercel Analytics does not use cookies.</p>
          </Section>

          <Section title="What we never collect">
            <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Your name, email address, or contact information',
                'Your actual credit score or credit report',
                'Your social security number or date of birth',
                'Your financial account information',
                'Any payment card numbers',
                'Your precise location',
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Affiliate disclosure">
            <p>Wallet Wiz is an independent comparison service. Some card recommendations include links to issuer application pages. We may receive compensation when you apply for or are approved for a card through these links. This compensation does not influence our recommendations — cards are ranked solely by how well they match your stated profile.</p>
            <br />
            <p>You should always review the full terms, conditions, and current offers directly on the issuer's website before applying.</p>
          </Section>

          <Section title="Not financial advice">
            <p>Nothing on Wallet Wiz constitutes financial, legal, or credit advice. Card recommendations are informational only. Approval is not guaranteed and is determined solely by the card issuer based on your full credit profile.</p>
          </Section>

          <Section title="Third-party links">
            <p>When you click "Apply Now," you leave Wallet Wiz and are directed to the card issuer's website. We are not responsible for the content, privacy practices, or data handling of third-party sites.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>We may update this policy as the product evolves. Continued use of Wallet Wiz after changes are posted constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="Contact">
            <p>Questions about this policy? Reach us at <span style={{ color: 'var(--accent)' }}>privacy@walletwiz.app</span></p>
          </Section>
        </div>
      </div>
    </div>
  )
}
