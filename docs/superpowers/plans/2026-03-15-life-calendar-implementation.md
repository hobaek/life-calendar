# Life Calendar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a warm, emotional web app that visualizes remaining time with loved ones as a grid of days/weeks/months.

**Architecture:** Next.js App Router with all computation client-side. Data lives in localStorage with base64 URL sharing for link recipients. i18n via next-intl with English default and Korean support.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3, next-intl, TypeScript, Vitest, Vercel

---

## File Structure

```
life-calendar/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts, metadata
│   │   ├── page.tsx                # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard page
│   │   └── view/
│   │       ├── page.tsx            # Shared link handler (/view?data=...)
│   │       └── [id]/
│   │           └── page.tsx        # Detail grid page (localStorage)
│   ├── components/
│   │   ├── SubjectCard.tsx         # Dashboard card with mini grid
│   │   ├── SubjectFormModal.tsx    # Add/edit subject modal
│   │   ├── LifeGrid.tsx           # Main grid visualization
│   │   ├── MiniGrid.tsx           # Simplified preview grid
│   │   ├── DailyReminder.tsx      # Rotating reminder bar
│   │   ├── SeasonCounter.tsx      # 4 season cards
│   │   ├── TimeRatioBar.tsx       # Percentage bar
│   │   ├── UnitToggle.tsx         # Day/week/month toggle
│   │   └── ShareButton.tsx        # URL copy button
│   ├── lib/
│   │   ├── types.ts               # Subject interface, types
│   │   ├── calculations.ts        # All date/time calculations
│   │   ├── storage.ts             # localStorage CRUD + URL encoding
│   │   └── constants.ts           # Color tokens, avatar options
│   └── i18n/
│       ├── messages/
│       │   ├── en.json            # English messages
│       │   └── ko.json            # Korean messages
│       └── request.ts             # next-intl config
├── tests/
│   ├── lib/
│   │   ├── calculations.test.ts   # Calculation logic tests
│   │   └── storage.test.ts        # Storage logic tests
│   └── components/
│       └── LifeGrid.test.tsx      # Grid rendering tests
├── tailwind.config.ts              # Custom colors, fonts
├── next.config.ts                  # next-intl plugin
├── vitest.config.ts                # Test config
└── package.json
```

---

## Chunk 1: Project Setup & Core Logic

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Modify: existing `CLAUDE.md` if needed

- [ ] **Step 1: Create Next.js app**

```bash
cd /Users/seunghobaek/Documents/code/life-calendar
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --yes
```

Note: This will scaffold into the existing directory. If it complains about existing files, move `CLAUDE.md`, `MEMORY.md`, `handoff.md`, `mockup.html`, and `docs/` aside, scaffold, then move back.

- [ ] **Step 2: Install dependencies**

```bash
npm install next-intl uuid tailwindcss@3
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @types/uuid
```

- [ ] **Step 3: Configure Tailwind with custom theme**

