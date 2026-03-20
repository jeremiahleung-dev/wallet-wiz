import { useState } from 'react'

export default function Welcome({ onStart }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      {/* Decorative card stack */}
      <div style={{ position: 'relative', width: 280, height: 168, marginBottom: 56 }}>
        {[2, 1, 0].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: 280,
            height: 168,
            borderRadius: 16,
            background: i === 0
              ? 'linear-gradient(135deg, #1a1a2e 0%, #c8a96e 100%)'
              : i === 1
              ? 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)'
              : 'linear-gradient(135deg, #0d0d0d 0%, #4a0080 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            transform: `rotate(${(i - 1) * 6}deg) translateY(${i * 4}px)`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: `fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both`,
          }}>
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: 24,
              right: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
              <div style={{
                fontFamily: 'var(--font)',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
              }}>
                •••• •••• •••• {1234 + i * 1111}
              </div>
              <div style={{
                width: 36,
                height: 24,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
              }} />
            </div>
            {/* Chip */}
            <div style={{
              position: 'absolute',
              top: 24,
              left: 24,
              width: 36,
              height: 28,
              borderRadius: 5,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
            }} />
          </div>
        ))}
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font)',
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 400,
        lineHeight: 1.15,
        color: 'var(--text-primary)',
        marginBottom: 16,
        animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
      }}>
        Find your perfect card.
      </h1>

      <p style={{
        fontFamily: 'var(--font)',
        fontSize: '1.15rem',
        color: 'var(--text-secondary)',
        maxWidth: 440,
        lineHeight: 1.6,
        marginBottom: 48,
        animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
      }}>
        Six quick questions. Personalized card recommendations matched to your credit, lifestyle, and goals.
      </p>

      <button
        onClick={onStart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: 'var(--font)',
          fontSize: '1.05rem',
          color: hovered ? '#0e0e0e' : 'var(--accent)',
          background: hovered ? 'var(--accent)' : 'transparent',
          border: '1px solid var(--accent)',
          borderRadius: '40px',
          padding: '14px 40px',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          letterSpacing: '0.02em',
          animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
        }}
      >
        Get started →
      </button>

      <p style={{
        marginTop: 24,
        fontFamily: 'var(--font)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both',
      }}>
        No personal data collected. Ever.
      </p>
    </div>
  )
}
