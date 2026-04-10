import { cards as staticCards, SCORE_ORDER } from '../data/cards'

export function getRecommendations(answers, cards = staticCards) {
  const { creditScore, creditAge, goal, spending, annualFee, lifestyle } = answers

  // Hard filter: only show cards the user can realistically get
  const userScoreVal = SCORE_ORDER[creditScore] ?? 0
  const eligible = cards.filter(card => SCORE_ORDER[card.minScore] <= userScoreVal)

  // Hard filter: annual fee preference
  const feeEligible = eligible.filter(card => {
    if (annualFee === 'none')   return card.annualFee === 0
    if (annualFee === 'low')    return card.annualFee <= 100
    if (annualFee === 'medium') return card.annualFee <= 300
    return true // 'high' — no limit
  })

  // Score each card
  const scored = feeEligible.map(card => {
    let score = 0

    // Goal match (high weight)
    if (card.goals.includes(goal)) score += 40
    // Partial goal overlap for building credit users
    if (goal === 'building_credit' && card.goals.includes('cash_back')) score += 10

    // Spending category match (medium weight)
    if (card.spending.includes(spending)) score += 25

    // Lifestyle match (medium weight)
    if (card.lifestyle.includes(lifestyle)) score += 20

    // Prefer cards that closely match (not over-qualify) the credit tier
    const cardScoreVal = SCORE_ORDER[card.minScore]
    const gap = userScoreVal - cardScoreVal
    if (gap === 0) score += 15       // perfect match
    else if (gap === 1) score += 10  // one tier above
    else if (gap >= 3) score -= 5   // massively over-qualified (likely not the best fit)

    // Bonus for no annual fee when on a tight score budget
    if (userScoreVal <= 1 && card.annualFee === 0) score += 10

    // Bonus for credit-building cards when history is short
    if ((creditAge === 'new' || creditAge === 'building') && card.goals.includes('building_credit')) score += 15

    // Premium lifestyle bonus for high-fee cards
    if (lifestyle === 'luxury' && card.annualFee >= 395) score += 10
    if (lifestyle === 'traveler' && card.goals.includes('travel')) score += 10

    return { ...card, score }
  })

  // Sort descending and return top 5
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export function getMatchReasons(card, answers) {
  const reasons = []

  if (card.goals.includes(answers.goal)) {
    const labels = {
      cash_back: 'earns strong cash back rewards',
      travel: 'is built for travel rewards',
      building_credit: 'is designed to build your credit profile',
      low_apr: 'offers an introductory 0% APR period',
      premium: 'delivers premium perks and status',
    }
    reasons.push(labels[answers.goal] || 'aligns with your goal')
  }

  if (card.spending.includes(answers.spending)) {
    const labels = {
      dining: 'rewards dining and restaurant spending',
      groceries: 'excels at grocery store rewards',
      travel: 'maximizes travel purchases',
      gas: 'gives great returns on gas',
      online: 'rewards online shopping',
      general: 'earns consistently on all spending',
    }
    reasons.push(labels[answers.spending] || 'matches your spending habits')
  }

  if (card.lifestyle.includes(answers.lifestyle)) {
    const labels = {
      simple: 'is straightforward with no complexity',
      everyday: 'fits naturally into everyday life',
      active: 'rewards an active social lifestyle',
      traveler: 'is purpose-built for frequent travelers',
      luxury: 'delivers a luxury card experience',
    }
    reasons.push(labels[answers.lifestyle] || 'suits your lifestyle')
  }

  if (card.annualFee === 0) reasons.push('has no annual fee')

  return reasons.slice(0, 3)
}
