import { track } from '@vercel/analytics'

/**
 * Thin wrapper around Vercel Analytics track().
 * Analytics must never crash the app.
 */
export function trackEvent(name, properties = {}) {
  try {
    track(name, properties)
  } catch (_) {
    // silent — analytics should never affect the user experience
  }
}

// Named events — kept centralised so refactoring is trivial
export const Events = {
  SURVEY_STARTED:          'survey_started',
  WALLET_STEP_COMPLETED:   'wallet_step_completed',
  QUESTION_ANSWERED:       'question_answered',
  RESULTS_VIEWED:          'results_viewed',
  CARD_EXPANDED:           'card_expanded',
  CARD_COLLAPSED:          'card_collapsed',
  APPLY_CLICKED:           'apply_clicked',
  SURVEY_RESTARTED:        'survey_restarted',
  PRIVACY_VIEWED:          'privacy_viewed',
  CARD_SAVED:              'card_saved',
  CARD_UNSAVED:            'card_unsaved',
  COMPARE_OPENED:          'compare_opened',
}
