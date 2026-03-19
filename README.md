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
| `npm test` | Run Vitest unit tests for **api** and **web** (required before OpenSpec archive) |

Or with Nx:

- `npx nx serve api`
- `npx nx serve web`
- `npx nx build api`
- `npx nx build web`
- `npx nx test api` / `npx nx test web` / `npm test`

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

## API configuration (path-file-listing)

- **`FILE_LISTING_ALLOWED_ROOT`** (env): Absolute path on the host that the listing API is allowed to read. Default: `process.cwd()`. Traversal above this root is rejected.
- **Symlink policy**: Do not follow symlinks when resolving the requested path. Children from `readdir` are returned as-is. See OpenSpec change `cross-platform-path-file-listing`.

**Verification**: Manual or e2e: run `nx serve api`, then `GET http://localhost:3000/api/listing` (root) or `GET http://localhost:3000/api/listing?path=subfolder`. For CI, run `nx build api` and optionally `nx e2e api-e2e`. Unit tests for path resolution live in `apps/api/src/app/path-file-listing/path-resolver.spec.ts` (run with a Jest/Vitest target when configured for the api project).

## Conventions

- **API**: feature-based modules (e.g. `file-listing`); SOLID and Screaming Architecture.
- **Web**: UI components are presentational (no business logic); data and logic live in services and React Query hooks.

Scope and tasks: OpenSpec changes under `openspec/changes/`. Path listing: **`cross-platform-path-file-listing`**.’s feature folder.
