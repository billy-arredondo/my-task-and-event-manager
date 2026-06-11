# FocusFlow — AGENTS.md

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build — quality gate
npm run preview   # Preview production build
```

No test/lint/formatter scripts exist. `tsc -b` (strict mode) is the only quality check. `noUnusedLocals` and `noUnusedParameters` are enforced.

## Architecture

**FocusFlow** — React 18 + TypeScript PWA for deadline-focused task management (Spanish UI).

| Layer        | Tool                                      | Purpose                                                         |
| ------------ | ----------------------------------------- | --------------------------------------------------------------- |
| Auth         | Zustand `useAuthStore`                    | Supabase session, user, initialized flag                        |
| Theme        | Zustand + persist(localStorage)           | Dark/light preference                                           |
| Server state | TanStack React Query (staleTime 30s)      | Tasks fetched from Supabase                                     |
| Routing      | React Router v7                           | Lazy-loaded pages, `/auth` public, `/` protected by `AuthGuard` |
| Styling      | Tailwind CSS v4 (`@import "tailwindcss"`) | No `tailwind.config.js`. Dark mode via `.dark` class            |
| PWA          | vite-plugin-pwa + Workbox                 | Auto-update strategy, manifest in `vite.config.ts`              |

Entrypoint: `src/main.tsx` → `src/App.tsx`. Path alias `@/*` → `./src/*`.

## State rules

- **Server state → React Query only.** Never duplicate in Zustand.
- **Zustand only for:** auth and theme.
- After any mutation, call `queryClient.invalidateQueries({ queryKey: taskKeys.lists() })`.

## Supabase

- Anon key only (no service-role key in frontend).
- Credentials from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local`.
- Feature flags via `VITE_FEATURE_DASHBOARD`, `VITE_FEATURE_TASKS`, etc.
- Direct client calls — no ORM.
- RLS on `tasks` table scopes rows to `auth.uid()`.
- Migrations in `supabase/migrations/`.

## Key files

| File                          | What                                                                |
| ----------------------------- | ------------------------------------------------------------------- |
| `src/lib/utils.ts`            | `cn()`, `groupTasks()`, `computeNextDeadline()`                     |
| `src/lib/clock.ts`            | Wall-clock-aligned 1s tick, auto start/stop via subscriber refcount |
| `src/lib/taskKeys.ts`         | React Query key factory: `taskKeys.lists()`                         |
| `src/lib/supabase.ts`         | Supabase client singleton                                           |
| `src/lib/queryClient.ts`      | QueryClient with 30s staleTime                                      |
| `src/hooks/useTasks.ts`       | Fetches + groups tasks (re-groups every 60s via tick)               |
| `src/hooks/useTaskActions.ts` | CRUD + toggle with recurrence auto-recreate                         |
| `src/hooks/useCountdown.ts`   | Per-task countdown via `clock.ts` subscription                      |
| `src/store/authStore.ts`      | Auth Zustand store                                                  |
| `src/store/themeStore.ts`     | Theme Zustand store with persist                                    |
| `src/components/ui/`          | Radix + CVA primitives                                              |
| `src/types/task.ts`           | Task, GroupedTasks, CountdownValue, Priority, RepeatFrequency       |

## Repeat frequency

`daily`, `weekday` (skips Sat/Sun), `weekly`, `monthly`, `yearly` — each with configurable `repeat_interval`. Logic in `computeNextDeadline()` in `utils.ts`.

## Skills

`skills.sh` manages agent skills. `skills-lock.json` is versioned. After cloning: `skills install`. Downloaded content lands in `.agents/` (gitignored).

Installed skills: `frontend-design`, `vercel-react-best-practices`, `web-design-guidelines`.

## Conventions

- `npm run build` before committing non-trivial changes.
- Do not add deps without asking.
- Prefer `@/` path alias imports.
- Use `cn()` for conditional Tailwind class merging.
- Keep Supabase calls out of presentational components — use hooks.
- No `tailwind.config.js` (Tailwind v4 uses `@import` + `@theme` in CSS).
- `legacy-peer-deps=true` in `.npmrc`.
