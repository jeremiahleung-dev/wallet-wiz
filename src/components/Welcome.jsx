import { useState } from 'react'
import Footer from './Footer'

const steps = [
  { n: '01', label: 'Answer six quick questions about your credit and goals' },
  { n: '02', label: 'Our algorithm matches your profile against 15+ cards' },
  { n: '03', label: 'Get a ranked list of cards tailored specifically to you' },
]

export default function Welcome({ onStart, onPrivacy }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
        textAlign: 'center',
      }}>
        {/* Card stack */}
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              animation: `fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s both`,
            }}>
              <div style={{
                position: 'absolute',
                top: 24,
                left: 24,
                width: 36,
                height: 28,
                borderRadius: 5,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 24,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.3)',
              }}>
                •••• •••• •••• ••••
              </div>
            </div>
          ))}
        </div>

        <h1 style={{
          fontFamily: 'var(--font)',
          fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
          fontWeight: 400,
          lineHeight: 1.12,
          color: 'var(--text-primary)',
          marginBottom: 16,
          animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
        }}>
          Find your perfect card.
        </h1>

        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          maxWidth: 420,
          lineHeight: 1.65,
          marginBottom: 48,
          animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
        }}>
          Six questions. A personalized recommendation matched to your credit profile, spending habits, and goals.
        </p>

        <button
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '1rem',
            color: hovered ? 'var(--bg)' : 'var(--accent)',
            background: hovered ? 'var(--accent)' : 'transparent',
            border: '1px solid var(--accent)',
            borderRadius: '40px',
            padding: '14px 44px',
            cursor: 'pointer',
            transition: 'all 0.22s ease',
            letterSpacing: '0.02em',
            animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
          }}
        >
          Get started →
        </button>

        {/* How it works */}
        <div style={{
          display: 'flex',
          gap: 40,
          marginTop: 72,
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both',
        }}>
          {steps.map((step) => (
            <div key={step.n} style={{
              textAlign: 'center',
              maxWidth: 180,
            }}>
              <div style={{
                fontFamily: 'var(--font)',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                color: 'var(--accent)',
                marginBottom: 8,
              }}>
                {step.n}
              </div>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 36,
          fontFamily: 'var(--font)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both',
        }}>
          No personal data collected. No account required.
        </p>
      </div>

      <Footer onPrivacy={onPrivacy} />
    </div>
  )
}