In `tailwind.config.ts`, extend the theme with custom colors from the spec:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFF8F0",
        "card-bg": "#FFFFFF",
        coral: { DEFAULT: "#F4845F", light: "#FDDDD2" },
        lavender: { DEFAULT: "#B8B8F3", light: "#E8E8FC" },
        mint: { DEFAULT: "#7EC8A0", light: "#D4F0E0" },
        "lc-text": { DEFAULT: "#3D3535", light: "#8A7E7E" },
        empty: "#F0E6DC",
        today: "#FF6B6B",
        "filled-alt": "#FFB088",
        "warm-gray": "#6B6161",
        "light-gray": "#E8E0D8",
      },
      fontFamily: {
        serif: ["Lora", "serif"],
        sans: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        button: "50px",
        cell: "2.5px",
      },
      boxShadow: {
        card: "0 2px 16px rgba(61,53,53,0.08)",
        "card-hover": "0 4px 24px rgba(61,53,53,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`

- [ ] **Step 5: Verify setup**

```bash
npm run dev  # Should start on localhost:3000
npm run test # Should run (0 tests)
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js project with Tailwind, Vitest, next-intl"
```

---

### Task 2: Types & Constants

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create types**

Create `src/lib/types.ts`:

```typescript
export interface MeetingFrequency {
  type: "weekly" | "monthly" | "yearly";
  count: number;
}

export type AvatarColor = "coral" | "lavender" | "mint";

export type GridUnit = "days" | "weeks" | "months";

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  avatarColor: AvatarColor;
  birthDate: string;          // ISO "YYYY-MM-DD"
  expectedLifespan: number;   // years
  firstMetDate?: string;      // ISO "YYYY-MM-DD"
  meetingFrequency?: MeetingFrequency;
  createdAt: string;          // ISO "YYYY-MM-DD"
}
```

- [ ] **Step 2: Create constants**

Create `src/lib/constants.ts`:

```typescript
import { AvatarColor } from "./types";

export const AVATAR_COLORS: AvatarColor[] = ["coral", "lavender", "mint"];

export const AVATAR_COLOR_MAP: Record<AvatarColor, { bg: string; text: string }> = {
  coral: { bg: "bg-coral-light", text: "text-coral" },
  lavender: { bg: "bg-lavender-light", text: "text-lavender" },
  mint: { bg: "bg-mint-light", text: "text-mint" },
};

export const DEFAULT_EMOJIS = ["👩", "👨", "👧", "👦", "🐶", "🐱", "🐰", "🐦", "❤️"];

export const STORAGE_KEY = "life-calendar-subjects";
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/constants.ts
git commit -m "feat: add Subject types and constants"
```

---

### Task 3: Calculation Logic (TDD)

**Files:**
- Create: `src/lib/calculations.ts`
- Create: `tests/lib/calculations.test.ts`

- [ ] **Step 1: Write failing tests for basic calculations**

Create `tests/lib/calculations.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import {
  getRemainingDays,
  getRemainingWeeks,
  getRemainingMonths,
  getRemainingMeetups,
  getRemainingSeasons,
  getTimeRatio,
  getGridData,
} from "@/lib/calculations";
import { Subject } from "@/lib/types";

const mockSubject: Subject = {
  id: "test-1",
  name: "Mom",
  emoji: "👩",
  avatarColor: "coral",
  birthDate: "1960-03-15",
  expectedLifespan: 85,
  createdAt: "2026-03-15",
};

describe("getRemainingDays", () => {
  it("calculates remaining days from birth date and lifespan", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingDays(mockSubject);
    // End date: 2045-03-15, from 2026-03-15 = 19 years = ~6939 days
    expect(result).toBeGreaterThan(6900);
    expect(result).toBeLessThan(7000);
    vi.useRealTimers();
  });

  it("returns 0 when lifespan is exceeded", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2050-01-01"));
    const result = getRemainingDays(mockSubject);
    expect(result).toBe(0);
    vi.useRealTimers();
  });
});

describe("getRemainingWeeks", () => {
  it("returns remaining days divided by 7", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingWeeks(mockSubject);
    expect(result).toBeGreaterThan(990);
    expect(result).toBeLessThan(1000);
    vi.useRealTimers();
  });
});

describe("getRemainingMonths", () => {
  it("uses calendar month difference, not days/30.44", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingMonths(mockSubject);
    // 2026-03 to 2045-03 = 228 months
    expect(result).toBe(228);
    vi.useRealTimers();
  });
});

describe("getRemainingMeetups", () => {
  it("calculates weekly meetups", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const subject = {
      ...mockSubject,
      meetingFrequency: { type: "weekly" as const, count: 1 },
    };
    const result = getRemainingMeetups(subject);
    expect(result).toBeGreaterThan(990);
    vi.useRealTimers();
  });

  it("returns null when no meeting frequency", () => {
    const result = getRemainingMeetups(mockSubject);
    expect(result).toBeNull();
  });
});

describe("getRemainingSeasons", () => {
  it("returns seasons based on remaining years", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getRemainingSeasons(mockSubject);
    expect(result).toEqual({ spring: 19, summer: 19, autumn: 19, winter: 19 });
    vi.useRealTimers();
  });
});

describe("getTimeRatio", () => {
  it("calculates ratio using firstMetDate", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const subject = { ...mockSubject, firstMetDate: "1990-01-01" };
    const result = getTimeRatio(subject);
    expect(result).toBeGreaterThan(0.6);
    expect(result).toBeLessThan(0.7);
    vi.useRealTimers();
  });

  it("defaults to birthDate when firstMetDate not set", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getTimeRatio(mockSubject);
    // (2026-03-15 - 1960-03-15) / (2045-03-15 - 1960-03-15) = 66/85 ≈ 0.776
    expect(result).toBeCloseTo(0.776, 1);
    vi.useRealTimers();
  });
});

describe("getGridData", () => {
  it("returns correct grid for weeks unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "weeks");
    expect(result.total).toBe(85 * 52);
    expect(result.filled).toBeGreaterThan(3400);
    expect(result.todayIndex).toBe(result.filled);
    expect(result.columns).toBe(52);
    vi.useRealTimers();
  });

  it("returns correct grid for months unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "months");
    expect(result.total).toBe(85 * 12);
    expect(result.columns).toBe(12);
    vi.useRealTimers();
  });

  it("returns correct grid for days unit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15"));
    const result = getGridData(mockSubject, "days");
    expect(result.total).toBe(85 * 365);
    expect(result.columns).toBe(365);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- tests/lib/calculations.test.ts
```

Expected: FAIL — module `@/lib/calculations` not found.

- [ ] **Step 3: Implement calculations**

Create `src/lib/calculations.ts`:

```typescript
import { Subject, GridUnit } from "./types";

function getEndDate(subject: Subject): Date {
  const birth = new Date(subject.birthDate);
  return new Date(birth.getFullYear() + subject.expectedLifespan, birth.getMonth(), birth.getDate());
}

export function getRemainingDays(subject: Subject): number {
  const end = getEndDate(subject);
  const today = new Date();
  const diff = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getRemainingWeeks(subject: Subject): number {
  return Math.floor(getRemainingDays(subject) / 7);
}

export function getRemainingMonths(subject: Subject): number {
  const end = getEndDate(subject);
  const today = new Date();
  if (end <= today) return 0;
  return (end.getFullYear() - today.getFullYear()) * 12 + (end.getMonth() - today.getMonth());
}

export function getRemainingYears(subject: Subject): number {
  const end = getEndDate(subject);
  const today = new Date();
  return Math.max(0, Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
}

export function getRemainingMeetups(subject: Subject): number | null {
  if (!subject.meetingFrequency) return null;
  const { type, count } = subject.meetingFrequency;
  switch (type) {
    case "weekly": return count * getRemainingWeeks(subject);
    case "monthly": return count * getRemainingMonths(subject);
    case "yearly": return count * getRemainingYears(subject);
  }
}

export function getRemainingSeasons(subject: Subject): { spring: number; summer: number; autumn: number; winter: number } {
  const years = getRemainingYears(subject);
  return { spring: years, summer: years, autumn: years, winter: years };
}

export function getTimeRatio(subject: Subject): number {
  const startDate = new Date(subject.firstMetDate ?? subject.birthDate);
  const endDate = getEndDate(subject);
  const today = new Date();
  const totalSpan = endDate.getTime() - startDate.getTime();
  if (totalSpan <= 0) return 1;
  const elapsed = today.getTime() - startDate.getTime();
  return Math.min(1, Math.max(0, elapsed / totalSpan));
}

function getAgeInUnit(subject: Subject, unit: GridUnit): number {
  const birth = new Date(subject.birthDate);
  const today = new Date();
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  switch (unit) {
    case "days": return diffDays;
    case "weeks": return Math.floor(diffDays / 7);
    case "months": {
      return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    }
  }
}

const UNIT_MULTIPLIER: Record<GridUnit, number> = { days: 365, weeks: 52, months: 12 };
const UNIT_COLUMNS: Record<GridUnit, number> = { days: 365, weeks: 52, months: 12 };

export function getGridData(subject: Subject, unit: GridUnit) {
  const total = subject.expectedLifespan * UNIT_MULTIPLIER[unit];
  const filled = Math.min(getAgeInUnit(subject, unit), total);
  return {
    total,
    filled,
    todayIndex: filled,
    columns: UNIT_COLUMNS[unit],
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test -- tests/lib/calculations.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculations.ts tests/lib/calculations.test.ts
git commit -m "feat: add calculation logic with tests"
```

---

### Task 4: Storage Logic (TDD)

**Files:**
- Create: `src/lib/storage.ts`
- Create: `tests/lib/storage.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import {
  getSubjects,
  saveSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  encodeSubjectForUrl,
  decodeSubjectFromUrl,
} from "@/lib/storage";
import { Subject } from "@/lib/types";

const mockSubject: Subject = {
  id: "test-1",
  name: "Mom",
  emoji: "👩",
  avatarColor: "coral",
  birthDate: "1960-03-15",
  expectedLifespan: 85,
  createdAt: "2026-03-15",
};

beforeEach(() => {
  localStorage.clear();
});

describe("getSubjects / saveSubjects", () => {
  it("returns empty array when no data", () => {
    expect(getSubjects()).toEqual([]);
  });

  it("saves and retrieves subjects", () => {
    saveSubjects([mockSubject]);
    expect(getSubjects()).toEqual([mockSubject]);
  });
});

describe("addSubject", () => {
  it("adds a subject to storage", () => {
    addSubject(mockSubject);
    expect(getSubjects()).toHaveLength(1);
  });
});

describe("updateSubject", () => {
  it("updates an existing subject", () => {
    addSubject(mockSubject);
    updateSubject({ ...mockSubject, name: "Mother" });
    expect(getSubjects()[0].name).toBe("Mother");
  });
});

describe("deleteSubject", () => {
  it("removes a subject by id", () => {
    addSubject(mockSubject);
    deleteSubject("test-1");
    expect(getSubjects()).toHaveLength(0);
  });
});

describe("URL encoding/decoding", () => {
  it("round-trips a subject through base64", () => {
    const encoded = encodeSubjectForUrl(mockSubject);
    const decoded = decodeSubjectFromUrl(encoded);
    expect(decoded).toEqual(mockSubject);
  });

  it("returns null for invalid data", () => {
    expect(decodeSubjectFromUrl("invalid!!!")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- tests/lib/storage.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement storage**

Create `src/lib/storage.ts`:

```typescript
import { Subject } from "./types";
import { STORAGE_KEY } from "./constants";

export function getSubjects(): Subject[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubjects(subjects: Subject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export function addSubject(subject: Subject): void {
  const subjects = getSubjects();
  subjects.push(subject);
  saveSubjects(subjects);
}

export function updateSubject(updated: Subject): void {
  const subjects = getSubjects().map((s) => (s.id === updated.id ? updated : s));
  saveSubjects(subjects);
}

export function deleteSubject(id: string): void {
  const subjects = getSubjects().filter((s) => s.id !== id);
  saveSubjects(subjects);
}

export function encodeSubjectForUrl(subject: Subject): string {
  return btoa(encodeURIComponent(JSON.stringify(subject)));
}

export function decodeSubjectFromUrl(encoded: string): Subject | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test -- tests/lib/storage.test.ts
```

Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.ts tests/lib/storage.test.ts
git commit -m "feat: add localStorage CRUD and URL encoding with tests"
```

---

## Chunk 2: Landing Page & Layout

### Task 5: Root Layout with Fonts

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Lora, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Life Calendar — How many Saturdays do you have left?",
  description: "Visualize the time remaining with the people and companions you love.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <html lang="en" className={`${lora.variable} ${nunito.variable}`}>
      <body className="bg-bg font-sans text-lc-text min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update globals.css**

Keep only Tailwind directives in `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@keyframes pulse-today {
  0%, 100% { box-shadow: 0 0 4px rgba(255, 107, 107, 0.4); }
  50% { box-shadow: 0 0 8px rgba(255, 107, 107, 0.7); }
}

.animate-pulse-today {
  animation: pulse-today 2s ease-in-out infinite;
}
```

- [ ] **Step 3: Verify dev server renders**

```bash
npm run dev
# Visit localhost:3000, check fonts load and bg color is cream
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: set up root layout with Lora/Nunito fonts and global styles"
```

---

### Task 6: Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build landing page**

Replace `src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-10 text-center">
      <div className="text-6xl mb-6">⏳</div>
      <h1 className="font-serif text-3xl sm:text-[42px] font-bold leading-tight mb-4">
        How many Saturdays<br />do you have left?
      </h1>
      <p className="text-lg text-lc-text-light max-w-[480px] leading-relaxed mb-10">
        Visualize the time remaining with the people and companions you love.
        Every square is a day, a week, a moment — make each one count.
      </p>
      <Link
        href="/dashboard"
        className="px-10 py-4 bg-coral text-white rounded-button text-lg font-bold shadow-[0_4px_16px_rgba(244,132,95,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(244,132,95,0.4)] transition-all"
      >
        Start Counting
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
# Visit localhost:3000 — should see landing page with headline, text, CTA button
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page"
```

---

## Chunk 3: Dashboard Page & Components

### Task 7: UnitToggle & MiniGrid Components

**Files:**
- Create: `src/components/UnitToggle.tsx`
- Create: `src/components/MiniGrid.tsx`

- [ ] **Step 1: Create UnitToggle**

Create `src/components/UnitToggle.tsx`:

```tsx
"use client";

import { GridUnit } from "@/lib/types";

const UNITS: { value: GridUnit; label: string }[] = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
];

export default function UnitToggle({
  value,
  onChange,
}: {
  value: GridUnit;
  onChange: (unit: GridUnit) => void;
}) {
  return (
    <div className="flex gap-1 bg-card-bg rounded-xl p-1 shadow-card w-fit">
      {UNITS.map((unit) => (
        <button
          key={unit.value}
          onClick={() => onChange(unit.value)}
          className={`px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${
            value === unit.value
              ? "bg-coral text-white"
              : "text-lc-text-light hover:text-lc-text"
          }`}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create MiniGrid**

Create `src/components/MiniGrid.tsx`:

```tsx
"use client";

import { Subject } from "@/lib/types";
import { getTimeRatio } from "@/lib/calculations";

export default function MiniGrid({ subject }: { subject: Subject }) {
  const ratio = getTimeRatio(subject);
  const total = 80;
  const filled = Math.floor(total * ratio);

  return (
    <div className="flex flex-wrap gap-[2px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-[1.5px] ${
            i < filled
              ? "bg-filled-alt"
              : i === filled
              ? "bg-today"
              : "bg-empty"
          }`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/UnitToggle.tsx src/components/MiniGrid.tsx
git commit -m "feat: add UnitToggle and MiniGrid components"
```

---

### Task 8: SubjectCard Component

**Files:**
- Create: `src/components/SubjectCard.tsx`

- [ ] **Step 1: Create SubjectCard**

Create `src/components/SubjectCard.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Subject } from "@/lib/types";
import { getRemainingWeeks, getRemainingYears } from "@/lib/calculations";
import { AVATAR_COLOR_MAP } from "@/lib/constants";
import MiniGrid from "./MiniGrid";

export default function SubjectCard({ subject }: { subject: Subject }) {
  const weeks = getRemainingWeeks(subject);
  const years = getRemainingYears(subject);
  const colorCfg = AVATAR_COLOR_MAP[subject.avatarColor];

  return (
    <Link href={`/view/${subject.id}`}>
      <div className="bg-card-bg rounded-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer">
        <div className="flex items-center gap-3 mb-3.5">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[22px] ${colorCfg.bg}`}>
            {subject.emoji}
          </div>
          <div>
            <div className="font-serif text-lg font-semibold">{subject.name}</div>
            <div className="text-[13px] text-lc-text-light">
              Born {new Date(subject.birthDate).getFullYear()} · Expected {subject.expectedLifespan} yrs
            </div>
          </div>
        </div>
        <div className="flex gap-4 mb-3.5">
          <div>
            <div className="text-2xl font-bold text-coral">{weeks.toLocaleString()}</div>
            <div className="text-xs text-lc-text-light">weeks left</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-coral">{years}</div>
            <div className="text-xs text-lc-text-light">years left</div>
          </div>
        </div>
        <MiniGrid subject={subject} />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SubjectCard.tsx
git commit -m "feat: add SubjectCard component"
```

---

### Task 9: SubjectFormModal Component

**Files:**
- Create: `src/components/SubjectFormModal.tsx`

- [ ] **Step 1: Create the modal**

Create `src/components/SubjectFormModal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Subject, AvatarColor } from "@/lib/types";
import { AVATAR_COLORS, DEFAULT_EMOJIS } from "@/lib/constants";

interface Props {
  onSave: (subject: Subject) => void;
  onClose: () => void;
  subject?: Subject; // if editing
}

export default function SubjectFormModal({ onSave, onClose, subject }: Props) {
  const [name, setName] = useState(subject?.name ?? "");
  const [emoji, setEmoji] = useState(subject?.emoji ?? "👩");
  const [avatarColor, setAvatarColor] = useState<AvatarColor>(subject?.avatarColor ?? "coral");
  const [birthDate, setBirthDate] = useState(subject?.birthDate ?? "");
  const [expectedLifespan, setExpectedLifespan] = useState(subject?.expectedLifespan?.toString() ?? "");
  const [firstMetDate, setFirstMetDate] = useState(subject?.firstMetDate ?? "");
  const [freqType, setFreqType] = useState(subject?.meetingFrequency?.type ?? "");
  const [freqCount, setFreqCount] = useState(subject?.meetingFrequency?.count?.toString() ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saved: Subject = {
      id: subject?.id ?? uuidv4(),
      name,
      emoji,
      avatarColor,
      birthDate,
      expectedLifespan: Number(expectedLifespan),
      firstMetDate: firstMetDate || undefined,
      meetingFrequency: freqType && freqCount
        ? { type: freqType as "weekly" | "monthly" | "yearly", count: Number(freqCount) }
        : undefined,
      createdAt: subject?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    onSave(saved);
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card-bg rounded-card p-6 w-full max-w-md shadow-card-hover" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif text-xl font-semibold mb-4">
          {subject ? "Edit" : "Add someone"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">Emoji</label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                    emoji === e ? "bg-coral-light scale-110" : "bg-empty hover:bg-coral-light/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar color */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">Color</label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    c === "coral" ? "bg-coral" : c === "lavender" ? "bg-lavender" : "bg-mint"
                  } ${avatarColor === c ? "ring-2 ring-offset-2 ring-text scale-110" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>

          {/* Birth date */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">Birth date</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>

          {/* Expected lifespan */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">Expected lifespan (years)</label>
            <input
              type="number"
              value={expectedLifespan}
              onChange={(e) => setExpectedLifespan(e.target.value)}
              required
              min="1"
              max="150"
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>

          {/* First met date (optional) */}
          <div>
            <label className="text-sm text-lc-text-light block mb-1">First met (optional)</label>
            <input
              type="date"
              value={firstMetDate}
              onChange={(e) => setFirstMetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
            />
          </div>

          {/* Meeting frequency (optional) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-lc-text-light block mb-1">How often you meet</label>
              <select
                value={freqType}
                onChange={(e) => setFreqType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral"
              >
                <option value="">Not set</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-lc-text-light block mb-1">Times per period</label>
              <input
                type="number"
                value={freqCount}
                onChange={(e) => setFreqCount(e.target.value)}
                min="1"
                disabled={!freqType}
                className="w-full px-3 py-2 rounded-xl border border-light-gray bg-bg focus:outline-none focus:border-coral disabled:opacity-40"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-button text-lc-text-light font-semibold border border-light-gray hover:bg-empty transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-button bg-coral text-white font-semibold hover:opacity-90 transition-all"
            >
              {subject ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SubjectFormModal.tsx
git commit -m "feat: add SubjectFormModal for add/edit subjects"
```

---

### Task 10: DailyReminder Component

**Files:**
- Create: `src/components/DailyReminder.tsx`

- [ ] **Step 1: Create DailyReminder**

Create `src/components/DailyReminder.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { Subject } from "@/lib/types";
import { getRemainingWeeks } from "@/lib/calculations";

export default function DailyReminder({ subjects }: { subjects: Subject[] }) {
  const reminder = useMemo(() => {
    if (subjects.length === 0) return null;
    // Pick a subject based on day-of-year for daily rotation
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const subject = subjects[dayOfYear % subjects.length];
    const weeks = getRemainingWeeks(subject);
    return { name: subject.name, weeks };
  }, [subjects]);

  if (!reminder) return null;

  return (
    <div className="bg-gradient-to-br from-coral-light to-lavender-light rounded-card px-6 py-5 mb-7 text-center">
      <div className="text-[13px] text-lc-text-light uppercase tracking-wider mb-1">
        Today&apos;s Reminder
      </div>
      <div className="font-serif text-[22px] font-semibold">
        You have <span className="text-coral text-[28px] font-bold">{reminder.weeks.toLocaleString()}</span> Saturdays left with {reminder.name}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DailyReminder.tsx
git commit -m "feat: add DailyReminder component"
```

---

### Task 11: Dashboard Page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

Create `src/app/dashboard/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { Subject } from "@/lib/types";
import { getSubjects, addSubject, updateSubject, deleteSubject } from "@/lib/storage";
import SubjectCard from "@/components/SubjectCard";
import SubjectFormModal from "@/components/SubjectFormModal";
import DailyReminder from "@/components/DailyReminder";

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSubjects(getSubjects());
    setLoaded(true);
  }, []);

  function handleSave(subject: Subject) {
    if (editingSubject) {
      updateSubject(subject);
    } else {
      addSubject(subject);
    }
    setSubjects(getSubjects());
    setShowModal(false);
    setEditingSubject(undefined);
  }

  function handleEdit(subject: Subject) {
    setEditingSubject(subject);
    setShowModal(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this?")) {
      deleteSubject(id);
      setSubjects(getSubjects());
    }
  }

  if (!loaded) return null; // Avoid SSR hydration mismatch

  return (
    <main className="max-w-[900px] mx-auto p-6">
      <DailyReminder subjects={subjects} />

      {subjects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💛</div>
          <h2 className="font-serif text-2xl font-semibold mb-2">Start with someone you love</h2>
          <p className="text-lc-text-light mb-6">Add a person or pet to see how much time you have left together.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-coral text-white rounded-button font-bold hover:opacity-90 transition-all"
          >
            Add someone
          </button>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {subjects.map((s) => (
            <div key={s.id} className="relative group">
              <SubjectCard subject={s} />
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button
                  onClick={(e) => { e.preventDefault(); handleEdit(s); }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(s.id); }}
                  className="w-8 h-8 rounded-full bg-card-bg shadow-card text-sm flex items-center justify-center hover:bg-empty"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={() => { setEditingSubject(undefined); setShowModal(true); }}
            className="bg-card-bg rounded-card p-5 shadow-card border-2 border-dashed border-light-gray flex flex-col items-center justify-center min-h-[180px] text-lc-text-light hover:border-coral hover:text-coral transition-all"
          >
            <div className="text-4xl mb-2">+</div>
            <div className="text-sm font-semibold">Add someone</div>
          </button>
        </div>
      )}

      {showModal && (
        <SubjectFormModal
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingSubject(undefined); }}
          subject={editingSubject}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
# Visit localhost:3000/dashboard
# - Should show empty state with "Add someone" button
# - Click add, fill form, save → card appears
# - Hover card → edit/delete buttons
```

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add dashboard page with subject CRUD"
```

---

## Chunk 4: Detail Grid Page & Components

### Task 12: LifeGrid Component

**Files:**
- Create: `src/components/LifeGrid.tsx`

- [ ] **Step 1: Create LifeGrid**

Create `src/components/LifeGrid.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { Subject, GridUnit } from "@/lib/types";
import { getGridData } from "@/lib/calculations";

export default function LifeGrid({ subject, unit }: { subject: Subject; unit: GridUnit }) {
  const { total, filled, todayIndex, columns } = useMemo(
    () => getGridData(subject, unit),
    [subject, unit]
  );

  return (
    <div className="bg-card-bg rounded-card p-6 shadow-card">
      <div className="text-[13px] text-lc-text-light mb-3">
        Each square = 1 {unit.slice(0, -1)} ·{" "}
        <span className="text-coral">■</span> lived{" "}
        <span className="text-today">■</span> today{" "}
        <span className="text-empty">■</span> remaining
      </div>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          contain: "strict",
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          let cls = "bg-empty";
          if (i < filled) {
            cls = i % 2 === 0 ? "bg-coral" : "bg-filled-alt";
          } else if (i === todayIndex) {
            cls = "bg-today animate-pulse-today";
          }
          return (
            <div
              key={i}
              className={`aspect-square rounded-cell ${cls} ${
                unit === "days" ? "w-[3px] sm:w-[5px]" : "w-[7px] sm:w-[10px]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LifeGrid.tsx
git commit -m "feat: add LifeGrid component with day/week/month rendering"
```

---

### Task 13: SeasonCounter, TimeRatioBar, ShareButton

**Files:**
- Create: `src/components/SeasonCounter.tsx`
- Create: `src/components/TimeRatioBar.tsx`
- Create: `src/components/ShareButton.tsx`

- [ ] **Step 1: Create SeasonCounter**

Create `src/components/SeasonCounter.tsx`:

```tsx
interface Props {
  seasons: { spring: number; summer: number; autumn: number; winter: number };
}

const SEASON_CONFIG = [
  { key: "spring", icon: "🌸", label: "Springs left" },
  { key: "summer", icon: "☀️", label: "Summers left" },
  { key: "autumn", icon: "🍁", label: "Autumns left" },
  { key: "winter", icon: "❄️", label: "Winters left" },
] as const;

export default function SeasonCounter({ seasons }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SEASON_CONFIG.map(({ key, icon, label }) => (
        <div key={key} className="bg-card-bg rounded-card p-4 shadow-card text-center">
          <div className="text-[28px] mb-1">{icon}</div>
          <div className="font-serif text-2xl font-bold">{seasons[key]}</div>
          <div className="text-[11px] text-lc-text-light">{label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create TimeRatioBar**

Create `src/components/TimeRatioBar.tsx`:

```tsx
interface Props {
  ratio: number; // 0-1
}

export default function TimeRatioBar({ ratio }: Props) {
  const percent = Math.round(ratio * 100);

  return (
    <div className="bg-card-bg rounded-card p-5 shadow-card">
      <div className="font-serif text-base font-semibold mb-3">
        Time Spent Together vs. Remaining
      </div>
      <div className="h-4 bg-empty rounded-lg overflow-hidden mb-2">
        <div
          className="h-full rounded-lg bg-gradient-to-r from-coral to-filled-alt transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-lc-text-light">
        <span>{percent}% of time together already passed</span>
        <span>{100 - percent}% remaining</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ShareButton**

Create `src/components/ShareButton.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Subject } from "@/lib/types";
import { encodeSubjectForUrl } from "@/lib/storage";

export default function ShareButton({ subject }: { subject: Subject }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const encoded = encodeSubjectForUrl(subject);
    const url = `${window.location.origin}/view?data=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="px-5 py-2 rounded-[20px] bg-lavender-light text-lavender text-[13px] font-semibold hover:opacity-80 transition-all"
    >
      {copied ? "✓ Copied!" : "🔗 Share"}
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SeasonCounter.tsx src/components/TimeRatioBar.tsx src/components/ShareButton.tsx
git commit -m "feat: add SeasonCounter, TimeRatioBar, ShareButton components"
```

---

### Task 14: Detail Grid Page & Shared Link Route

**Files:**
- Create: `src/app/view/[id]/page.tsx`
- Create: `src/app/view/page.tsx`

- [ ] **Step 1: Create shared link handler**

Create `src/app/view/page.tsx` — handles `/view?data=...` URLs:

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { decodeSubjectFromUrl } from "@/lib/storage";

export default function SharedViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) { router.push("/dashboard"); return; }
    const decoded = decodeSubjectFromUrl(data);
    if (!decoded) { router.push("/dashboard"); return; }
    // Re-route to the [id] page with data in query
    router.replace(`/view/${decoded.id}?data=${data}`);
  }, [searchParams, router]);

  return null;
}
```

- [ ] **Step 2: Create detail page**

Create `src/app/view/[id]/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Subject, GridUnit } from "@/lib/types";
import { getSubjects, decodeSubjectFromUrl } from "@/lib/storage";
import {
  getRemainingDays,
  getRemainingMeetups,
  getRemainingSeasons,
  getRemainingYears,
  getTimeRatio,
} from "@/lib/calculations";
import LifeGrid from "@/components/LifeGrid";
import UnitToggle from "@/components/UnitToggle";
import SeasonCounter from "@/components/SeasonCounter";
import TimeRatioBar from "@/components/TimeRatioBar";
import ShareButton from "@/components/ShareButton";

export default function DetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [unit, setUnit] = useState<GridUnit>("weeks");

  useEffect(() => {
    // Priority: URL data param > localStorage by id
    const data = searchParams.get("data");
    if (data) {
      const decoded = decodeSubjectFromUrl(data);
      if (decoded) { setSubject(decoded); return; }
    }
    const id = params.id as string;
    if (id) {
      const found = getSubjects().find((s) => s.id === id);
      if (found) { setSubject(found); return; }
    }
    // Not found — redirect to dashboard
    router.push("/dashboard");
  }, [params.id, searchParams, router]);

  if (!subject) return null;

  const days = getRemainingDays(subject);
  const meetups = getRemainingMeetups(subject);
  const seasons = getRemainingSeasons(subject);
  const birthdays = getRemainingYears(subject);
  const ratio = getTimeRatio(subject);

  return (
    <main className="max-w-[900px] mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-10 h-10 rounded-full bg-card-bg shadow-card flex items-center justify-center text-xl hover:bg-empty transition-all"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="font-serif text-[28px] font-bold">{subject.name}</div>
          <div className="text-sm text-lc-text-light">
            Born {new Date(subject.birthDate).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric"
            })} · Expected lifespan: {subject.expectedLifespan} years
          </div>
        </div>
        <ShareButton subject={subject} />
      </div>

      {/* Exceeded lifespan warning */}
      {days === 0 && (
        <div className="bg-coral-light text-coral rounded-card px-6 py-4 mb-5 text-center font-serif font-semibold">
          Exceeded expected lifespan — every day is a gift
        </div>
      )}

      {/* Unit Toggle */}
      <div className="mb-5">
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      {/* Life Grid */}
      <div className="mb-5">
        <LifeGrid subject={subject} unit={unit} />
      </div>

      {/* Time Ratio */}
      <div className="mb-5">
        <TimeRatioBar ratio={ratio} />
      </div>

      {/* Season Counter */}
      <div className="mb-5">
        <SeasonCounter seasons={seasons} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-bg rounded-card p-5 shadow-card">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-serif text-[28px] font-bold text-coral">{days.toLocaleString()}</div>
          <div className="text-[13px] text-lc-text-light mt-1">Days remaining</div>
        </div>
        {meetups !== null && (
          <div className="bg-card-bg rounded-card p-5 shadow-card">
            <div className="text-2xl mb-2">🤝</div>
            <div className="font-serif text-[28px] font-bold text-coral">{meetups.toLocaleString()}</div>
            <div className="text-[13px] text-lc-text-light mt-1">Meetups remaining</div>
          </div>
        )}
        <div className="bg-card-bg rounded-card p-5 shadow-card">
          <div className="text-2xl mb-2">🎂</div>
          <div className="font-serif text-[28px] font-bold text-coral">{birthdays}</div>
          <div className="text-[13px] text-lc-text-light mt-1">Birthdays left</div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify full flow in browser**

```bash
# 1. Visit localhost:3000 — landing page
# 2. Click "Start Counting" → dashboard
# 3. Add a subject → card appears
# 4. Click card → detail page with grid, stats, seasons, ratio bar
# 5. Toggle between days/weeks/months
# 6. Click Share → URL copied to clipboard
```

- [ ] **Step 3: Commit**

```bash
git add src/app/view/
git commit -m "feat: add detail grid page with all stat components"
```

---

## Chunk 5: i18n & Polish

### Task 15: Set Up next-intl

**Files:**
- Create: `src/i18n/messages/en.json`
- Create: `src/i18n/messages/ko.json`
- Create: `src/i18n/request.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create English messages**

Create `src/i18n/messages/en.json`:

```json
{
  "landing": {
    "title": "How many Saturdays do you have left?",
    "description": "Visualize the time remaining with the people and companions you love. Every square is a day, a week, a moment — make each one count.",
    "cta": "Start Counting"
  },
  "dashboard": {
    "reminder_label": "Today's Reminder",
    "reminder_message": "You have {weeks} Saturdays left with {name}",
    "empty_title": "Start with someone you love",
    "empty_description": "Add a person or pet to see how much time you have left together.",
    "add": "Add someone"
  },
  "form": {
    "add_title": "Add someone",
    "edit_title": "Edit",
    "emoji": "Emoji",
    "color": "Color",
    "name": "Name",
    "birth_date": "Birth date",
    "lifespan": "Expected lifespan (years)",
    "first_met": "First met (optional)",
    "frequency": "How often you meet",
    "frequency_count": "Times per period",
    "not_set": "Not set",
    "weekly": "Weekly",
    "monthly": "Monthly",
    "yearly": "Yearly",
    "cancel": "Cancel",
    "save": "Save",
    "add_btn": "Add"
  },
  "detail": {
    "born": "Born {date} · Expected lifespan: {years} years",
    "grid_label": "Each square = 1 {unit}",
    "lived": "lived",
    "today": "today",
    "remaining": "remaining",
    "ratio_title": "Time Spent Together vs. Remaining",
    "ratio_passed": "{percent}% of time together already passed",
    "ratio_remaining": "{percent}% remaining",
    "days_remaining": "Days remaining",
    "meetups_remaining": "Meetups remaining",
    "birthdays_left": "Birthdays left",
    "springs": "Springs left",
    "summers": "Summers left",
    "autumns": "Autumns left",
    "winters": "Winters left",
    "share": "Share",
    "copied": "Copied!",
    "exceeded": "Exceeded expected lifespan"
  },
  "units": {
    "days": "Days",
    "weeks": "Weeks",
    "months": "Months",
    "day": "day",
    "week": "week",
    "month": "month"
  }
}
```

- [ ] **Step 2: Create Korean messages**

Create `src/i18n/messages/ko.json`:

```json
{
  "landing": {
    "title": "남은 토요일이 몇 번일까요?",
    "description": "사랑하는 사람, 반려동물과 함께할 수 있는 남은 시간을 시각화하세요. 하루하루, 한 주 한 주를 소중히.",
    "cta": "시작하기"
  },
  "dashboard": {
    "reminder_label": "오늘의 알림",
    "reminder_message": "{name}과(와) 남은 토요일: {weeks}번",
    "empty_title": "사랑하는 사람을 추가해보세요",
    "empty_description": "함께할 수 있는 남은 시간을 확인해보세요.",
    "add": "추가하기"
  },
  "form": {
    "add_title": "추가하기",
    "edit_title": "수정",
    "emoji": "이모지",
    "color": "색상",
    "name": "이름",
    "birth_date": "생년월일",
    "lifespan": "예상 수명 (년)",
    "first_met": "처음 만난 날 (선택)",
    "frequency": "만남 빈도",
    "frequency_count": "횟수",
    "not_set": "설정 안 함",
    "weekly": "매주",
    "monthly": "매월",
    "yearly": "매년",
    "cancel": "취소",
    "save": "저장",
    "add_btn": "추가"
  },
  "detail": {
    "born": "{date} 출생 · 예상 수명: {years}세",
    "grid_label": "한 칸 = 1{unit}",
    "lived": "지남",
    "today": "오늘",
    "remaining": "남음",
    "ratio_title": "함께한 시간 vs 남은 시간",
    "ratio_passed": "함께한 시간의 {percent}%가 지났습니다",
    "ratio_remaining": "{percent}% 남음",
    "days_remaining": "남은 일수",
    "meetups_remaining": "남은 만남",
    "birthdays_left": "남은 생일",
    "springs": "남은 봄",
    "summers": "남은 여름",
    "autumns": "남은 가을",
    "winters": "남은 겨울",
    "share": "공유",
    "copied": "복사됨!",
    "exceeded": "예상 수명을 초과했습니다"
  },
  "units": {
    "days": "일",
    "weeks": "주",
    "months": "월",
    "day": "일",
    "week": "주",
    "month": "월"
  }
}
```

- [ ] **Step 3: Create i18n config**

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en"; // v1: hardcoded, swap to detection later
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Update next.config.ts**

Add next-intl plugin to `next.config.ts`:

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Verify dev server still works**

```bash
npm run dev
# Should start without errors
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ next.config.ts
git commit -m "feat: set up next-intl with English and Korean messages"
```

Note: Wiring i18n into all components (replacing hardcoded strings with `useTranslations()`) is a follow-up task. The messages and config are now in place.

---

### Task 16: Wire i18n Into Components

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: all components that have hardcoded strings

- [ ] **Step 1: Update landing page to use translations**

In `src/app/page.tsx`, add `useTranslations` from `next-intl` and replace all hardcoded strings with translation keys (e.g., `t("landing.title")`, `t("landing.description")`, `t("landing.cta")`).

- [ ] **Step 2: Update all components similarly**

For each component with hardcoded English text, import `useTranslations` and use message keys. Components to update: `DailyReminder`, `SubjectFormModal`, `UnitToggle`, `SeasonCounter`, `TimeRatioBar`, `ShareButton`, `LifeGrid`, detail page.

- [ ] **Step 3: Verify in browser**

```bash
# All pages should render with the same English text (from en.json now)
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire i18n translations into all components"
```

---

### Task 17: Final Polish & Deploy

**Files:**
- Modify: various styling tweaks

- [ ] **Step 1: Run full test suite**

```bash
npm run test
npm run build
```

Both should pass.

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --yes
npx vercel --prod
```

- [ ] **Step 3: Verify production deployment**

Visit the Vercel URL. Test full flow: landing → dashboard → add subject → view detail → share URL.

- [ ] **Step 4: Push all changes**

```bash
git push origin main
```

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final polish and deploy"
git push origin main
```
