import { cards as staticCards, SCORE_ORDER } from '../data/cards'

export function getRecommendations(answers, cards = staticCards) {
  const { creditScore, creditAge, goal, spending, annualFee, lifestyle, ownedIds = [] } = answers

  // Normalize to arrays (goal/spending/lifestyle may be string or array)
  const goals     = Array.isArray(goal)      ? goal      : (goal      ? [goal]      : [])
  const spendings = Array.isArray(spending)  ? spending  : (spending  ? [spending]  : [])
  const lifestyles = Array.isArray(lifestyle) ? lifestyle : (lifestyle ? [lifestyle] : [])

  // Balance transfer maps to low_apr for scoring
  const effectiveGoals = goals.map(g => g === 'balance_transfer' ? 'low_apr' : g)

  // Hard filter: only show cards the user can realistically get
  const userScoreVal = SCORE_ORDER[creditScore] ?? 0
  const eligible = cards.filter(card =>
    SCORE_ORDER[card.minScore] <= userScoreVal && !ownedIds.includes(card.id)
  )

  // Hard filter: annual fee preference
  const feeEligible = eligible.filter(card => {
    if (annualFee === 'none')     return card.annualFee === 0
    if (annualFee === 'minimal')  return card.annualFee <= 50
    if (annualFee === 'low')      return card.annualFee <= 100
    if (annualFee === 'medium')   return card.annualFee <= 300
    if (annualFee === 'elevated') return card.annualFee <= 550
    return true // 'high' — no limit
  })

  // Score each card
  const scored = feeEligible.map(card => {
    let score = 0

    // Goal match (high weight) — award for any matching goal
    const goalMatches = effectiveGoals.filter(g => card.goals.includes(g)).length
    if (goalMatches >= 1) score += 40
    if (goalMatches >= 2) score += 15  // bonus for double match
    // Partial overlap for building credit
    if (goals.includes('building_credit') && card.goals.includes('cash_back')) score += 10

    // Spending category match (medium weight)
    const spendMatches = spendings.filter(s => card.spending.includes(s)).length
    if (spendMatches >= 1) score += 25
    if (spendMatches >= 2) score += 10

    // Lifestyle match (medium weight)
    if (lifestyles.includes('family')) {
      if (card.lifestyle.includes('everyday')) score += 20
      if (card.spending.includes('groceries') || card.spending.includes('general')) score += 10
    }
    const lifestyleMatches = lifestyles.filter(l => l !== 'family' && card.lifestyle.includes(l)).length
    if (lifestyleMatches >= 1) score += 20
    if (lifestyleMatches >= 2) score += 10

    // Prefer cards that closely match (not over-qualify) the credit tier
    const cardScoreVal = SCORE_ORDER[card.minScore]
    const gap = userScoreVal - cardScoreVal
    if (gap === 0) score += 15
    else if (gap === 1) score += 10
    else if (gap >= 3) score -= 5

    // Bonus for no annual fee when on a tight score budget
    if (userScoreVal <= 1 && card.annualFee === 0) score += 10

    // Bonus for credit-building cards when history is short or nonexistent
    if ((['no_credit', 'new', 'building'].includes(creditAge)) && card.goals.includes('building_credit')) score += 15

    // Premium lifestyle bonus for high-fee cards
    if (lifestyles.includes('luxury') && card.annualFee >= 395) score += 10
    if (lifestyles.includes('traveler') && card.goals.includes('travel')) score += 10

    return { ...card, score }
  })

  // Sort descending and return top 5
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export function getMatchReasons(card, answers) {
  const reasons = []

  const goals     = Array.isArray(answers.goal)      ? answers.goal      : (answers.goal      ? [answers.goal]      : [])
  const spendings = Array.isArray(answers.spending)  ? answers.spending  : (answers.spending  ? [answers.spending]  : [])
  const lifestyles = Array.isArray(answers.lifestyle) ? answers.lifestyle : (answers.lifestyle ? [answers.lifestyle] : [])

  const goalLabels = {
    cash_back: 'earns strong cash back rewards',
    travel: 'is built for travel rewards',
    building_credit: 'is designed to build your credit profile',
    low_apr: 'offers an introductory 0% APR period',
    balance_transfer: 'offers a strong balance transfer intro rate',
    premium: 'delivers premium perks and status',
  }
  const matchedGoal = goals.find(g => {
    const effective = g === 'balance_transfer' ? 'low_apr' : g
    return card.goals.includes(effective)
  })
  if (matchedGoal) reasons.push(goalLabels[matchedGoal] || 'aligns with your goal')

  const spendLabels = {
    dining: 'rewards dining and restaurant spending',
    groceries: 'excels at grocery store rewards',
    travel: 'maximizes travel purchases',
    gas: 'gives great returns on gas',
    online: 'rewards online shopping',
    general: 'earns consistently on all spending',
  }
  const matchedSpend = spendings.find(s => card.spending.includes(s))
  if (matchedSpend) reasons.push(spendLabels[matchedSpend] || 'matches your spending habits')

  const lifestyleLabels = {
    simple: 'is straightforward with no complexity',
    everyday: 'fits naturally into everyday life',
    family: 'suits a family-focused lifestyle',
    active: 'rewards an active social lifestyle',
    traveler: 'is purpose-built for frequent travelers',
    luxury: 'delivers a luxury card experience',
  }
  const lifestyleMatch = lifestyles.includes('family')
    ? card.lifestyle.includes('everyday')
    : lifestyles.some(l => card.lifestyle.includes(l))
  if (lifestyleMatch) {
    const matchedLifestyle = lifestyles.find(l => l === 'family' ? card.lifestyle.includes('everyday') : card.lifestyle.includes(l))
    reasons.push(lifestyleLabels[matchedLifestyle] || 'suits your lifestyle')
  }

  if (card.annualFee === 0) reasons.push('has no annual fee')

  return reasons.slice(0, 3)
}
