export default function CardVisual({ card }) {
  const [g1, g2] = card.gradient

  return (
    <div style={{
      width: 300,
      height: 185,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Subtle shine overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Chip */}
      <div style={{
        position: 'absolute',
        top: 28,
        left: 28,
        width: 40,
        height: 30,
        borderRadius: 5,
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
      }} />

      {/* Issuer top right */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        fontFamily: 'var(--font)',
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.05em',
      }}>
        {card.issuer}
      </div>

      {/* Card name */}
      <div style={{
        position: 'absolute',
        bottom: 52,
        left: 28,
        right: 28,
        fontFamily: 'var(--font)',
        fontSize: '0.88rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.03em',
      }}>
        {card.name}
      </div>

      {/* Card number dots */}
      <div style={{
        position: 'absolute',
        bottom: 26,
        left: 28,
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.35)',
      }}>
        •••• •••• •••• ••••
      </div>

      {/* Network logo placeholder */}
      <div style={{
        position: 'absolute',
        bottom: 22,
        right: 24,
        display: 'flex',
        gap: -8,
        alignItems: 'center',
      }}>
        <NetworkMark network={card.network} />
      </div>
    </div>
  )
}

function NetworkMark({ network }) {
  const colors = {
    Visa: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.5)'],
    Mastercard: ['rgba(235,80,80,0.7)', 'rgba(255,160,50,0.7)'],
    Amex: ['rgba(100,180,255,0.6)', 'rgba(100,180,255,0.6)'],
    Discover: ['rgba(255,140,60,0.7)', 'rgba(255,140,60,0.7)'],
  }
  const [c1, c2] = colors[network] || ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.4)']

  if (network === 'Visa') {
    return (
      <span style={{
        fontFamily: 'Georgia, serif',
        fontWeight: 700,
        fontSize: '1rem',
        color: c1,
        letterSpacing: '-0.03em',
      }}>
        VISA
      </span>
    )
  }

  if (network === 'Mastercard') {
    return (
      <div style={{ display: 'flex', position: 'relative', width: 38, height: 24 }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: c1, position: 'absolute', left: 0,
        }} />
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: c2, position: 'absolute', left: 14,
        }} />
      </div>
    )
  }

  return (
    <span style={{
      fontFamily: 'var(--font)',
      fontSize: '0.75rem',
      color: 'rgba(255,255,255,0.4)',
    }}>
      {network}
    </span>
  )
}
