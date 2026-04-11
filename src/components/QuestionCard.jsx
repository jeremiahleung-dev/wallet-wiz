import { useState } from 'react'

const animClass = {
  idle: '',
  out: 'anim-fade-out',
  'out-right': 'anim-fade-out',
  in: 'anim-fade-in',
  'in-left': 'anim-fade-in',
}

export default function QuestionCard({ question, animState, onAnswer, onBack }) {
  const isMulti = question.multiSelect === true
  const [singleSelected, setSingleSelected] = useState(null)
  const [multiSelected, setMultiSelected] = useState([])

  const handleSelect = (id) => {
    if (isMulti) {
      setMultiSelected(prev => {
        if (prev.includes(id)) return prev.filter(x => x !== id)
        if (prev.length >= 2) return prev
        return [...prev, id]
      })
    } else {
      if (singleSelected) return
      setSingleSelected(id)
      setTimeout(() => {
        setSingleSelected(null)
        onAnswer(id)
      }, 180)
    }
  }

  const handleContinue = () => {
    if (multiSelected.length === 0) return
    onAnswer(multiSelected)
  }

  const cols = 2

  return (
    <div
      className={animClass[animState] || ''}
      style={{ width: '100%', maxWidth: 720 }}
    >
      {/* Question header */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.8vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
          }}>
            {question.question}
          </h2>
          {isMulti && (
            <span style={{
              fontFamily: 'var(--font)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'rgba(220,230,245,0.1)',
              border: '1px solid rgba(200,220,245,0.18)',
              borderRadius: 100,
              padding: '4px 12px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Select up to 2
            </span>
          )}
        </div>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '1rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
        }}>
          {question.subtitle}
        </p>
      </div>

      {/* Options grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 14,
      }}>
        {question.options.map(option => {
          const isSelected = isMulti
            ? multiSelected.includes(option.id)
            : singleSelected === option.id
          const isDisabled = isMulti && multiSelected.length >= 2 && !isSelected

          return (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isMulti={isMulti}
              onClick={() => handleSelect(option.id)}
            />
          )
        })}
      </div>

      {/* Continue button (multi-select only) */}
      {isMulti && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button
            onClick={handleContinue}
            disabled={multiSelected.length === 0}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#fff',
              background: multiSelected.length === 0 ? 'rgba(79,135,232,0.35)' : 'var(--accent)',
              border: 'none',
              borderRadius: 12,
              padding: '14px 44px',
              cursor: multiSelected.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: multiSelected.length === 0 ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (multiSelected.length > 0) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { if (multiSelected.length > 0) e.currentTarget.style.background = 'var(--accent)' }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Back button */}
      {onBack && (
        <div style={{ textAlign: 'center', marginTop: isMulti ? 12 : 32 }}>
          <button
            onClick={onBack}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '12px 16px',
              minWidth: 44,
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}

function OptionCard({ option, isSelected, isDisabled, isMulti, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px 20px',
        background: isSelected
          ? 'rgba(255,255,255,0.97)'
          : hovered
          ? 'rgba(255,255,255,0.97)'
          : 'rgba(240,243,247,0.92)',
        border: `1.5px solid ${isSelected ? 'var(--accent)' : hovered ? 'rgba(200,220,245,0.3)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isSelected ? 'inset 3px 0 0 var(--accent)' : hovered ? 'inset 3px 0 0 var(--accent)' : 'none',
        borderRadius: 12,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        transform: isSelected ? 'scale(0.98)' : 'none',
        minHeight: 90,
        position: 'relative',
        opacity: isDisabled ? 0.45 : 1,
      }}
    >
      {/* Checkbox indicator for multi-select */}
      {isMulti && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 18,
          height: 18,
          borderRadius: 5,
          border: isSelected ? 'none' : '1.5px solid rgba(0,0,0,0.2)',
          background: isSelected ? 'var(--accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}>
          {isSelected && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      )}

      <span style={{
        fontFamily: 'var(--font)',
        fontSize: '0.95rem',
        fontWeight: 600,
        color: isSelected ? '#1B4FBB' : '#0B1A35',
        marginBottom: option.description ? 5 : 0,
        transition: 'color 0.18s',
        lineHeight: 1.3,
        paddingRight: isMulti ? 24 : 0,
      }}>
        {option.label}
      </span>
      {option.description && (
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.8rem',
          fontWeight: 400,
          color: '#516278',
          lineHeight: 1.45,
        }}>
          {option.description}
        </span>
      )}
    </button>
  )
}
