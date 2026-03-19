# Agent context – File Browser Workspace

This document is the **single source of truth** for business context, **workflow (OpenSpec + Git)**, and **coding rules (vertical slices)**. Cursor and other agents MUST use it when running specs or implementing changes.

## Workflow (OpenSpec + Git)

**Integration branch (default base):** **`trunk`**. Tooling resolves the merge base in order **`trunk`** → **`main`** → **`master`** when a local branch is missing (see `scripts/git-feature-from-trunk.mjs`). **`nx.json`** `defaultBase` is **`trunk`**.

1. **Proposal** — Create or refine the change with OpenSpec: `proposal` → `design` → `specs` → `tasks` (e.g. `/opsx:propose` or openspec-propose skill).
2. **Apply** — When starting implementation (`/opsx:apply` or openspec-apply-change):
   - **Trunk-based**: Work happens on **`feature/<change-name>`**, not on trunk. The **change name** is the OpenSpec change **id** (folder under `openspec/changes/<change-name>/` where **`proposal.md`** lives — use that id, not the proposal title).
   - **Automatic branch (recommended path)**: **`/opsx:apply`** **creates or checks out** `feature/<change-name>` via **`npm run git:feature -- <change-name>`** (see **`.cursor/commands/opsx-apply.md`**) right after the change is selected.
   - **Without apply’s branch step**: Run **`npm run git:feature`** / **`npm run git:feature -- <change-name>`** first (infer name when exactly one active change exists), then continue implementation; or run **`/opsx:apply`** from **Check status** onward if appropriate.
3. **Work** — Implement tasks from `tasks.md` on that feature branch; keep commits focused.
4. **Unit tests (mandatory)** — After each feature slice (and before considering **apply** or **archive** complete), add or update **unit tests** for both **`apps/api`** and **`apps/web`** that touch the change. Use the **AAA** pattern (Arrange, Act, Assert) in every test. Stack: **Vitest** (same runner for API Node tests and web). Run `npm test` (or `nx test api` and `nx test web`). **Do not skip, ignore, or disable tests** to “pass” the build; if tests fail, **iterate until green**. A change is **not** done while `api:test` or `web:test` fails. No `passWithNoTests: true` workaround for projects that must have coverage for the feature.
5. **Archive and land on trunk** — When the change is done **and all unit tests pass**:
   - Run **`/opsx:archive`** (or **openspec-archive-change**). Moves `openspec/changes/<change-name>/` → `openspec/changes/archive/YYYY-MM-DD-<change-name>/` (and syncs delta specs when applicable).
   - **Immediately after**, in the same session, **`/opsx:archive`** includes **Git close-out**: **conventional commit** on **`feature/<change-name>`**, **merge into the integration branch** (default **`trunk`**), **checkout** that branch — see **`.cursor/commands/opsx-archive.md`** step **8**. Archive **cannot** proceed without **unit tests for `api` and `web` passing** (step **5** in that command). Opt out of Git only if the user explicitly wants OpenSpec archive **without** Git.
6. **Next change** — From the integration branch (**`trunk`** by default), use **`npm run git:feature -- <next-change-name>`** (or **`npm run git:feature`** when one active change) when you need the feature branch before **`/opsx:apply`**, then **`/opsx:apply`** as usual.

### Cursor command cheat sheet (Git + OpenSpec)

| Goal | Command |
|------|---------|
| Proposal + artifacts | **`/opsx:propose`** (or OpenSpec CLI) |
| Feature branch + implement tasks | **`/opsx:apply`** (Git steps in that command). Manual branch first: **`npm run git:feature`** / **`npm run git:feature -- <name>`** |
| Archive OpenSpec + commit + merge + integration branch | **`/opsx:archive`** (tests **`api`+`web`** then archive + Git close-out — **`.cursor/commands/opsx-archive.md`**) |

## Business objective

We need to **expose and browse files and folders from a given path (ruta)**:

- **Backend**: An API that lists files and folders for a given path and returns them in a structured way (name, path, type: file | directory).
- **Frontend**: A UI that consumes that API and renders the list of folders and files (e.g. tree or list).

The product is a **file browser**: the API is the source of truth for the listing; the UI only displays it and delegates all business logic to services.

**Path rules (normative detail):** The caller supplies a path that **must exist** (and for listing, must be a **directory**). Paths are defined for **Windows and macOS/Linux** in OpenSpec change **`cross-platform-path-file-listing`** (wire format, allowed root, traversal rules). Do not implement path behavior outside that spec without updating the change.

**AI / OpenSpec:** Implementation is **spec-driven**. Use `openspec/changes/<change>/` (proposal, design, specs, tasks) as the contract; avoid ad-hoc behavior not reflected in specs.

**UI / UX mindset:** The app must feel **fluid**, **pleasant**, and **mobile-first**. Use Chakra UI for a consistent, accessible base; prioritize touch targets, spacing, and responsive layout so the experience is smooth on small screens and scales up. When rendering folders and files, use a **dedicated presentational component** (e.g. a tree or list built with Chakra primitives — collapsible rows, clear hierarchy, icons for file vs folder) so the listing is scannable and easy to navigate on mobile and desktop.

