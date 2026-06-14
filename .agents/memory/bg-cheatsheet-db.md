---
name: BG Cheatsheet DB Setup
description: Database migration and API server startup quirks for the bg-cheatsheet app
---

## Notes Table Migration
The `notes` table must be created by running `drizzle-kit push` from the `lib/db` directory:
```
cd lib/db && pnpm exec drizzle-kit push --config drizzle.config.ts
```
This uses `DATABASE_URL` env var. If the Notes page returns 500 errors, the table likely doesn't exist.

## API Server Groq Init
The Groq API client in `artifacts/api-server/src/routes/assistant.ts` must use a lazy `getGroqClient()` function (not module-level instantiation) so the server starts even when `GROQ_API_KEY` is not set. Module-level init crashes the server on startup if the key is missing.

**Why:** Replit environment may not have GROQ_API_KEY set at dev startup; server should start and return helpful errors per-request rather than failing to boot.
