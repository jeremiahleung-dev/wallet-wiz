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

  const cols = question.options.length >= 5 ? 3 : question.options.length === 4 ? 2 : 2

  return (
    <div
      className={animClass[animState] || ''}
      style={{ width: '100%', maxWidth: 680 }}
    >
      {/* Question */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: 12,
        }}>
          {question.question}
        </h2>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {question.subtitle}
        </p>
      </div>

      {/* Options grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 12,
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
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
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
        padding: '18px 20px',
        background: isSelected
          ? 'var(--option-selected)'
          : hovered
          ? 'var(--option-hover)'
          : 'var(--option-bg)',
        border: `1px solid ${isSelected ? 'var(--option-selected-border)' : hovered ? 'var(--text-muted)' : 'var(--option-border)'}`,
        borderRadius: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        transform: isSelected ? 'scale(0.98)' : hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered && !isSelected ? 'var(--shadow)' : 'none',
      }}
    >
      <span style={{
        fontFamily: 'var(--font)',
        fontSize: '1.05rem',
        fontWeight: 500,
        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
        marginBottom: 4,
        transition: 'color 0.18s',
      }}>
        {option.label}
      </span>
      {option.description && (
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          {option.description}
        </span>
      )}
    </button>
  )
}
