# Life Calendar

A warm, emotional web app that visualizes remaining time with loved ones (parents, pets, anyone) as a grid of days/weeks/months.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **i18n:** next-intl (English default, multi-language support)
- **Storage:** localStorage + URL sharing (base64 encoded)
- **Deployment:** Vercel

## Project Structure
- `/app` — Next.js app router pages
- `/components` — React components
- `/lib` — Utility functions, calculations, i18n
- `/public` — Static assets

## Design Principles
- Warm, emotional tone — pastel colors, rounded corners, soft shadows
- Mobile-first responsive design
- No backend — all computation client-side
- Data stored in localStorage, shareable via URL encoding

## Key Pages
- `/` — Landing page
- `/dashboard` — Subject cards with daily reminder
- `/view/[id]` — Detailed life grid with day/week/month toggle

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `vercel` — Deploy to Vercel
