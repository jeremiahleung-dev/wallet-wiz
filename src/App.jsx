import { useState, useEffect } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Survey from './components/Survey'
import Results from './components/Results'
import { getRecommendations } from './utils/recommend'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [screen, setScreen] = useState('welcome') // welcome | survey | results
  const [recommendations, setRecommendations] = useState([])
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const handleSurveyComplete = (surveyAnswers) => {
    const recs = getRecommendations(surveyAnswers)
    setAnswers(surveyAnswers)
    setRecommendations(recs)
    setScreen('results')
  }

  const handleRestart = () => {
    setScreen('welcome')
    setRecommendations([])
    setAnswers({})
  }

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      {screen === 'welcome' && (
        <Welcome onStart={() => setScreen('survey')} />
      )}
      {screen === 'survey' && (
        <Survey onComplete={handleSurveyComplete} />
      )}
      {screen === 'results' && (
        <Results
          recommendations={recommendations}
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
