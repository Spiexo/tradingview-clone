# AGENTS.md — TradingView Clone

> This file is read by Jules (Google AI agent) before every task on this repository.
> Follow every instruction in this file strictly and without exception.

---

## 1. Project Overview

This is a TradingView-inspired trading dashboard clone.
It is a frontend-only application — no backend, no authentication, no database.
All data is either mocked/static or fetched from public APIs (CoinGecko, Yahoo Finance).

---

## 2. Stack & Versions

| Tool | Version |
|---|---|
| React | 18 |
| TypeScript | 5+ (strict mode enabled) |
| Tailwind CSS | 3 |
| Vite | 5 |
| Recharts | latest |
| Supabase JS | 2 |

No other libraries may be installed without explicitly mentioning it in the PR description with a justification.

---

## 3. TypeScript Rules

- **Never use `any`** — always type explicitly
- All shared interfaces and types go in `src/types/index.ts`
- All props must be typed with a dedicated interface (e.g. `CandlestickChartProps`)
- Use `type` for unions/primitives, `interface` for object shapes
- Strict mode is enabled — no implicit returns, no unused variables

---

## 4. Styling Rules

- **Tailwind CSS only** — no `.css` files, no CSS modules, no inline `style={{}}`
- Dark theme by default — background `bg-gray-950`, surfaces `bg-gray-900`, borders `border-gray-800`
- Text hierarchy : primary `text-white`, secondary `text-gray-400`, muted `text-gray-600`
- Accent color for positive values : `text-green-400`
- Accent color for negative values : `text-red-400`
- Accent color for interactive elements : `text-blue-500`

---

## 5. Folder Structure

Respect this structure strictly. Never create files outside of it without justification.
src/
├── components/
│   ├── layout/        # Sidebar, Topbar, MainLayout
│   ├── chart/         # CandlestickChart, ChartToolbar, TimeframeSelector
│   ├── watchlist/     # WatchlistPanel, WatchlistItem
│   └── ui/            # Button, Badge, Spinner (reusable primitives)
├── hooks/             # Custom React hooks (useOHLCV, useWatchlist, etc.)
├── types/             # index.ts — all shared TypeScript interfaces
├── data/              # mockOHLCV.ts, mockWatchlist.ts — static mock data
└── App.tsx

---

## 6. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `CandlestickChart.tsx` |
| Hooks | camelCase + `use` prefix | `useOHLCV.ts` |
| Types / Interfaces | PascalCase | `OHLCVData`, `Asset` |
| Constants / mock data | camelCase | `mockOHLCV.ts` |
| Tailwind class order | layout → spacing → color → typography | — |

---

## 7. Component Rules

- One component per file
- Every component must have its props interface defined at the top of the file
- No logic inside JSX — extract to variables or hooks before returning
- No useEffect for things that can be derived from state/props

---

## 8. Git & PR Rules

- **One PR = one feature or one component** — never bundle unrelated changes
- Commit message format : `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- PR title must follow the same format : `feat: add CandlestickChart component`
- PR description must include :
  - What was done
  - Why (if not obvious)
  - Any new dependency added and why

---

## 9. Absolute Restrictions

- **Never modify `AGENTS.md`**
- **Never modify `vite.config.ts`** unless the task explicitly requires it
- **Never add a backend, server, or database**
- **Never use `any` in TypeScript**
- **Never create CSS files**
- **Never install unlisted dependencies without mentioning it in the PR**

---

## 10. Supabase

The project uses Supabase for authentication and data persistence.
Supabase credentials are stored in environment variables — never hardcode them.

### Environment variables (already configured locally, never commit .env)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous public key

### Supabase client
A single shared client must be used across the app, located at `src/lib/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Database schema détaillé

**profiles**
| colonne | type | description |
|---|---|---|
| id | uuid | lié à auth.users |
| display_name | text | nom affiché |
| avatar_url | text | url avatar |

**watchlist**
| colonne | type | description |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | lié à auth.users |
| symbol | text | ex: BTC, AAPL |
| name | text | ex: Bitcoin, Apple |
| type | text | 'crypto' ou 'stock' |

**drawings**
| colonne | type | description |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | lié à auth.users |
| symbol | text | asset concerné |
| timeframe | text | ex: 1h, 1D |
| data | jsonb | données du dessin |

**alerts**
| colonne | type | description |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | lié à auth.users |
| symbol | text | asset concerné |
| target_price | numeric | prix cible |
| condition | text | 'above' ou 'below' |

### Règles d'accès
- RLS activé sur toutes les tables
- Toujours utiliser `supabase.auth.getUser()` avant toute opération
- Toujours filtrer par `user_id` dans les requêtes

### Auth rules
- All Supabase data operations must check that the user is authenticated first
- Use Row Level Security (RLS) — every table has RLS enabled, users can only access their own rows
- Auth state must be managed via a `useAuth` hook located in `src/hooks/useAuth.ts`

### Folder addition
src/
├── lib/
│   └── supabase.ts     # Supabase client singleton
├── hooks/
│   └── useAuth.ts      # Auth state hook
