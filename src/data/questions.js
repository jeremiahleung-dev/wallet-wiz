export const questions = [
  {
    id: 'creditScore',
    question: 'What is your current credit score?',
    subtitle: 'This determines which cards you\'re most likely to be approved for.',
    options: [
      { id: 'poor',      label: 'Building Up',    description: 'Under 580 — just getting started or rebuilding' },
      { id: 'fair',      label: 'Fair',            description: '580–669 — making progress, limited options' },
      { id: 'good',      label: 'Good',            description: '670–739 — solid footing, most cards available' },
      { id: 'very_good', label: 'Very Good',       description: '740–799 — strong profile, great rewards available' },
      { id: 'excellent', label: 'Excellent',       description: '800+ — top tier, every card is on the table' },
    ],
  },
  {
    id: 'creditAge',
    question: 'How long have you had credit?',
    subtitle: 'Your credit history length affects both approvals and your overall score.',
    options: [
      { id: 'new',         label: 'Just Starting',   description: 'Less than 1 year — the beginning of the journey' },
      { id: 'building',   label: 'Building',        description: '1–3 years — gaining traction' },
      { id: 'established', label: 'Established',    description: '3–7 years — a solid track record' },
      { id: 'seasoned',   label: 'Seasoned',        description: '7+ years — a long, healthy history' },
    ],
  },
  {
    id: 'goal',
    question: 'What is your primary goal with a new card?',
    subtitle: 'The right card depends heavily on what you want it to do for you.',
    options: [
      { id: 'cash_back',        label: 'Cash Back',          description: 'Simple returns on everything you spend' },
      { id: 'travel',           label: 'Travel Rewards',     description: 'Points or miles for flights and hotels' },
      { id: 'building_credit',  label: 'Build Credit',       description: 'Establish or improve your credit profile' },
      { id: 'low_apr',          label: '0% Intro APR',       description: 'Finance a big purchase interest-free' },
      { id: 'premium',          label: 'Premium Perks',      description: 'Lounge access, status, and elite benefits' },
    ],
  },
  {
    id: 'spending',
    question: 'Where do you spend the most each month?',
    subtitle: 'Different cards reward different spending categories generously.',
    options: [
      { id: 'dining',    label: 'Dining & Bars',      description: 'Restaurants, cafés, delivery apps' },
      { id: 'groceries', label: 'Groceries',          description: 'Supermarkets and grocery stores' },
      { id: 'travel',    label: 'Travel',             description: 'Flights, hotels, rideshares, transit' },
      { id: 'gas',       label: 'Gas & EV Charging',  description: 'Fuel stations and charging networks' },
      { id: 'online',    label: 'Online Shopping',    description: 'E-commerce, subscriptions, streaming' },
      { id: 'general',   label: 'A Bit of Everything', description: 'No single category dominates' },
    ],
  },
  {
    id: 'annualFee',
    question: 'How do you feel about annual fees?',
    subtitle: 'Premium cards often return far more in value than they cost — if you use them.',
    options: [
      { id: 'none',    label: 'No Fees, Ever',       description: 'I want zero annual cost' },
      { id: 'low',     label: 'Up to $100/yr',       description: 'Fine if the rewards justify it' },
      { id: 'medium',  label: 'Up to $300/yr',       description: 'Happy to pay for solid perks' },
      { id: 'high',    label: 'No Limit',            description: 'Willing to pay for premium benefits' },
    ],
  },
  {
    id: 'lifestyle',
    question: 'How would you describe your lifestyle?',
    subtitle: 'Your habits shape which perks and features you\'ll actually use.',
    options: [
      { id: 'simple',   label: 'Simple & Mindful',  description: 'I budget carefully, keep it lean' },
      { id: 'everyday', label: 'Everyday Modern',   description: 'Work, errands, the occasional dinner out' },
      { id: 'active',   label: 'Active & Social',   description: 'Dining out, events, and weekend getaways' },
      { id: 'traveler', label: 'Frequent Traveler', description: 'Flights and hotels are a regular occurrence' },
      { id: 'luxury',   label: 'Luxury-Oriented',   description: 'I appreciate the finer things and spend accordingly' },
    ],
  },
]
