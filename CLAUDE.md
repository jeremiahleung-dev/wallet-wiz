# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working in this repository.

## Repository Overview

**Repository:** `wallet-wiz`
**Description:** A quiz-style web app that recommends the best credit/debit card for the user based on their spending habits and financial goals.
**Deploy target:** Vercel
**Status:** Active development

---

## Who This Is For

People who feel overwhelmed by credit card choices and want a quick, unbiased recommendation. Users answer a short survey about their spending habits, priorities (rewards, cashback, travel, etc.), and credit profile — and get a ranked list of cards matched to them.

## Problem We're Solving

Picking the right card is confusing. Most comparison sites are ad-driven and bury the best options. optimal gives users a clean, privacy-friendly quiz that surfaces the right card for their actual life — no sign-up required.

## Goals

- User completes the survey in under 2 minutes
- Results are personalized, easy to understand, and actionable
- No user data is stored or sold — privacy-first by design
- App loads fast and works well on mobile

---

## Project Structure

```
wallet-wiz/
├── src/
│   ├── App.jsx                   # Root: screen state (welcome → survey → results)
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles + theme variables
│   ├── components/
│   │   ├── Header.jsx            # Top nav with theme toggle and home button
│   │   ├── Footer.jsx            # Footer with privacy link
│   │   ├── Welcome.jsx           # Landing/start screen
│   │   ├── Survey.jsx            # Multi-step question flow
│   │   ├── QuestionCard.jsx      # Individual question UI
│   │   ├── Results.jsx           # Ranked card recommendations
│   │   ├── CardVisual.jsx        # Visual card display component
│   │   ├── PixelCardProgress.jsx # Progress indicator
│   │   ├── WalletShuffle.jsx     # Animated card shuffle visual
│   │   └── PrivacyModal.jsx      # Privacy policy modal
│   ├── data/
│   │   ├── cards.js              # Card definitions (name, benefits, eligibility rules)
│   │   └── questions.js          # Survey questions and answer options
│   └── utils/
│       ├── recommend.js          # Scoring/matching logic: answers → ranked cards
│       └── track.js              # Analytics event tracking (Vercel Analytics)
├── index.html
├── vite.config.js
└── package.json
```

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS custom properties (theme variables in `index.css`) |
| Analytics | Vercel Analytics (`@vercel/analytics`) |
| Routing | None — screen state managed in `App.jsx` |
| Deployment | Vercel |

---

## Getting Started

```bash
npm install
npm run dev
```

### Build & Preview

```bash
npm run build
npm run preview
```

---

## App Flow

```
Welcome screen → Survey (multi-step questions) → Results (ranked card recommendations)
                                                        ↓
                                               PrivacyModal (overlay, any screen)
```

- Screen state lives in `App.jsx` (`welcome` | `survey` | `results`)
- Survey answers flow into `getRecommendations()` in `utils/recommend.js`
- Recommendations are passed as props to `Results.jsx`
- Theme (`light` | `dark`) is toggled via `Header` and applied via `data-theme` on `<html>`

---

## Development Workflow

### Making Changes

1. Branch from `main` (or the designated base branch).
2. Make focused, atomic commits with clear messages.
3. Run a manual smoke-test (click through welcome → survey → results) before pushing.
4. Open a pull request for review.

### Commit Message Style

Use concise imperative messages:

```
Add cashback scoring weight to recommend logic
Fix dark mode card contrast on Results screen
Update questions to include travel spending category
```

---

## Code Conventions

- Keep components small and single-purpose.
- Survey questions and card data live in `src/data/` — do not hardcode them in components.
- Scoring/recommendation logic stays in `utils/recommend.js` — keep it pure (no side effects).
- Analytics calls go through `utils/track.js` — never call Vercel Analytics directly in components.
- Do not add speculative abstractions.
- Do not leave dead code.

---

## AI Assistant Guidelines

When working in this repository:

1. **Read before editing** — always read a file before modifying it.
2. **Minimal scope** — make only the changes requested; do not refactor surrounding code.
3. **No speculative features** — do not add config options, flags, or abstractions that weren't asked for.
4. **No extra documentation** — do not add docstrings, type annotations, or comments to code you didn't change.
5. **Security** — never introduce XSS or other OWASP Top 10 vulnerabilities.
6. **Destructive operations** — confirm with the user before deleting files, force-pushing, or resetting history.
7. **Branch discipline** — develop on the designated branch; never push to `main` directly.
8. **Commit hygiene** — create new commits rather than amending. Never skip hooks (`--no-verify`).

---

# Website Design Recreation

## Workflow

When the user provides a reference image (screenshot) and optionally some CSS classes or style notes:

1. **Generate** a single `index.html` file using Tailwind CSS (via CDN). Include all content inline — no external files unless requested.
2. **Screenshot** the rendered page using Puppeteer (`npx puppeteer screenshot index.html --fullpage` or equivalent). If the page has distinct sections, capture those individually too.
3. **Compare** your screenshot against the reference image. Check for mismatches in:
   - Spacing and padding (measure in px)
   - Font sizes, weights, and line heights
   - Colors (exact hex values)
   - Alignment and positioning
   - Border radii, shadows, and effects
   - Responsive behavior
   - Image/icon sizing and placement
4. **Fix** every mismatch found. Edit the HTML/Tailwind code.
5. **Re-screenshot** and compare again.
6. **Repeat** steps 3–5 until the result is within ~2–3px of the reference everywhere.

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible differences remain.

## Technical Defaults

- Use Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- Use placeholder images from `https://placehold.co/` when source images aren't provided
- Mobile-first responsive design
- Single `index.html` file unless the user requests otherwise

## Rules

- Do not add features, sections, or content not present in the reference image
- Match the reference exactly — do not "improve" the design
- If the user provides CSS classes or style tokens, use them verbatim
- Keep code clean but don't over-abstract — inline Tailwind classes are fine
- When comparing screenshots, be specific about what's wrong (e.g., "heading is 32px but reference shows ~24px", "gap between cards is 16px but should be 24px")

---

_Last updated: 2026-04-09_
1