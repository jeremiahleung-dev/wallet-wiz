import { useState, useEffect } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Survey from './components/Survey'
import Results from './components/Results'
import SavedCards from './components/SavedCards'
import PrivacyModal from './components/PrivacyModal'
import { getRecommendations } from './utils/recommend'
import { getSavedIds, toggleSaved, clearSaved } from './utils/savedCards'
import { trackEvent, Events } from './utils/track'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [screen, setScreen] = useState('welcome')
  const [leaving, setLeaving] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [answers, setAnswers] = useState({})
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [savedIds, setSavedIds] = useState(() => getSavedIds())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleToggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleStart = () => {
    trackEvent(Events.SURVEY_STARTED)
    setLeaving(true)
    setTimeout(() => {
      setScreen('survey')
      setLeaving(false)
    }, 320)
  }

  const handleSurveyComplete = (surveyAnswers) => {
    const recs = getRecommendations(surveyAnswers)
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
        theme={theme}
        onToggleTheme={handleToggleTheme}
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
