import { useState } from 'react'

const animClass = {
  idle: '',
  out: 'anim-slide-out-left',
  'out-right': 'anim-slide-out-right',
  in: 'anim-slide-in-right',
  'in-left': 'anim-slide-in-left',
}

export default function QuestionCard({ question, animState, onAnswer, onBack }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (id) => {
    if (selected) return
    setSelected(id)
    setTimeout(() => {
      setSelected(null)
      onAnswer(id)
    }, 180)
  }

  const cols = 2

  return (
    <div
      className={animClass[animState] || ''}
      style={{ width: '100%', maxWidth: 720 }}
    >
      {/* Question */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3.8vw, 2.2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: 12,
          letterSpacing: '-0.025em',
        }}>
          {question.question}
        </h2>
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
          const isSelected = selected === option.id
          return (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={isSelected}
              onClick={() => handleSelect(option.id)}
            />
          )
        })}
      </div>

      {/* Back button */}
      {onBack && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
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

function OptionCard({ option, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px 24px',
        background: isSelected
          ? 'var(--option-selected)'
          : hovered
          ? 'var(--option-hover)'
          : 'var(--option-bg)',
        border: `1.5px solid ${isSelected ? 'var(--option-selected-border)' : hovered ? 'var(--text-muted)' : 'var(--option-border)'}`,
        boxShadow: isSelected
          ? 'inset 3px 0 0 var(--accent)'
          : hovered
          ? 'inset 3px 0 0 var(--accent)'
          : 'none',
        borderRadius: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        transform: isSelected ? 'scale(0.98)' : 'none',
        minHeight: 96,
      }}
    >
      <span style={{
        fontFamily: 'var(--font)',
        fontSize: '0.98rem',
        fontWeight: 600,
        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
        marginBottom: option.description ? 5 : 0,
        transition: 'color 0.18s',
        lineHeight: 1.3,
      }}>
        {option.label}
      </span>
      {option.description && (
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.8rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
        }}>
          {option.description}
        </span>
      )}
    </button>
  )
}
