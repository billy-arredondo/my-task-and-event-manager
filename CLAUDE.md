# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check (tsc -b) then build
npm run preview   # Preview production build
```

No test or lint scripts are configured. TypeScript strict mode is the primary quality gate — `tsc -b` runs as part of `npm run build`.

## Architecture

**FocusFlow** is a React 18 + TypeScript PWA for deadline-focused task management. It uses Vite 8, Supabase (PostgreSQL + auth), React Router 7, TanStack React Query v5, Zustand, and Tailwind CSS v4.

### State layers

| Layer | Tool | What it holds |
|---|---|---|
| Auth | Zustand (`useAuthStore`) | Supabase session, user, initialized flag |
| Theme | Zustand + persist | Dark/light preference (localStorage) |
| Server state | React Query | Tasks — fetched from Supabase, cached 30s |

### Data flow

1. `AuthProvider` (App.tsx) bootstraps the Supabase session on mount and hydrates `useAuthStore`.
2. `useTasks()` fetches from Supabase and returns tasks pre-grouped by deadline via `groupTasks()`.
3. `useTaskActions()` exposes mutations (create/update/delete/toggle); each `onSuccess` calls `queryClient.invalidateQueries` to trigger a refetch.
4. Completed recurring tasks trigger a new task insert (next deadline computed from `repeat_frequency` / `repeat_interval`).

### Routing

- React Router with lazy-loaded pages (code splitting).
- `/auth` is public; `/` (TaskListPage) is protected by `AuthGuard`.
- `AppShell` uses Outlet context to pass `openEditTaskModal` down to child routes.

### Task grouping & deadlines

`groupTasks()` in `src/lib/utils.ts` buckets tasks into: `overdue`, `today`, `tomorrow`, `thisWeek`, `later`, `noDeadline`, `completed`. `useCountdown()` ticks every 60 seconds and formats remaining time (seconds → hours → days → weeks).

### Repeat logic

Frequency options: `daily`, `weekday`, `weekly`, `monthly`, `yearly`, each with a configurable `repeat_interval`. Weekday skips Saturday/Sunday when computing the next deadline.

### UI patterns

- `src/components/ui/` — Radix-based primitives (Button, Card, Switch, Checkbox, Label, Input) styled with CVA variants; use `cn()` for merging Tailwind classes.
- `AppShell` owns the task create/edit modal; mobile uses a bottom nav bar, desktop uses a sidebar.
- Tailwind v4 via `@import` in `src/index.css` — no `tailwind.config.js`. Custom MD3 color palette (primary `#3525cd`) and Manrope/Inter fonts defined in `@theme`.

### Path alias

`@/*` resolves to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Supabase

Direct Supabase client calls (no ORM). The `tasks` table columns: `id`, `user_id`, `description`, `deadline`, `completed`, `priority`, `category`, `repeat_frequency`, `repeat_interval`, `created_at`.

Credentials come from `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Feature flags (`VITE_FEATURE_DASHBOARD`, `VITE_FEATURE_TASKS`, etc.) gate UI sections.

## PWA

VitePWA plugin with Workbox (auto-update strategy). Manifest and service-worker config live in `vite.config.ts`.
