import { useState } from 'react'

const steps = [
  { n: '01', label: 'Answer six quick questions about your credit profile and goals' },
  { n: '02', label: 'Our algorithm scores your profile against every card in our database' },
  { n: '03', label: 'Get a ranked list of cards matched specifically to you' },
]

export default function Welcome({ onStart, onPrivacy, isLeaving }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={isLeaving ? 'anim-fade-out' : ''}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'radial-gradient(circle, var(--card-border) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(32px, 6vw, 56px) 24px 48px',
        textAlign: 'center',
      }}>

        {/* Floating card */}
        <div style={{
          width: 'min(240px, 64vw)',
          aspectRatio: '240 / 148',
          borderRadius: 18,
          background: 'linear-gradient(145deg, #F0F4F8 0%, #D8E0EA 40%, #E8EDF4 70%, #BEC8D6 100%)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
          position: 'relative',
          marginBottom: 52,
          animation: 'cardFloat 4s ease-in-out infinite',
          border: '1px solid rgba(255,255,255,0.6)',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Gloss sweep */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.1) 45%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          {/* Subtle lower reflection */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(255,255,255,0.18) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 20, left: 22,
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem', fontWeight: 700,
            color: 'rgba(30,50,80,0.85)',
            letterSpacing: '-0.01em',
          }}>optimal</div>
          <div style={{
            position: 'absolute', bottom: 42, left: 22,
            width: 30, height: 22, borderRadius: 4,
            background: 'linear-gradient(135deg, #C8A96A 0%, #E8CC88 50%, #B89050 100%)',
            border: '1px solid rgba(255,255,255,0.4)',
          }} />
          <div style={{
            position: 'absolute', bottom: 24, left: 22,
            fontFamily: 'monospace', fontSize: '0.68rem',
            letterSpacing: '0.18em', color: 'rgba(30,50,80,0.35)',
          }}>•••• •••• •••• ••••</div>
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', position: 'relative', width: 34, height: 22 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(200,60,60,0.55)', position: 'absolute', left: 0 }} />
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(220,140,30,0.55)', position: 'absolute', left: 12 }} />
            </div>
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          color: 'var(--text-primary)',
          marginBottom: 18,
          letterSpacing: '-0.03em',
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both',
        }}>
          Find your<br />perfect card.
        </h1>

        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '1.05rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          maxWidth: 380,
          lineHeight: 1.65,
          marginBottom: 40,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
        }}>
          Six questions. A personalized recommendation matched to your credit profile, spending habits, and goals.
        </p>

        <button
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#FFFFFF',
            background: hovered ? 'var(--accent-hover)' : 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            padding: '14px 44px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
            boxShadow: hovered
              ? '0 8px 32px rgba(27, 79, 187, 0.40)'
              : '0 4px 20px rgba(27, 79, 187, 0.22)',
            transform: hovered ? 'translateY(-1px)' : 'none',
            animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
          }}
        >
          Get started →
        </button>

        {/* How it works */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 80,
          width: '100%',
          maxWidth: 560,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
        }}>
          {steps.map((step, i) => (
            <div key={step.n} style={{
              flex: 1,
              textAlign: 'center',
              padding: '0 18px',
              borderRight: i < steps.length - 1 ? '1px solid var(--card-border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--accent)',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}>
                {step.n}
              </div>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.85rem',
                fontWeight: 400,
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
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--text-muted)',
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both',
        }}>
          No personal data collected. No account required.
        </p>
      </div>

    </div>
  )
}