## Technical stack

| Layer      | Technology | Notes |
|-----------|------------|--------|
| Monorepo  | **Nx**     | Apps and (future) libs; cache and task orchestration. |
| API       | **NestJS 11** | REST API; feature-based modules; SOLID, Screaming Architecture. |
| Frontend  | **React 18**  | Vite; **Chakra UI** for components and layout; **React Query** for server state; **Zod** for validation; presentational UI. |
| Language  | **TypeScript** | Strict; shared via `tsconfig.base.json`. |
| Unit tests | **Vitest** | AAA pattern; `apps/api` (node) and `apps/web` (jsdom); `npm test` gates apply/archive. |

## Architecture principles

- **SOLID**: Single responsibility, dependency injection, interfaces where they add value.
- **Vertical slices**: One slice per capability/feature; each slice owns its UI, API calls, and types (see below). No horizontal “reducers” or “controllers” folders that mix many features.

## Screaming Architecture (React and NestJS)

Folder and file names must **scream what the application does** (domain and capabilities), not the framework or technical layer.

- **React**: Structure by **feature/capability**, not by type. Prefer `file-browser/`, `path-picker/` at the top level. Avoid **app-wide** folders like `src/components/`, `src/hooks/`, `src/pages/` that hide what the app does. Inside a **named feature folder** (e.g. `file-browser/`), you may keep files flat **or** use **optional subfolders** (see *React feature slice structure* below) — still one capability per top-level feature name.
- **NestJS**: Structure by **feature/capability**, not by layer. Prefer `path-file-listing/`, `file-browser/` (or domain names like `listing/`). Avoid root-level `controllers/`, `services/`, `modules/` that mix all features. Each feature folder contains its module, controller, service, DTOs; the folder name is the capability.
- **Rule of thumb**: A newcomer should understand “what this app does” from the folder names alone, without opening files.

## React feature slice structure (Clean Architecture mapping)

A **vertical slice** (e.g. `apps/web/src/app/file-browser/`) should respect **dependency direction**: UI and framework details depend inward; **pure rules and types** do not depend on React or Chakra.

| Concern | Role (Clean-ish) | Typical contents | Depends on |
|--------|-------------------|------------------|------------|
| **Domain / pure** | Entities + pure use rules | Types shared with API, pure parsers (`splitPathInput`), filters (`filterEntriesByNamePrefix`), no `fetch`, no React | Nothing in the app |
| **Application** | Orchestration | Hooks that compose state, React Query, and callbacks (`useListingPathState`, `useFileListingQuery`) | Domain pure + infrastructure |
| **Infrastructure** | I/O + adapters | `fetch` + Zod (`file-listing.service.ts`), toaster wiring (`listing-toaster.tsx`) | Domain types |
| **Presentation** | UI | Presentational components (`PathInput`, `FileListingView`) — props in, events out | Nothing except props/types |
| **Composition root** | Page / screen | `FileBrowserPage.tsx` wires hooks + presentational components | Application + presentation |

**Screaming + Clean together**: The **folder name** still screams the feature (`file-browser/`). Inside, **file names** can reflect role (`*.utils.ts` for pure, `*.service.ts` for HTTP, `use*.ts` for hooks, `*Page.tsx` for the screen). This is not “layer folders at app root”; it is one feature, multiple roles.

**When a slice grows** (many files, >~15 or hard to navigate), prefer **subfolders under the feature only**, for example:

- `file-browser/ui/` — presentational components only.
- `file-browser/hooks/` — hooks only.
- `file-browser/lib/` or `file-browser/domain/` — pure functions and types (no React).
- `file-browser/api/` or keep `*.service.ts` at feature root — HTTP + validation.

Keep **barrel exports** (`index.ts`) updated so imports stay `@/app/file-browser` or relative paths that still “scream” the feature.

**Smells to avoid**

- Business rules duplicated in both a component and a hook — extract to domain/pure module.
- `fetch` or React Query inside presentational components — violates AGENTS; move to services + hooks.
- Generic utilities (`useDebouncedValue`) used by multiple features — consider `libs/shared` or `src/app/shared/` later; colocating under one feature is OK until reuse is real.

## OpenSpec ↔ code layout

Every OpenSpec change should stay implementable **without inventing ad-hoc folder chaos**:

1. **`proposal.md` / `design.md`**: For UI/API work, add a **Code layout (target)** subsection (paths under `apps/web` / `apps/api`, feature folder name, main new files). See `openspec/README.md`.
2. **`tasks.md`**: Tasks should name files or areas that match **Screaming** names (feature folder, not `utils/global`).
3. **Implementers** follow this **AGENTS.md** section + the change’s **design.md**; if the spec requires behavior that would break Clean boundaries (e.g. fetch inside a dumb component), update the **design** or **spec** first.

