# Changelog

## v1.0.0 (2026-03-15)

Initial release of Life Calendar.

### Core Features
- Life grid visualization with day/week/month toggle
- Auto-fit grid to container width with fullscreen expand mode
- Add/edit/delete subjects (parents, pets, anyone)
- Daily reminder ("You have 234 Saturdays left with Mom")
- Season counter (remaining springs, summers, autumns, winters)
- Time ratio bar (% of time together already passed)
- Meeting frequency calculator (remaining meetups based on how often you meet)
- URL sharing via base64 encoding (no backend needed)

### User Profile & Onboarding
- 2-step onboarding: set your profile first, then add your first loved one
- User profile (birth date + expected lifespan) for accurate calculations
- `min(your remaining time, their remaining time)` — shows the real time you have together
- Auto-generated "Me" subject from profile

### Internationalization
- 5 languages: English, 한국어, 日本語, 中文, Español
- Locale dropdown switcher with cookie persistence
- All UI strings externalized via next-intl

### SEO & Analytics
- Sitemap.xml and robots.txt (Next.js native)
- Open Graph and Twitter Card meta tags
- Google Search Console verified and indexed
- Vercel Analytics and Speed Insights

### Technical
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 3 with custom design tokens
- Vitest with 23 tests (calculations + storage)
- localStorage for data persistence, no backend
- Deployed on Vercel
