# Project Structure — Trip Planning

**Stack:** React 19 · Vite · TypeScript · TanStack Router v1 · TanStack Query v5 · Axios · Shadcn UI · Zustand · Zod · Tailwind CSS v4

---

## Design Principle

This project follows a **Feature-Sliced Design (FSD)** hybrid approach:

- **`routes/`** — file-based routing owned by TanStack Router (never import into features)
- **`features/`** — vertical slices of domain logic; each feature is self-contained
- **`components/`** — shared UI that has no domain knowledge
- **`lib/`** — low-level infrastructure (http client, env, helpers)
- **`app/`** — application bootstrap (providers, global stores)

**Data flow rule:**  
`routes` → `features/hooks` → `features/api` → `lib/axios` → API

**State rule:**  
- Server state → **TanStack Query** (`useQuery`, `useMutation`)  
- Client/UI state → **Zustand** stores in `app/stores/`

---

## Full Directory Tree

```
src/
│
├── app/                                # App-level bootstrap
│   ├── providers/
│   │   ├── query-client.ts             # QueryClient instance & defaults
│   │   └── router.tsx                  # Router instance & type registration
│   └── stores/
│       ├── auth-store.ts               # Zustand: current user, token
│       └── ui-store.ts                 # Zustand: sidebar, modals, toasts
│
├── routes/                             # TanStack Router file-based routes
│   ├── __root.tsx                      # Root layout (devtools, global providers)
│   ├── index.tsx                       # Landing page (/)
│   │
│   ├── _auth/                          # Layout group — unauthenticated only
│   │   ├── route.tsx                   # Redirect to /dashboard if logged in
│   │   ├── login.tsx                   # /login
│   │   └── register.tsx                # /register
│   │
│   └── _app/                           # Layout group — authenticated only
│       ├── route.tsx                   # Auth guard + app shell (header/sidebar)
│       ├── dashboard.tsx               # /dashboard
│       │
│       ├── trips/
│       │   ├── index.tsx               # /trips — list all trips
│       │   ├── new.tsx                 # /trips/new — create trip form
│       │   └── $tripId/
│       │       ├── index.tsx           # /trips/$tripId — trip detail
│       │       ├── edit.tsx            # /trips/$tripId/edit
│       │       └── itinerary.tsx       # /trips/$tripId/itinerary
│       │
│       └── profile/
│           └── index.tsx               # /profile
│
├── features/                           # Domain feature modules
│   │
│   ├── auth/                           # Authentication & authorization
│   │   ├── api/
│   │   │   └── auth-api.ts             # login(), register(), logout(), refreshToken()
│   │   ├── hooks/
│   │   │   ├── use-login.ts            # useMutation wrapper for login
│   │   │   ├── use-register.ts         # useMutation wrapper for register
│   │   │   └── use-current-user.ts     # useQuery for /me endpoint
│   │   ├── schemas/
│   │   │   └── auth-schema.ts          # Zod: LoginSchema, RegisterSchema
│   │   ├── types/
│   │   │   └── auth.ts                 # User, AuthTokens, LoginPayload
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── index.ts                    # Public barrel export
│   │
│   ├── trips/                          # Trip management (core domain)
│   │   ├── api/
│   │   │   └── trips-api.ts            # getTrips(), getTrip(), createTrip(), updateTrip(), deleteTrip()
│   │   ├── hooks/
│   │   │   ├── use-trips.ts            # useQuery: paginated trip list
│   │   │   ├── use-trip.ts             # useQuery: single trip by id
│   │   │   └── use-trip-mutations.ts   # useMutation: create / update / delete
│   │   ├── schemas/
│   │   │   └── trip-schema.ts          # Zod: TripSchema, CreateTripSchema
│   │   ├── types/
│   │   │   └── trip.ts                 # Trip, TripStatus, CreateTripDto
│   │   ├── components/
│   │   │   ├── trip-card.tsx           # Summary card for list view
│   │   │   ├── trip-list.tsx           # Grid/list of TripCards
│   │   │   ├── trip-form.tsx           # Create & edit form (shared)
│   │   │   └── trip-status-badge.tsx   # Status indicator chip
│   │   └── index.ts
│   │
│   ├── itinerary/                      # Day-by-day itinerary planning
│   │   ├── api/
│   │   │   └── itinerary-api.ts        # getItinerary(), addActivity(), reorderActivities()
│   │   ├── hooks/
│   │   │   ├── use-itinerary.ts        # useQuery: itinerary for a trip
│   │   │   └── use-itinerary-mutations.ts
│   │   ├── schemas/
│   │   │   └── itinerary-schema.ts     # Zod: ActivitySchema, DaySchema
│   │   ├── types/
│   │   │   └── itinerary.ts            # Itinerary, Day, Activity, ActivityType
│   │   ├── components/
│   │   │   ├── itinerary-timeline.tsx  # Full itinerary view
│   │   │   ├── itinerary-day.tsx       # Single day with activities
│   │   │   ├── activity-card.tsx       # Individual activity item
│   │   │   └── add-activity-form.tsx
│   │   └── index.ts
│   │
│   └── destinations/                   # Destination search & discovery
│       ├── api/
│       │   └── destinations-api.ts     # searchDestinations(), getDestination()
│       ├── hooks/
│       │   ├── use-destination-search.ts  # useQuery with debounced search
│       │   └── use-destination.ts
│       ├── types/
│       │   └── destination.ts          # Destination, Coordinates, PlaceType
│       ├── components/
│       │   ├── destination-search.tsx  # Combobox search input
│       │   └── destination-card.tsx
│       └── index.ts
│
├── components/                         # Shared UI — no domain knowledge
│   │
│   ├── ui/                             # Shadcn UI primitives (auto-generated via CLI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx                  # Toast notifications
│   │   ├── table.tsx
│   │   └── tooltip.tsx
│   │
│   ├── layout/                         # App shell components
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── app-footer.tsx
│   │   └── page-container.tsx          # Centered content wrapper with padding
│   │
│   └── common/                         # Reusable cross-feature UI
│       ├── error-boundary.tsx          # React error boundary + fallback UI
│       ├── query-error.tsx             # TanStack Query error display
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx             # Zero-data placeholder
│       ├── confirm-dialog.tsx          # Reusable destructive action modal
│       └── not-found.tsx               # 404 page component
│
├── hooks/                              # Shared React hooks (no domain logic)
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-local-storage.ts
│
├── types/                              # Global TypeScript types
│   ├── api.ts                          # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   └── common.ts                       # ID, Timestamp, SelectOption
│
├── lib/                                # Infrastructure layer
│   ├── axios.ts                        # Axios instance, interceptors, error handling
│   ├── env.ts                          # Zod-validated environment variables
│   └── utils.ts                        # cn(), formatDate(), truncate()
│
├── assets/                             # Static assets (images, icons, fonts)
│
├── App.tsx                             # (legacy entry — defer to routes)
├── App.css
├── index.css                           # Tailwind base + CSS variables
├── main.tsx                            # ReactDOM.createRoot, providers
└── routeTree.gen.ts                    # ⚠ Auto-generated — do not edit
```

