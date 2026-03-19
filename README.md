# File Browser Workspace

Nx monorepo with **NestJS 11** (API) and **React 18** (web), following SOLID, Screaming Architecture, and feature-based structure.

## Stack

- **Nx** – monorepo and task orchestration
- **NestJS 11** – API (`apps/api`)
- **React 18** – frontend (`apps/web`) with **React Query**, presentational UI and logic in services
- **TypeScript** – strict mode

## Commands

| Command | Description |
|--------|-------------|
| `npm run serve:api` | Start NestJS API (default: http://localhost:3000/api) |
| `npm run serve:web` | Start React app (Vite dev server) |
| `npm run build:api` | Build API for production |
| `npm run build:web` | Build web app for production |

Or with Nx:

- `npx nx serve api`
- `npx nx serve web`
- `npx nx build api`
- `npx nx build web`

## Structure

```
file-browser-workspace/
├── apps/
│   ├── api/          # NestJS 11 – feature modules under src/app
│   ├── api-e2e/      # API e2e tests
│   ├── web/          # React 18 + React Query – features under src/app
│   └── web-e2e/      # Web e2e (Playwright)
├── libs/
│   └── shared/       # Shared types/utilities (path: @file-browser-workspace/shared)
└── openspec/         # OpenSpec change (file-listing-api-and-ui)
```

## Conventions

- **API**: feature-based modules (e.g. `file-listing`); SOLID and Screaming Architecture.
- **Web**: UI components are presentational (no business logic); data and logic live in services and React Query hooks.

Scope and tasks are defined in OpenSpec change `file-listing-api-and-ui`. When the first feature is defined, implement it under the corresponding app’s feature folder.
