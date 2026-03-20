import { useState, useCallback } from 'react'
import { questions } from '../data/questions'
import QuestionCard from './QuestionCard'

export default function Survey({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animState, setAnimState] = useState('idle') // idle | out | in

  const handleAnswer = useCallback((optionId) => {
    const questionId = questions[index].id
    const newAnswers = { ...answers, [questionId]: optionId }

    if (index === questions.length - 1) {
      setAnimState('out')
      setTimeout(() => {
        onComplete(newAnswers)
      }, 340)
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
      padding: '80px 24px 40px',
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--progress-track)',
        zIndex: 99,
      }}>
        <div style={{
          height: '100%',
          background: 'var(--progress-fill)',
          width: `${((index + 1) / questions.length) * 100}%`,
          transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </div>

      {/* Step counter */}
      <div style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font)',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        zIndex: 99,
      }}>
        {index + 1} of {questions.length}
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
