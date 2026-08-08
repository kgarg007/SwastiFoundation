## Tech stack

- React 19 + React Router 7
- Vite 8 (rolldown-powered build)
- Plain CSS with custom properties (design tokens in `src/styles/tokens.css`)
- No UI framework dependency — all components are hand-built and reusable

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  components/
    layout/      Header, Footer, WhatsApp button, page Layout wrapper
    sections/     Homepage sections (Hero, ImpactNumbers, FounderMessage, …)
    ui/           Reusable primitives (Button, Card, Section, icons, …)
  context/        ThemeContext (light/dark mode)
  i18n/           LanguageContext + en/hi locale files
  data/           orgData.js — single source of truth for all org content
  hooks/          useReveal (scroll animation), useCountUp (stat counters)
  pages/          One file per route
  styles/         Design tokens, global resets, shared form/page-hero styles
```






