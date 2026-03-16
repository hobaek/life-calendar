# Life Calendar

> How many Saturdays do you have left with your mom?

Life Calendar turns that quiet, uncomfortable question into something actionable. It visualizes the remaining time you have with the people you love — parents, grandparents, pets, anyone — as a grid of days, weeks, or months. Not to make you sad. To help you show up.

**[Try it live →](https://life-calendar-gray.vercel.app)**

---

<!-- Add a screenshot here -->
<!-- ![Life Calendar Screenshot](./docs/screenshot.png) -->

---

## Why it exists

A single statistic changed how someone spent their weekends: if you see your parents twice a month, and they have 15 years left, you have roughly 360 visits remaining. Seeing that number — finite, real — makes you want to use them better.

Life Calendar makes that feeling concrete for anyone in your life.

---

## Features

**Life grid visualization**
Each cell is a day, week, or month of someone's remaining life. Filled cells are time already passed together; empty cells are what you still have. Toggle between views at any time, or expand to fullscreen.

**Smart time calculation**
The grid shows `min(your remaining time, their remaining time)` — because shared time ends when either of you reaches your limit.

**Daily reminder**
A gentle nudge on the dashboard: *"You have 234 Saturdays left with Mom."* Recalculated every day.

**Season counter**
See how many springs, summers, autumns, and winters remain — a more human way to feel time than raw numbers.

**Time ratio bar**
A quiet bar showing what percentage of your shared time has already passed.

**Meeting frequency calculator**
Enter how often you meet and see the realistic count of remaining visits.

**Onboarding flow**
Set your own profile first (age, life expectancy), then add the people who matter. A "Me" subject is created automatically so the math always accounts for your own remaining time.

**URL sharing**
Share a view with anyone via a base64-encoded URL. No account, no backend — just a link.

**5 languages**
English, 한국어, 日本語, 中文, Español.

**Private by default**
Everything lives in your browser's localStorage. Nothing is ever sent to a server.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 3 |
| i18n | next-intl |
| Language | TypeScript |
| Testing | Vitest + Testing Library |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone
git clone https://github.com/hobaek/life-calendar.git
cd life-calendar

# Install
yarn install

# Run locally
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Run tests
yarn test

# Build for production
yarn build
```

---

## Deploy

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hobaek/life-calendar)

No environment variables required. The app runs entirely client-side.

---

## Project Structure

```
/app          — Next.js App Router pages (/, /dashboard, /view/[id])
/components   — React components
/lib          — Calculations, utilities, i18n helpers
/public       — Static assets (sitemap, robots.txt, OG images)
```

---

## License

MIT
