# Life Calendar — Design Spec

## Overview

A warm, emotional web app that visualizes remaining time with loved ones (parents, pets, anyone) as a grid of days, weeks, or months. The core motivation is to show users how limited their remaining time is with the people and companions they love — starting with "remaining weekends with parents" — to inspire intentional, meaningful time together.

## Tech Stack

- **Framework:** Next.js (App Router) with React
- **Styling:** Tailwind CSS
- **i18n:** next-intl — English default, multi-language ready
- **Storage:** Browser localStorage + base64 URL sharing
- **Deployment:** Vercel (CLI-based)
- **Fonts:** Lora (serif, headings) + Nunito (sans-serif, body) via Google Fonts

## Pages & Routes

### Landing Page (`/`)
- Emotional headline: "How many Saturdays do you have left?"
- Brief description of the app's purpose
- "Start Counting" CTA button → navigates to `/dashboard`

### Dashboard (`/dashboard`)
- **Daily Reminder Bar** — top of page, gradient background, rotating message (e.g., "You have 234 Saturdays left with Mom")
- **Subject Cards Grid** — responsive grid (1 col mobile, 2-3 col desktop)
  - Each card shows: avatar/emoji, name, birth info, key stats (remaining weeks/days/years), mini grid preview
  - Click → navigates to `/view/[id]`
- **Add Card** — dashed border card with "+" to add new subject
  - Opens modal with form: name, birth date, expected lifespan, (optional) meeting frequency

### Detail Grid Page (`/view/[id]`)
- **Header:** Back button, subject name, birth info, Share button
- **Unit Toggle:** Days / Weeks / Months — switches grid rendering
- **Life Grid:** Main visualization
  - Filled squares (warm coral) = time lived
  - Today square (red, pulsing) = current position
  - Empty squares (light beige) = time remaining
- **Time Ratio Bar:** Visual bar showing % of time together already passed vs remaining
- **Season Counter:** 4 cards — remaining springs, summers, autumns, winters
- **Stats Cards:** Remaining days, remaining meetups (if frequency set), remaining birthdays

## Data Model

```typescript
interface Subject {
  id: string;                    // UUID
  name: string;                  // Display name
  birthDate: string;             // ISO date "YYYY-MM-DD"
  expectedLifespan: number;      // Years
  meetingFrequency?: {           // Optional
    type: "weekly" | "monthly" | "yearly";
    count: number;               // e.g., 2 = twice per month
  };
  createdAt: string;             // ISO date
}
```

## Storage Strategy

### localStorage
- Key: `life-calendar-subjects`
- Value: JSON array of `Subject` objects
- Loaded on dashboard mount, saved on any mutation

### URL Sharing
- Share button encodes subject data as base64 in query parameter
- URL format: `/view?data=eyJuYW1l...`
- Recipients can view the grid without localStorage
- No server required

## Calculation Logic (Client-Side)

All calculations run in the browser:

- **Remaining days** = (birthDate + expectedLifespan in years) - today
- **Remaining weeks** = remainingDays / 7
- **Remaining months** = remainingDays / 30.44
- **Remaining meetups** = based on meetingFrequency × remaining time
- **Remaining seasons** = remaining years (rounded), one per season type
- **Time ratio** = (today - first meeting estimate) / total expected overlap
- **Grid cells:**
  - Total = expectedLifespan × (365 | 52 | 12) depending on unit
  - Filled = age in current unit
  - Today = current position
  - Empty = remaining

## UI Design

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| bg | `#FFF8F0` | Page background |
| card-bg | `#FFFFFF` | Card backgrounds |
| coral | `#F4845F` | Primary accent, filled grid cells |
| coral-light | `#FDDDD2` | Avatar bg, gradients |
| lavender | `#B8B8F3` | Secondary accent |
| lavender-light | `#E8E8FC` | Avatar bg, share button |
| mint | `#7EC8A0` | Tertiary accent |
| mint-light | `#D4F0E0` | Avatar bg |
| text | `#3D3535` | Primary text |
| text-light | `#8A7E7E` | Secondary text |
| empty | `#F0E6DC` | Empty grid cells |
| today | `#FF6B6B` | Today marker (with pulse) |

### Typography
- **Headings:** Lora (serif), 600-700 weight
- **Body:** Nunito (sans-serif), 400-600 weight

### Design Tokens
- Border radius: 16px (cards), 50px (buttons), 2.5px (grid cells)
- Shadows: `0 2px 16px rgba(61,53,53,0.08)` default, stronger on hover
- Transitions: 0.2s ease on interactive elements

### Responsive Breakpoints
- Mobile (<640px): single column cards, smaller grid cells (7px), 2-col seasons
- Desktop (>=640px): 2-3 column cards, 10px grid cells, 4-col seasons

## i18n Strategy

- Use `next-intl` with message files per locale
- Default locale: `en`
- Initial supported locales: `en`, `ko`
- All user-facing strings in message files, no hardcoded text
- Locale switcher in header/footer

## Components

| Component | Props | Description |
|-----------|-------|-------------|
| `SubjectCard` | subject: Subject | Dashboard card with mini grid |
| `LifeGrid` | subject, unit | Main grid visualization |
| `AddSubjectModal` | onSave | Form modal for new subject |
| `DailyReminder` | subjects: Subject[] | Rotating reminder bar |
| `SeasonCounter` | remainingYears | 4 season cards |
| `TimeRatioBar` | spent, remaining | Percentage bar |
| `UnitToggle` | value, onChange | Day/Week/Month toggle |
| `ShareButton` | subject | Copies share URL |
| `MiniGrid` | subject | Small preview grid for cards |

## Non-Goals (v1)

- No user accounts or authentication
- No backend/database
- No push notifications
- No image export (PNG) — future enhancement
- No milestone markers on grid — future enhancement