---

## Layer Rules & Conventions

### `features/<name>/api/`
- One file per feature that exports plain async functions.
- Always uses the shared `api` Axios instance from `lib/axios.ts`.
- Never calls `useQuery` / `useMutation` directly — that belongs in hooks.

```ts
// features/trips/api/trips-api.ts
import api from '@/lib/axios'
import type { Trip, CreateTripDto } from '../types/trip'

export const getTrips = () =>
  api.get<Trip[]>('/trips').then(r => r.data)

export const createTrip = (dto: CreateTripDto) =>
  api.post<Trip>('/trips', dto).then(r => r.data)
```

### `features/<name>/hooks/`
- Wrap API functions with TanStack Query.
- Export one hook per file. Use `queryKeys` factory pattern for cache key consistency.

```ts
// features/trips/hooks/use-trips.ts
import { useQuery } from '@tanstack/react-query'
import { getTrips } from '../api/trips-api'

export const tripKeys = {
  all: ['trips'] as const,
  detail: (id: string) => ['trips', id] as const,
}

export const useTrips = () =>
  useQuery({ queryKey: tripKeys.all, queryFn: getTrips })
```

### `features/<name>/schemas/`
- Zod schemas for form validation and runtime DTO shape-checking.
- Infer TypeScript types from schemas where possible.

```ts
// features/trips/schemas/trip-schema.ts
import { z } from 'zod'

export const CreateTripSchema = z.object({
  title: z.string().min(3).max(100),
  destination: z.string().min(2),
  startDate: z.string().date(),
  endDate: z.string().date(),
})

export type CreateTripDto = z.infer<typeof CreateTripSchema>
```

### `routes/`
- Route files are thin. They import from `features/` and compose components.
- Use `loader` for prefetching via `queryClient.ensureQueryData()`.
- Keep no business logic in route files.

```ts
// routes/_app/trips/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/app/providers/query-client'
import { tripKeys } from '@/features/trips/hooks/use-trips'
import { getTrips } from '@/features/trips/api/trips-api'
import { TripList } from '@/features/trips'

export const Route = createFileRoute('/_app/trips/')({
  loader: () =>
    queryClient.ensureQueryData({ queryKey: tripKeys.all, queryFn: getTrips }),
  component: () => <TripList />,
})
```

