import { useState } from 'react'

// ── Replace this with your Formspree endpoint ─────────────────────────────
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form — copy the endpoint URL they give you
// 3. Paste it here, e.g. 'https://formspree.io/f/abcdefgh'
const FORMSPREE_URL = 'https://formspree.io/f/xqegreoo'
// ─────────────────────────────────────────────────────────────────────────

export default function FeedbackModal({ onClose }) {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: email.trim() || undefined }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 101,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--card-border)',
          borderRadius: 18,
          padding: '32px 28px 28px',
          width: '100%',
          maxWidth: 420,
          boxShadow: 'var(--shadow-card)',
          pointerEvents: 'auto',
          animation: 'fadeUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16, right: 16,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '6px 8px',
              borderRadius: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ×
          </button>

          {status === 'done' ? (
            /* ── Thank you state ── */
            <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>🙏</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}>
                Thanks for the feedback
              </h3>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: 24,
              }}>
                We read every submission and use it to make optimal better.
              </p>
              <button
                onClick={onClose}
                style={{
                  fontFamily: 'var(--font)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 28px',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: 6,
              }}>
                Have feedback?
              </h3>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: 22,
              }}>
                Something broken, missing, or could be better? Tell us.
              </p>

              {/* Message */}
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                required
                style={{
                  width: '100%',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontFamily: 'var(--font)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  marginBottom: 12,
                  minHeight: 110,
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
              />

              {/* Email (optional) */}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email (optional — if you'd like a reply)"
                style={{
                  width: '100%',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 10,
                  padding: '11px 14px',
                  fontFamily: 'var(--font)',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  marginBottom: 20,
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
              />

              {status === 'error' && (
                <p style={{
                  fontFamily: 'var(--font)',
                  fontSize: '0.82rem',
                  color: '#F87171',
                  marginBottom: 14,
                }}>
                  Something went wrong — please try again.
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: '1px solid var(--card-border)',
                    borderRadius: 10,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.borderColor = 'var(--text-muted)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'var(--card-border)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || status === 'sending'}
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#fff',
                    background: message.trim() ? 'var(--accent)' : 'var(--card-border)',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 24px',
                    cursor: message.trim() ? 'pointer' : 'default',
                    transition: 'background 0.2s, opacity 0.2s',
                    opacity: status === 'sending' ? 0.6 : 1,
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
