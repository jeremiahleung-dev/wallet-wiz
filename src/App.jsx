import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Survey from './components/Survey'
import Results from './components/Results'
import SavedCards from './components/SavedCards'
import Catalogue from './components/Catalogue'
import Footer from './components/Footer'
import PrivacyModal from './components/PrivacyModal'
import FeedbackModal from './components/FeedbackModal'
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
  const [showFeedback, setShowFeedback] = useState(false)
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
      owned_count: surveyAnswers.ownedIds?.length ?? 0,
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
    trackEvent(Events.COMPARE_VIEWED, { count: savedIds.length })
    setScreen('compare')
  }

  const handleOpenMyCards = () => {
    trackEvent(Events.MY_CARDS_VIEWED, { count: savedIds.length })
    setScreen('my-cards')
  }

  const handleOpenCatalogue = () => {
    setScreen('catalogue')
  }

  const handleRemoveFromCompare = (cardId) => {
    trackEvent(Events.CARD_REMOVED_FROM_COMPARE, { card_id: cardId })
    const updated = toggleSaved(cardId, savedIds)
    setSavedIds(updated)
  }

  const handleClearAll = () => {
    trackEvent(Events.COMPARE_CLEARED, { count: savedIds.length })
    setSavedIds(clearSaved())
    setScreen('results')
  }

  const handleClearAllMyCards = () => {
    trackEvent(Events.COMPARE_CLEARED, { count: savedIds.length })
    setSavedIds(clearSaved())
    // Stay on my-cards — empty state renders automatically
  }

  return (
    <>
      <Header
        onHome={handleRestart}
        savedCount={savedIds.length}
        onMyCards={handleOpenMyCards}
        onCatalogue={handleOpenCatalogue}
        onFeedback={() => setShowFeedback(true)}
        activeScreen={screen}
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
          scoreMap={Object.fromEntries(recommendations.map(c => [c.id, c.score]))}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearAll}
          onBack={() => setScreen('results')}
          backLabel="← Back to results"
        />
      )}
      {screen === 'my-cards' && (
        <SavedCards
          savedIds={savedIds}
          scoreMap={Object.fromEntries(recommendations.map(c => [c.id, c.score]))}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearAllMyCards}
          onBack={() => setScreen(recommendations.length > 0 ? 'results' : 'welcome')}
          title="My Cards"
          backLabel={recommendations.length > 0 ? '← Back to results' : '← Back to home'}
          emptyMessage="Browse the Catalogue and bookmark any cards you'd like to compare here."
        />
      )}
      {screen === 'catalogue' && (
        <Catalogue
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onViewMyCards={handleOpenMyCards}
        />
      )}

      <Footer onPrivacy={handleOpenPrivacy} />

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  )
}
