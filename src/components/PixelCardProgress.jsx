import { useEffect, useState } from 'react'

const P = 4 // px per pixel

// 0=transparent, 1=card body, 2=chip, 3=dot
const CARD = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,2,2,2,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,2,2,2,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,2,2,2,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,3,0,3,0,3,0,3,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,3,3,3,3,3,3,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

// 0=transparent, 1=body, 2=screen (green), 3=button, 4=slot-gap
const READER = [
  [0,1,1,1,1,1,0],
  [0,1,0,0,0,1,0],
  [0,0,0,0,0,0,0], // swipe slot row
  [0,0,0,0,0,0,0], // swipe slot row
  [0,1,0,0,0,1,0],
  [0,1,2,2,2,1,0],
  [0,1,2,2,2,1,0],
  [0,1,0,0,0,1,0],
  [0,1,0,3,0,1,0],
  [0,1,0,0,0,1,0],
  [0,1,1,1,1,1,0],
]

const CARD_W = CARD[0].length * P
const CARD_H = CARD.length * P
const READER_W = READER[0].length * P
const READER_H = READER.length * P

function PixelGrid({ map, colorFn, style }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${map[0].length}, ${P}px)`,
      gridTemplateRows: `repeat(${map.length}, ${P}px)`,
      imageRendering: 'pixelated',
      ...style,
    }}>
      {map.flatMap((row, r) =>
        row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: P,
              height: P,
              background: colorFn(val),
            }}
          />
        ))
      )}
    </div>
  )
}

export default function PixelCardProgress({ current, total }) {
  const [displayPos, setDisplayPos] = useState(0)
  const [swiped, setSwiped] = useState(false)

  const progress = current / total // 0 → 1

  // Track available width minus reader width and padding — responsive on mobile
  const TRACK_PADDING = window.innerWidth < 480 ? 20 : 48
  const READER_RIGHT = TRACK_PADDING

  useEffect(() => {
    // Smoothly animate toward target
    const target = progress
    setDisplayPos(target)
    if (current === total) {
      setTimeout(() => setSwiped(true), 400)
    } else {
      setSwiped(false)
    }
  }, [current, total, progress])

  // Colors adapt to CSS vars via inline style with currentColor — easier to just use JS vars
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

  const cardColor     = isDark ? '#c8a96e' : '#8b6a1f'
  const chipColor     = isDark ? '#e8c98e' : '#6b4e12'
  const dotColor      = isDark ? '#5a4020' : '#4a3010'
  const readerBody    = isDark ? '#555' : '#9a9080'
  const readerScreen  = swiped ? '#22c55e' : (isDark ? '#374151' : '#cbd5e1')
  const readerButton  = isDark ? '#c8a96e' : '#8b6a1f'
  const trackColor    = isDark ? '#2a2a2a' : '#e0d8cc'

  const cardColorFn = (val) => {
    if (val === 0) return 'transparent'
    if (val === 1) return cardColor
    if (val === 2) return chipColor
    if (val === 3) return dotColor
    return 'transparent'
  }

  const readerColorFn = (val) => {
    if (val === 0) return 'transparent'
    if (val === 1) return readerBody
    if (val === 2) return readerScreen
    if (val === 3) return readerButton
    return 'transparent'
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      zIndex: 99,
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${TRACK_PADDING}px`,
      pointerEvents: 'none',
    }}>
      {/* Track rail */}
      <div style={{
        position: 'absolute',
        left: TRACK_PADDING,
        right: TRACK_PADDING + READER_W + 8,
        top: '50%',
        height: 1,
        background: trackColor,
        transform: 'translateY(-50%)',
      }} />

      {/* Step dots */}
      {Array.from({ length: total }).map((_, i) => {
        const dotProgress = (i + 1) / total
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${TRACK_PADDING}px + (100% - ${TRACK_PADDING * 2 + READER_W + 8}px) * ${dotProgress})`,
              top: '50%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: (i + 1) <= current ? cardColor : trackColor,
              transform: 'translate(-50%, -50%)',
              transition: 'background 0.3s ease',
              imageRendering: 'pixelated',
            }}
          />
        )
      })}

      {/* Animated pixel card */}
      <div style={{
        position: 'absolute',
        // moves from left edge to just before reader
        left: `calc(${TRACK_PADDING}px + (100% - ${TRACK_PADDING * 2 + READER_W + CARD_W + 16}px) * ${displayPos})`,
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'left 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        animation: 'cardFloat 1.8s ease-in-out infinite',
      }}>
        <PixelGrid map={CARD} colorFn={cardColorFn} />
      </div>

      {/* Pixel card reader — fixed on the right */}
      <div style={{
        position: 'absolute',
        right: TRACK_PADDING,
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <PixelGrid map={READER} colorFn={readerColorFn} />
      </div>
    </div>
  )
}
