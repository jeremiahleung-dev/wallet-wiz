import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Survey from './components/Survey'
import Results from './components/Results'
import SavedCards from './components/SavedCards'
import PrivacyModal from './components/PrivacyModal'
import { getRecommendations } from './utils/recommend'
import { getSavedIds, toggleSaved, clearSaved } from './utils/savedCards'
import { trackEvent, Events } from './utils/track'
import { cards as staticCards } from './data/cards'

const SESSION_KEY = 'optimal_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveSession(screen, answers) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ screen, answers })) } catch {}
}

export default function App() {
  const session = loadSession()
  const [screen, setScreen] = useState(session?.screen || 'welcome')
  const [leaving, setLeaving] = useState(false)
  const [answers, setAnswers] = useState(session?.answers || {})
  const [recommendations, setRecommendations] = useState(() => {
    if (session?.answers && (session?.screen === 'results' || session?.screen === 'compare')) {
      return getRecommendations(session.answers, staticCards)
    }
    return []
  })
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [savedIds, setSavedIds] = useState(() => getSavedIds())
  const liveCardsRef = useRef(staticCards)

  useEffect(() => {
    saveSession(screen, answers)
  }, [screen, answers])

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => { liveCardsRef.current = data })
      .catch(() => { /* silent fallback — liveCardsRef keeps static data */ })
  }, [])

  const handleStart = () => {
    trackEvent(Events.SURVEY_STARTED)
    setLeaving(true)
    setTimeout(() => {
      setScreen('survey')
      setLeaving(false)
    }, 320)
  }

  const handleSurveyComplete = (surveyAnswers) => {
    const recs = getRecommendations(surveyAnswers, liveCardsRef.current)
    setAnswers(surveyAnswers)
    setRecommendations(recs)
    trackEvent(Events.RESULTS_VIEWED, {
      top_card: recs[0]?.id,
      result_count: recs.length,
    })
    setScreen('results')
  }

  const handleRestart = () => {
    trackEvent(Events.SURVEY_RESTARTED)
    sessionStorage.removeItem(SESSION_KEY)
    setScreen('welcome')
    setRecommendations([])
    setAnswers({})
  }

  const handleOpenPrivacy = () => {
    trackEvent(Events.PRIVACY_VIEWED)
    setShowPrivacy(true)
  }

  const handleToggleSave = (cardId) => {
    const isSaving = !savedIds.includes(cardId)
    const updated = toggleSaved(cardId, savedIds)
    setSavedIds(updated)
    trackEvent(isSaving ? Events.CARD_SAVED : Events.CARD_UNSAVED, { card_id: cardId })
  }

  const handleOpenCompare = () => {
    trackEvent(Events.COMPARE_OPENED, { count: savedIds.length })
    setScreen('compare')
  }

  const handleOpenMyCards = () => {
    setScreen('my-cards')
  }

  const handleRemoveFromCompare = (cardId) => {
    const updated = toggleSaved(cardId, savedIds)
    setSavedIds(updated)
  }

  const handleClearAll = () => {
    setSavedIds(clearSaved())
    setScreen('results')
  }

  const handleClearAllMyCards = () => {
    setSavedIds(clearSaved())
    // Stay on my-cards — empty state renders automatically
  }

  return (
    <>
      <Header
        onHome={handleRestart}
        savedCount={savedIds.length}
        onMyCards={handleOpenMyCards}
      />

      {screen === 'welcome' && (
        <Welcome onStart={handleStart} onPrivacy={handleOpenPrivacy} isLeaving={leaving} />
      )}
      {screen === 'survey' && (
        <Survey onComplete={handleSurveyComplete} />
      )}
      {screen === 'results' && (
        <Results
          recommendations={recommendations}
          answers={answers}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onCompare={handleOpenCompare}
          onRestart={handleRestart}
          onPrivacy={handleOpenPrivacy}
        />
      )}
      {screen === 'compare' && (
        <SavedCards
          savedIds={savedIds}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearAll}
          onBack={() => setScreen('results')}
        />
      )}
      {screen === 'my-cards' && (
        <SavedCards
          savedIds={savedIds}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearAllMyCards}
          onBack={() => setScreen('welcome')}
          title="My Cards"
          backLabel="← Back to home"
          emptyMessage="Take the quiz and bookmark any cards you'd like to compare here."
        />
      )}

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  )
}
