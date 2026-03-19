# Agent context – File Browser Workspace

This document gives AI agents the business context and technical stack for this repo.

## Business objective

We need to **expose and browse files and folders from a given path (ruta)**:

- **Backend**: An API that lists files and folders for a given path and returns them in a structured way (name, path, type: file | directory).
- **Frontend**: A UI that consumes that API and renders the list of folders and files (e.g. tree or list).

The product is a **file browser**: the API is the source of truth for the listing; the UI only displays it and delegates all business logic to services.

## Technical stack

| Layer      | Technology | Notes |
|-----------|------------|--------|
| Monorepo  | **Nx**     | Apps and (future) libs; cache and task orchestration. |
| API       | **NestJS 11** | REST API; feature-based modules; SOLID, Screaming Architecture. |
| Frontend  | **React 18**  | Vite; **React Query** for server state; presentational UI. |
| Language  | **TypeScript** | Strict; shared via `tsconfig.base.json`. |

## Architecture principles

- **SOLID**: Single responsibility, dependency injection, interfaces where they add value.
- **Screaming Architecture**: Folder and module names reflect what the system does (e.g. `file-listing`, `file-browser`), not frameworks.
- **Feature-based structure**: Code is organized by feature (e.g. `file-listing/`, `file-browser/`), not only by type (controllers, services).
- **Frontend separation**:
  - **UI**: Presentational only — receives data via props, no API calls or business rules.
  - **Logic**: In services and React Query hooks (data fetching, transformations, state).

## Repo layout (relevant)

- `apps/api` – NestJS 11 API (global prefix: `/api`).
- `apps/web` – React 18 app (Vite); features under `src/app` or feature folders.
- `libs/shared` – Shared types/utilities; path alias `@file-browser-workspace/shared`.
- OpenSpec scope: change `file-listing-api-and-ui` (see `openspec/changes/`).

## Commands

- `npm run serve:api` / `npx nx serve api` – API (default: http://localhost:3000/api).
- `npm run serve:web` / `npx nx serve web` – Web app (default: http://localhost:4200).

When implementing features, follow the OpenSpec change and the conventions above (SOLID, Screaming Architecture, feature-based, UI vs services).
