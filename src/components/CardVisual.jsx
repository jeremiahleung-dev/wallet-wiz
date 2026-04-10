export default function CardVisual({ card }) {
  const [g1, g2] = card.gradient

  return (
    <div style={{
      width: 'min(300px, 100%)',
      aspectRatio: '300 / 185',
      borderRadius: 18,
      background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 16px 52px rgba(0,0,0,0.45)',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 1,
    }}>
      {/* Shine */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Chip */}
      <div style={{
        position: 'absolute', top: 28, left: 28,
        width: 38, height: 28, borderRadius: 5,
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.22)',
      }} />

      {/* Issuer top right */}
      <div style={{
        position: 'absolute', top: 24, right: 24,
        fontFamily: 'var(--font)',
        fontSize: '0.75rem', fontWeight: 500,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '0.04em',
      }}>
        {card.issuer}
      </div>

      {/* Card name */}
      <div style={{
        position: 'absolute', bottom: 52, left: 28, right: 28,
        fontFamily: 'var(--font)',
        fontSize: '0.85rem', fontWeight: 600,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '0.02em',
      }}>
        {card.name}
      </div>

      {/* Card number dots */}
      <div style={{
        position: 'absolute', bottom: 26, left: 28,
        fontFamily: 'monospace', fontSize: '0.78rem',
        letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)',
      }}>
        •••• •••• •••• ••••
      </div>

      {/* Network logo */}
      <div style={{
        position: 'absolute', bottom: 22, right: 24,
        display: 'flex', alignItems: 'center',
      }}>
        <NetworkMark network={card.network} />
      </div>
    </div>
  )
}

function NetworkMark({ network }) {
  if (network === 'Visa') {
    return (
      <span style={{
        fontFamily: 'Georgia, serif', fontWeight: 700,
        fontSize: '1rem', color: 'rgba(255,255,255,0.55)',
        letterSpacing: '-0.03em',
      }}>
        VISA
      </span>
    )
  }

  if (network === 'Mastercard') {
    return (
      <div style={{ display: 'flex', position: 'relative', width: 38, height: 24 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(235,80,80,0.65)', position: 'absolute', left: 0 }} />
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,160,50,0.65)', position: 'absolute', left: 14 }} />
      </div>
    )
  }

  if (network === 'Amex') {
    return (
      <span style={{
        fontFamily: 'var(--font)', fontWeight: 700,
        fontSize: '0.72rem', color: 'rgba(130,200,255,0.7)',
        letterSpacing: '0.08em',
      }}>
        AMEX
      </span>
    )
  }

  return (
    <span style={{ fontFamily: 'var(--font)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
      {network}
    </span>
  )
}
