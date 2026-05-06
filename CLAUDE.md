# CLAUDE.md

## Personal Working Preferences

- Be concise when explaining changes.
- Prefer small, incremental changes over large refactors.
- Ask before adding dependencies.
- Explain risks or assumptions clearly.
- When proposing UI changes, prioritize simplicity and mobile UX.
- When modifying code, follow the existing project structure.

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

---

## Development Rules

- Do not add new dependencies without asking first.
- Prefer modifying existing components, hooks, or utilities before creating new abstractions.
- Keep components small and focused on a single responsibility.
- Keep business logic out of purely visual/presentational components.
- Keep Supabase calls out of presentational components — use hooks or query files.
- Use React Query for all server state.
- Use Zustand only for global client-side state (auth, theme).
- Do not duplicate server state in Zustand.
- Run `npm run build` after significant changes to verify TypeScript and the build pass.

## Code Style

- Use TypeScript compatible with strict mode (`tsc -b` is the quality gate).
- Prefer explicit types in public functions, hooks, and shared utilities.
- Use functional components only.
- Use `@/` path alias imports wherever possible.
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind class merging.
- Follow existing conventions before introducing new patterns.
- Avoid large components with mixed responsibilities.

## React Guidelines

- Prefer custom hooks for reusable logic.
- Keep pages as compositions of components — not the primary place for business logic.
- Use React Query mutations for create / update / delete operations.
- Invalidate relevant queries after successful mutations (`queryClient.invalidateQueries`).
- Avoid manually syncing React Query data into Zustand unless there is a clear reason.

## Supabase Safety

- Never commit `.env.local`.
- Never commit real credentials of any kind.
- Never expose service-role keys in frontend code.
- Assume the frontend only has access to the anon key.
- Respect Row Level Security — do not write queries that bypass RLS.

## UX Guidelines

- This app is deadline-focused: deadlines, urgency, and recurrence must be visually clear.
- Prioritize mobile UX — AppShell uses a bottom nav bar on mobile.
- Keep the UI simple, calm, and readable.
- Avoid dense dashboards that don't improve task prioritization.
- Always implement clear empty, loading, and error states.

## Do Not

- Do not replace Tailwind v4's `@import` setup with `tailwind.config.js` unless explicitly requested.
- Do not introduce an ORM or a backend layer unless explicitly requested.
- Do not move server state to Zustand.
- Do not change recurrence / repeat logic without first reviewing the existing behavior in `src/lib/utils.ts` and `useTaskActions`.
- Do not perform large refactors unrelated to the current task.

## Before Making Changes

- [ ] Review the existing file and component structure.
- [ ] Reuse existing patterns (hooks, utilities, UI primitives) before creating new ones.
- [ ] Make the minimum reasonable change to satisfy the requirement.
- [ ] Maintain visual consistency with the rest of the app.
- [ ] Run `npm run build` if the change is significant.
- [ ] Call out any assumptions or risks before or after making changes.

## Preferred Response Style

When explaining changes:

- Be concise — one short paragraph or a brief bullet list.
- Name the files modified and why each was changed.
- State the reason for the change.
- Indicate whether `npm run build` was run and whether it passed.
- Mention any risks, edge cases, or assumptions made.