### `app/stores/`
- Zustand stores for **client state only** (auth tokens, UI preferences).
- Never duplicate server data here — that lives in TanStack Query cache.

```ts
// app/stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'auth' }
  )
)
```

---

## Axios Error Handling Strategy

Centralise error normalisation in `lib/axios.ts`:

```ts
// lib/axios.ts (response interceptor addition)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().setToken(null)
      router.navigate({ to: '/login' })
    }
    return Promise.reject(error)
  }
)
```

---

## Shadcn UI Installation Pattern

Add components via CLI — never edit files in `components/ui/` manually:

```bash
npx shadcn@latest add button card dialog form input select table
```

Customise design tokens only in `index.css` using Tailwind CSS v4 `@theme` variables.

---

## Import Alias Map

| Alias | Resolves to |
|-------|-------------|
| `@/app/*` | `src/app/*` |
| `@/features/*` | `src/features/*` |
| `@/components/*` | `src/components/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/lib/*` | `src/lib/*` |
| `@/types/*` | `src/types/*` |
| `@/routes/*` | `src/routes/*` |

---

## Unit Testing

### Test Stack

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (Vite-native, replaces Jest) |
| `@testing-library/react` | Component rendering & queries |
| `@testing-library/user-event` | Realistic user interaction simulation |
| `@testing-library/jest-dom` | DOM assertion matchers (`toBeInTheDocument`, etc.) |
| `msw` | Mock Service Worker — intercepts Axios requests at the network level |
| `@tanstack/react-query` | Re-used directly; wrap tests in `QueryClientProvider` |

Install:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom msw
```

---

### Test File Placement

Tests live **co-located** next to the source file they cover, using the `.test.ts` / `.test.tsx` suffix:

```
src/
├── features/
│   └── trips/
│       ├── api/
│       │   ├── trips-api.ts
│       │   └── trips-api.test.ts        ← API function tests (MSW)
│       ├── hooks/
│       │   ├── use-trips.ts
│       │   └── use-trips.test.ts        ← Query hook tests
│       ├── schemas/
│       │   ├── trip-schema.ts
│       │   └── trip-schema.test.ts      ← Zod schema validation tests
│       └── components/
│           ├── trip-card.tsx
│           └── trip-card.test.tsx       ← Component rendering tests
├── app/
│   └── stores/
│       ├── auth-store.ts
│       └── auth-store.test.ts           ← Zustand store tests
└── lib/
    ├── utils.ts
    └── utils.test.ts                    ← Pure utility tests
```

Global test infrastructure lives in `src/test/`:

```
src/
└── test/
    ├── setup.ts                         # Global setup (jest-dom matchers, MSW lifecycle)
    ├── render.tsx                        # Custom render() with all providers
    ├── msw/
    │   ├── server.ts                    # MSW node server instance
    │   └── handlers/
    │       ├── trips-handlers.ts        # Mock API responses for /trips
    │       ├── auth-handlers.ts
    │       └── index.ts                 # Combines all handlers
    └── factories/
        ├── trip-factory.ts              # Test data builders
        └── user-factory.ts
