## Context

The API implements **path-based directory listing** under **AGENTS.md** and the **`path-file-listing`** capability. NestJS code is expected to use **Screaming Architecture**: capability-named folders, not app-wide horizontal layers. Today, listing lives under **`apps/api/src/app/path-file-listing/`** with module, controller, service, DTOs, and **`path-resolver`** colocated—this matches the intended model; the change **documents and enforces** it in OpenSpec so future edits do not scatter listing logic.

## Goals / Non-Goals

**Goals:**

- Keep **all path-file-listing NestJS code** under **`apps/api/src/app/path-file-listing/`** (and optional subfolders inside that feature only).
- Preserve **thin controllers** (HTTP + DTO validation + delegate to service); **filesystem and path rules** stay in **services** and **colocated pure helpers** (e.g. path resolver).
- **`AppModule`** composes **feature modules** (e.g. `PathFileListingModule`); do **not** introduce root-level `controllers/` / `services/` / `modules/` that mix unrelated features.
- Align **`tasks.md`** implementation with **`openspec/changes/.../specs/path-file-listing/spec.md`** delta and **AGENTS.md** NestJS section.

**Non-Goals:**

- Changing the **public HTTP contract** (routes, query params, JSON shapes) unless a bug is found that blocks compliance—then document and fix in the smallest scope.
- Refactoring **React** (`apps/web`) or unrelated API features.
- Large renames purely for style when the current names already “scream” the capability.

## Decisions

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| **Single feature root `path-file-listing/`** | Matches AGENTS.md and makes the capability discoverable from the folder name alone. | Splitting listing across `src/controllers` + `src/services` — **rejected** (horizontal mixing). |
| **Optional subfolders only inside the feature** | If the slice grows, use e.g. `dto/` (already present) or `lib/` for pure code—**not** new app-root layers. | Flat-only — acceptable; subfolders only when file count warrants it. |
| **`path-resolver` colocated** | Pure/path logic stays next to the listing service; tests remain co-located (`*.spec.ts`). | Shared `libs/` for resolver — defer until a second feature needs it. |

## Code layout (target)

**NestJS (API)**

- **Feature folder:** `apps/api/src/app/path-file-listing/`
  - **`path-file-listing.module.ts`** — registers controller + providers for this capability.
  - **`path-file-listing.controller.ts`** — HTTP only; uses DTOs; calls service.
  - **`path-file-listing.service.ts`** — listing orchestration and filesystem use.
  - **`path-file-listing.config.ts`** — configuration wiring for allowed root / env as used by this feature.
  - **`path-resolver.ts`** (+ **`path-resolver.spec.ts`**) — pure or injectable path resolution colocated with the feature.
  - **`dto/`** — request/response DTOs and barrel **`index.ts`** if present.
- **Composition root:** `apps/api/src/app/app.module.ts` imports **`PathFileListingModule`** (and future feature modules); **does not** register listing controllers/providers directly except for app-level bootstrap if required.

**Frontend**

- Not in scope for this change; no **`apps/web`** layout changes.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Over-eager refactor renames public symbols | Prefer minimal moves; run tests after each step. |
| Spec vs code mismatch after archive | Update **`openspec/specs/path-file-listing/spec.md`** when archiving per OpenSpec workflow. |

## Migration Plan

- Implement on **`feature/path-file-listing-screaming-architecture`** via **`/opsx:apply`** (or `npm run git:feature -- path-file-listing-screaming-architecture`).
- **Rollback:** revert the feature branch; no DB or external migration.

## Open Questions

- None for initial apply—if audit finds stray imports from outside the feature folder, tasks will call out concrete file moves.