This ties **openspec** to **how** we code, not only **what** we ship.

## React rules (apps/web)

- **UI library**: **Chakra UI** for all UI (Box, Stack, Button, Icon, etc.). Use Chakra primitives and tokens; keep the interface **fluid**, **clear**, and **mobile-first** (touch-friendly targets, responsive spacing, no cramped layouts).
- **Rendering folders and files**: Prefer a **dedicated presentational component** (e.g. `FileTree`, `FolderList`, or collapsible list) built with Chakra: clear visual hierarchy (folder vs file), expand/collapse for directories, adequate tap targets on mobile. Data comes from hooks; the component only receives and renders.
- **Vertical slice**: One folder per feature (e.g. `file-browser/`). All components, hooks, services, and types for that feature live inside it.
- **Small files, single responsibility**: No large files. One component (or one hook, one service) per file. If a file grows beyond ~150 lines, split into smaller components or extract logic. Each file has a single, clear responsibility.
- **Small, focused components**: Components do one thing (e.g. render a list item, a button, a status message). Compose small components instead of building large ones. Prefer many small files over few large ones.
- **Declarative over imperative**: Describe *what* to render (state → UI), not *how* to update the DOM step by step. Avoid refs and direct DOM manipulation for rendering; use state and composition. Use React Query for server state instead of manual loading flags and useEffect fetches.
- **Components as arrow functions**: Define components with arrow functions and explicit props types. Example: `export const FileRow: React.FC<FileRowProps> = ({ name, type }) => ( ... );`. Named exports only; file name matches the component (e.g. `FileRow.tsx` → `FileRow`).
- **Zod for validation**: Use **Zod** to validate API responses and form/input data. Define schemas in the feature (or shared) and parse before using data. Keeps types and runtime validation in sync.
- **React Query for server state**: Use **React Query** (TanStack Query) for all server data. Do not use raw `fetch` + `useState`/`useEffect` in components. Centralize API calls in **services**; hooks call services and wrap with `useQuery`/`useMutation`. Components only consume hooks and pass data to presentational components.
- **Centralized request and error handling**: Do not repeat loading/error handling in every component. Prefer:
  - **One place** for “how we call the API”: services that return promises; React Query handles retries and caching.
  - **One place** for “how we show errors”: e.g. a shared `QueryErrorBoundary` or a small `useQuery` wrapper that maps errors to a common shape; components only render `error` from the hook or an error boundary. Avoid try/catch and ad-hoc error UI in each screen.
- **Presentational components**: Receive data and callbacks via props only; no `fetch`, no React Query, no business logic. Only render and delegate events. Logic stays in hooks and services.
- **Exports**: Named exports only; file name matches main export (e.g. `FileList.tsx` → `export const FileList`).
- **Unit tests**: Co-locate `*.spec.ts` / `*.test.ts(x)` next to services and pure helpers; **Vitest** + **AAA**; mock `fetch` and browser APIs in jsdom as needed.

## NestJS rules (apps/api)

- **Vertical slice (Screaming Architecture)**: One folder per feature/capability (e.g. `path-file-listing/`). The folder name is the capability. Inside: `path-file-listing.module.ts`, `path-file-listing.controller.ts`, `path-file-listing.service.ts`, and optionally `dto/`. No root-level `controllers/` or `services/` that mix features.
- **Module**: Wires controller + service; exports only what other modules need. No “god” module importing every feature.
- **Controller**: HTTP only — validation (e.g. DTOs + ValidationPipe), parsing, calling the service, mapping to response DTOs. No filesystem access, no business logic. Thin layer.
- **Service**: All business logic, path resolution, `fs`/`readdir`, validation against allowed root. Injectable and testable without HTTP. Single responsibility per service (one service per feature or sub-capability).
- **Small, focused modules**: One feature per module. If a module grows too large, split by sub-capability (new folder, new module), not by adding more controllers/services in the same folder.
- **No horizontal folders**: Do not create top-level `controllers/`, `services/`, `modules/` that group by technical layer; structure by feature so the app “screams” what it does.
- **Unit tests**: Co-locate `*.spec.ts` next to services and pure modules (e.g. path resolution); **Vitest** (Node environment) + **AAA**; test business logic without HTTP where possible.

## Repo layout (relevant)

- `apps/api` – NestJS 11 API (global prefix: `/api`).
- `apps/web` – React 18 app (Vite); features under `src/app` or feature folders.
- `libs/shared` – Shared types/utilities; path alias `@file-browser-workspace/shared`.
- OpenSpec: see `openspec/changes/` — authoritative listing-by-path change: **`cross-platform-path-file-listing`**.

## Commands

- `npm run serve:api` / `npx nx serve api` – API (default: http://localhost:3000/api).
- `npm run serve:web` / `npx nx serve web` – Web app (default: http://localhost:4200).

When implementing features or running OpenSpec apply/archive, follow the **Workflow** and **Vertical slices** rules in this document. Use `openspec/changes/<change>/` as the contract; do not add behavior outside specs.