```

---

### Vitest Configuration

Add to `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/features/**', 'src/lib/**', 'src/app/stores/**'],
      exclude: ['src/test/**', 'src/routeTree.gen.ts'],
    },
  },
})
```

Add to `tsconfig.app.json` > `compilerOptions`:

```json
{ "types": ["vitest/globals"] }
```

---

### Global Test Setup

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

```tsx
// src/test/render.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactNode } from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

export function renderWithProviders(
  ui: ReactNode,
  options?: RenderOptions,
) {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
    options,
  )
}
```

---

### MSW Handler Pattern

```ts
// src/test/msw/handlers/trips-handlers.ts
import { http, HttpResponse } from 'msw'
import { tripFactory } from '@/test/factories/trip-factory'

export const tripsHandlers = [
  http.get('/trips', () =>
    HttpResponse.json([tripFactory(), tripFactory()]),
  ),

  http.get('/trips/:tripId', ({ params }) =>
    HttpResponse.json(tripFactory({ id: params.tripId as string })),
  ),

  http.post('/trips', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(tripFactory(body as object), { status: 201 })
  }),
]
```

```ts
// src/test/msw/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

### Test Factories

```ts
// src/test/factories/trip-factory.ts
import type { Trip } from '@/features/trips/types/trip'

let idCounter = 0

export const tripFactory = (overrides: Partial<Trip> = {}): Trip => ({
  id: String(++idCounter),
  title: 'Paris Getaway',
  destination: 'Paris, France',
  startDate: '2026-07-01',
  endDate: '2026-07-10',
  status: 'upcoming',
  createdAt: new Date().toISOString(),
  ...overrides,
})
```

---

### Example Tests by Layer

#### Zod Schema

```ts
// features/trips/schemas/trip-schema.test.ts
import { describe, expect, it } from 'vitest'
import { CreateTripSchema } from './trip-schema'

describe('CreateTripSchema', () => {
  it('accepts valid input', () => {
    const result = CreateTripSchema.safeParse({
      title: 'Tokyo Trip',
      destination: 'Tokyo',
      startDate: '2026-09-01',
      endDate: '2026-09-14',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a title shorter than 3 characters', () => {
    const result = CreateTripSchema.safeParse({
      title: 'AB',
      destination: 'Tokyo',
      startDate: '2026-09-01',
      endDate: '2026-09-14',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('title')
  })
})
```

#### API Function

```ts
// features/trips/api/trips-api.test.ts
import { describe, expect, it } from 'vitest'
import { server } from '@/test/msw/server'
import { http, HttpResponse } from 'msw'
import { getTrips } from './trips-api'

describe('getTrips', () => {
  it('returns a list of trips', async () => {
    const trips = await getTrips()
    expect(Array.isArray(trips)).toBe(true)
    expect(trips.length).toBeGreaterThan(0)
  })

  it('throws on server error', async () => {
    server.use(
      http.get('/trips', () => HttpResponse.json(null, { status: 500 })),
    )
    await expect(getTrips()).rejects.toThrow()
  })
})
```

#### TanStack Query Hook

```ts
// features/trips/hooks/use-trips.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTrips } from './use-trips'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

describe('useTrips', () => {
  it('fetches and returns trips', async () => {
    const { result } = renderHook(() => useTrips(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })
})
```

#### Component

```tsx
// features/trips/components/trip-card.test.tsx
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { tripFactory } from '@/test/factories/trip-factory'
import { TripCard } from './trip-card'

describe('TripCard', () => {
  it('renders trip title and destination', () => {
    const trip = tripFactory({ title: 'Rome Adventure', destination: 'Rome, Italy' })
    renderWithProviders(<TripCard trip={trip} />)
    expect(screen.getByText('Rome Adventure')).toBeInTheDocument()
    expect(screen.getByText('Rome, Italy')).toBeInTheDocument()
  })
})
```

#### Zustand Store

```ts
// app/stores/auth-store.test.ts
import { describe, expect, it, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'

describe('useAuthStore', () => {
  beforeEach(() => useAuthStore.setState({ token: null }))

  it('sets a token', () => {
    useAuthStore.getState().setToken('abc123')
    expect(useAuthStore.getState().token).toBe('abc123')
  })

  it('clears the token', () => {
    useAuthStore.setState({ token: 'abc123' })
    useAuthStore.getState().setToken(null)
    expect(useAuthStore.getState().token).toBeNull()
  })
})
```

---

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Feature Implementation Checklist

When adding a new feature (e.g., `bookings`), follow this order:

1. `features/bookings/types/booking.ts` — define TypeScript types
2. `features/bookings/schemas/booking-schema.ts` — Zod validation schemas
3. `features/bookings/schemas/booking-schema.test.ts` — schema unit tests
4. `features/bookings/api/bookings-api.ts` — Axios API calls
5. `features/bookings/api/bookings-api.test.ts` — API tests with MSW
6. `features/bookings/hooks/use-bookings.ts` — TanStack Query hooks
7. `features/bookings/hooks/use-bookings.test.ts` — hook tests
8. `features/bookings/components/` — React components + `.test.tsx` per component
9. `features/bookings/index.ts` — barrel export
10. `routes/_app/bookings/` — add route file(s)

---

## Key Dependencies Reference

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-router` | v1 | File-based routing, type-safe navigation |
| `@tanstack/react-query` | v5 | Server state, caching, background sync |
| `axios` | v1 | HTTP client (wrapped in `lib/axios.ts`) |
| `zustand` | v5 | Client/UI state management |
| `zod` | v4 | Schema validation (env, forms, API DTOs) |
| `tailwindcss` | v4 | Utility-first CSS |
| `lucide-react` | latest | Icon library (pairs with Shadcn) |
| `vitest` | latest | Vite-native test runner |
| `@testing-library/react` | latest | Component rendering & DOM queries |
| `@testing-library/user-event` | latest | Realistic user interaction simulation |
| `@testing-library/jest-dom` | latest | Custom DOM matchers |
| `msw` | v2 | Network-level API mocking (works with Axios) |
