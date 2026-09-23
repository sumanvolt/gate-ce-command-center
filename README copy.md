# SUMANVOLT // COMMAND_CENTER_v2.7

GATE Civil Engineering 2027 preparation dashboard for Suman Kumar Mahato — targeting a 70+ score, direct M.Tech admission (IIT Bombay / Kharagpur / Kanpur), and Maharatna PSU recruitment (IOCL, NTPC, ONGC).

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts, installable as a PWA with offline caching via a hand-written service worker. All state is persisted client-side in `localStorage` — nothing leaves the device.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The build was verified with `npm run build` (Next.js 14.2.35, zero type errors).

## App icons

`public/manifest.json` references `/public/icon-192.png` and `/public/icon-512.png`, which are **not included** — drop in your own 192×192 and 512×512 PNGs (maskable, on a `#7a1c00` or `#fffdfa` background) before deploying, or the install prompt will show a blank icon.

## Structure

```
app/
  layout.tsx        Root layout, PWA meta tags, service worker registration
  page.tsx           Fixed single-face shell + 3-tab navigation
  globals.css         Editorial neo-brutalist base styles
components/
  GoalHeader.tsx       Profile, live countdowns, target score, install/sync
  DailyTracker.tsx     DISCIPLINE tab — weekly habit tracker
  SyllabusTracker.tsx  SYLLABUS tab — 11-subject accordion + mastery cycle
  PWMockLogger.tsx     MOCKS tab — score logger, planner, trajectory chart
lib/
  types.ts             Shared TypeScript interfaces
  storage.ts           localStorage helpers + week-rollover logic
  syllabusData.ts       GATE CE syllabus hierarchy, ordered by weightage
public/
  manifest.json, sw.js  PWA manifest and offline service worker
```

## Notes on placeholder dates

`GoalHeader.tsx` hardcodes GATE CE 2027 as **7 Feb 2027** (GATE's usual first-Sunday-of-February slot) and the Semester 5 milestone as **15 Dec 2026** — both are placeholders. Update the two `Date` constants at the top of that file once official dates are announced.

## Deploying

Works out of the box on Vercel (`vercel deploy`) or any Node host that supports Next.js 14. The service worker only activates on HTTPS (or `localhost`), per the browser spec.
