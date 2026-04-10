import { useState, useCallback } from 'react'
import { questions } from '../data/questions'
import QuestionCard from './QuestionCard'
import { trackEvent, Events } from '../utils/track'

export default function Survey({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animState, setAnimState] = useState('idle')

  const handleAnswer = useCallback((optionId) => {
    const question = questions[index]
    const newAnswers = { ...answers, [question.id]: optionId }

    trackEvent(Events.QUESTION_ANSWERED, {
      question_id: question.id,
      question_index: index + 1,
      answer: optionId,
    })

    if (index === questions.length - 1) {
      setAnimState('out')
      setTimeout(() => onComplete(newAnswers), 340)
      return
    }

    setAnimState('out')
    setTimeout(() => {
      setAnswers(newAnswers)
      setIndex(i => i + 1)
      setAnimState('in')
      setTimeout(() => setAnimState('idle'), 400)
    }, 340)
  }, [index, answers, onComplete])

  const handleBack = useCallback(() => {
    if (index === 0) return
    setAnimState('out-right')
    setTimeout(() => {
      setIndex(i => i - 1)
      setAnimState('in-left')
      setTimeout(() => setAnimState('idle'), 400)
    }, 340)
  }, [index])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(72px, 18vw, 100px) 20px 48px',
    }}>
      {/* Segmented progress bar */}
      <div style={{
        display: 'flex',
        gap: 5,
        marginBottom: 48,
        width: '100%',
        maxWidth: 400,
      }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            background: i <= index ? 'var(--progress-fill)' : 'var(--progress-track)',
            transition: 'background 0.35s ease',
          }} />
        ))}
      </div>

      <QuestionCard
        question={questions[index]}
        animState={animState}
        onAnswer={handleAnswer}
        onBack={index > 0 ? handleBack : null}
      />
    </div>
  )
}
