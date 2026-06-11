---
name: BG App Architecture
description: Key decisions for the BG Appointment Setter Reference app — data locations, local agent, command palette
---

# BG Reference App Architecture

## Stack
React 19 + Vite + TypeScript, Tailwind CSS v4, wouter routing, Radix UI, lucide-react. pnpm monorepo at `artifacts/bg-cheatsheet`.

## Key Data Files
- `src/data/providers.ts` — All 78 real BG physicians + 7 extenders scraped from borlandgroover.com/physicians/
- `src/lib/localAgent.ts` — KB entries with keyword scoring; `getAnswer(question, history)` returns a string; no API key needed

## Local Agent Design
**Why:** Replaced Groq API call (required GROQ_API_KEY) with local keyword-scoring engine.
**How to apply:** `getAnswer()` in localAgent.ts tokenizes the question, scores each KB entry, returns top match text. Component simulates streaming character-by-character with `setTimeout`.

## Command Palette (⌘K)
- Opened via ⌘K/Ctrl+K global listener in `Layout.tsx`
- Sidebar shows a "Quick search… ⌘K" button; passes `onOpenSearch` prop to Layout
- `CommandPalette.tsx` indexes 100+ static entries + all providers dynamically from `providers.ts`
- Navigates via wouter `useLocation`

## Providers Data
- Scraped from borlandgroover.com/physicians/ (186KB page)
- Hospital locations (Baptist Downtown, etc.) have `acceptsNew: false`; Volusia providers have network warnings
- Extenders (NP/PA) have `extenderOf` field linking to supervising physician

## Assistant Page
- No longer calls `/api/assistant` — fully local
- Streaming simulated at 12ms/chunk, 6 chars per tick
- Suggested questions hard-coded as grid of chips on empty state
