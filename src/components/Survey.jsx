import { useState, useCallback } from 'react'
import { questions } from '../data/questions'
import QuestionCard from './QuestionCard'
import WalletStep from './WalletStep'
import { trackEvent, Events } from '../utils/track'

export default function Survey({ onComplete }) {
  const [walletDone, setWalletDone] = useState(false)
  const [ownedIds, setOwnedIds] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animState, setAnimState] = useState('idle')

  // Wallet step = slot 0; questions = slots 1–6
  const totalSteps = questions.length + 1
  const currentStep = walletDone ? index + 1 : 0

  const handleWalletComplete = (ids) => {
    trackEvent(Events.WALLET_STEP_COMPLETED, { owned_count: ids.length })
    setOwnedIds(ids)
    setAnimState('out')
    setTimeout(() => {
      setWalletDone(true)
      setAnimState('in')
      setTimeout(() => setAnimState('idle'), 400)
    }, 340)
  }

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
      setTimeout(() => onComplete({ ...newAnswers, ownedIds }), 340)
      return
    }

    setAnimState('out')
    setTimeout(() => {
      setAnswers(newAnswers)
      setIndex(i => i + 1)
      setAnimState('in')
      setTimeout(() => setAnimState('idle'), 400)
    }, 340)
  }, [index, answers, ownedIds, onComplete])

  const handleBack = useCallback(() => {
    if (index === 0) {
      // Back to wallet step
      setAnimState('out-right')
      setTimeout(() => {
        setWalletDone(false)
        setAnimState('in-left')
        setTimeout(() => setAnimState('idle'), 400)
      }, 340)
      return
    }
    setAnimState('out-right')
    setTimeout(() => {
      setIndex(i => i - 1)
      setAnimState('in-left')
      setTimeout(() => setAnimState('idle'), 400)
    }, 340)
  }, [index])

  return (
    <div className="anim-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(32px, 6vw, 56px) 20px 48px',
    }}>
      {/* Segmented progress bar */}
      <div style={{
        display: 'flex',
        gap: 5,
        marginBottom: 48,
        width: '100%',
        maxWidth: 400,
      }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            background: i <= currentStep ? 'var(--progress-fill)' : 'var(--progress-track)',
            transition: 'background 0.35s ease',
          }} />
        ))}
      </div>

      {!walletDone ? (
        <WalletStep
          animState={animState}
          onComplete={handleWalletComplete}
        />
      ) : (
        <QuestionCard
          key={questions[index].id}
          question={questions[index]}
          animState={animState}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
