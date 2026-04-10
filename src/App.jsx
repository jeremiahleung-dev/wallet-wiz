import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Survey from './components/Survey'
import Results from './components/Results'
import PrivacyModal from './components/PrivacyModal'
import { getRecommendations } from './utils/recommend'
import { trackEvent, Events } from './utils/track'
import { cards as staticCards } from './data/cards'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [screen, setScreen] = useState('welcome')
  const [recommendations, setRecommendations] = useState([])
  const [answers, setAnswers] = useState({})
  const [showPrivacy, setShowPrivacy] = useState(false)
  const liveCardsRef = useRef(staticCards)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => { liveCardsRef.current = data })
      .catch(() => { /* silent fallback — liveCardsRef keeps static data */ })
  }, [])

  const handleToggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleStart = () => {
    trackEvent(Events.SURVEY_STARTED)
    setScreen('survey')
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
    setScreen('welcome')
    setRecommendations([])
    setAnswers({})
  }

  const handleOpenPrivacy = () => {
    trackEvent(Events.PRIVACY_VIEWED)
    setShowPrivacy(true)
  }

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} onHome={handleRestart} />

      {screen === 'welcome' && (
        <Welcome onStart={handleStart} onPrivacy={handleOpenPrivacy} />
      )}
      {screen === 'survey' && (
        <Survey onComplete={handleSurveyComplete} />
      )}
      {screen === 'results' && (
        <Results
          recommendations={recommendations}
          answers={answers}
          onRestart={handleRestart}
          onPrivacy={handleOpenPrivacy}
        />
      )}

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  )
}
