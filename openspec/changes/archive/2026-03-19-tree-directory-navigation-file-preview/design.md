## Context

The app already exposes **flat** directory listing (`path-file-listing`) and a **file-browser** UI with debounced path input. This change adds **nested tree data** for navigation and **read-only text preview** for files, reusing the same **allowed root** and **wire path** rules as existing path specs.

## Goals / Non-Goals

**Goals:**

- Provide a **tree-shaped API** (JSON) for a requested directory with **recursion depth** defaulting to **3** (and allowing the API to support **at least** depth **3** as a minimum product requirement).
- Keep **path resolution and traversal safety** consistent with `path-file-listing` (no `..`, stay under allowed root, cross-platform).
- **Web**: Show a **tree** (or expandable hierarchy); **folder click** sets the path input and reloads tree data; **input edits** reload tree data for the new path; **file select** fetches and shows **text preview**.
- Respect **Screaming Architecture**: NestJS and React changes live in **named feature folders** only.

**Non-Goals:**

- Full **binary** file preview, image/video rendering, or syntax-highlighting IDE features.
- **Write / upload / delete** files.
- **Pagination** of very large directories inside tree (may truncate or cap with documented limits in implementation if needed).

## Decisions

| Decision | Rationale | Alternatives |
|----------|-----------|----------------|
| **Separate Nest feature `path-file-content/`** for file body | Reading file bytes is a distinct capability from directory listing; keeps modules small and names clear. | Single mega-module — rejected (mixed responsibilities). |
| **Tree endpoint colocated in `path-file-listing/`** | Tree is still “listing” of structure; shares path resolver and config. | New `directory-tree/` module — acceptable but duplicates resolver; prefer shared service/helper imports inside `path-file-listing/`. |
| **`GET` + query params** for tree (`path`, `depth`) and preview (`path`) | Aligns with existing listing style; easy to cache with React Query keys. | POST bodies for reads — unnecessary. |
| **Depth default `3`, min product depth `3`** | Matches request “at least three levels.” | Larger default — tune later via config. |
| **Preview: UTF-8 text, max size cap** | Predictable memory and XSS surface; reject or flag binary. | Stream unlimited — rejected. |
| **VCS/metadata directory blacklist** | Hides `.git`, `.github`, `.svn`, `.hg`, and directories whose name starts with `.git` from **immediate** listing/tree children; reduces noise and accidental heavy scans. | Hide all dotfiles — rejected (too broad). |
| **Lazy tree UX: depth=1 + expand loads children** | UI requests shallow trees; chevron expand fetches that folder’s children; double-click (or equivalent) sets global path. Keeps payloads smaller than default depth **3** for full subtrees. | Always fetch depth **3** at root — rejected for large trees. |
| **Path input perf: debounce + deferred value + staleTime** | Fewer tree queries while typing; smoother input. | Fire on every keystroke — rejected. |

## Process note

Product behavior added or changed during implementation for this proposal SHALL be reflected in **this change’s** `specs/**/*.md` and `design.md` so **`openspec/changes/<change-id>/`** remains the normative delta before archive merges into `openspec/specs/`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large trees slow or heavy JSON | Cap entries per level or total nodes in implementation; document limits; optional future pagination. |
| Accidental binary display | Sniff or decode failure → structured error + UI message. |
| Duplicate logic between flat list and tree | Reuse path resolver + shared DTO helpers in `path-file-listing/`; extract pure builders where possible. |

## Migration Plan

- Add routes alongside existing listing; **no removal** of flat listing in this change.
- Frontend can **feature-flag** tree layout in code only if needed; default ON per spec.

## Open Questions

- Exact **max preview bytes** and **max tree nodes** — set in implementation with constants and tests (defaults e.g. 512KiB preview, node cap TBD).

## Code layout (target)

### Backend (`apps/api/src/app`)

- **`path-file-listing/`** (extend)
  - Add **tree** handler: e.g. `GET` under global prefix with route such as `listing/tree` (final path in implementation must match OpenAPI/DTOs).
  - Add **service** method building nested tree using `fs` / `path` with **depth** and existing resolution helpers (`path-resolver` or extracted shared functions).
  - Add **DTOs/Zod or class-validator** for query (`path`, `depth`) and for tree node shape in responses.
- **`path-file-content/`** (new feature folder)
  - `path-file-content.module.ts`, `path-file-content.controller.ts`, `path-file-content.service.ts`, `dto/` for query and response (e.g. `content`, `encoding`, `truncated` flag).
  - Resolve file path with same allowed-root rules; **only files** (not directories); `readFile` with limit; return **400/404/413/415**-style behavior as specified.
- **`app.module.ts`**: import `PathFileContentModule` next to `PathFileListingModule`.

### Frontend (`apps/web/src/app/file-browser/`)

- **`api/`**: extend or add services — `file-listing.service.ts` (tree fetch) and **`file-content.service.ts`** (preview fetch) with Zod parsing.
- **`hooks/`**: React Query hooks — e.g. `useDirectoryTreeQuery`, `useFileContentQuery` (names may vary); reuse path state from `useListingPathState` or extend it for **selected file** segment.
- **`ui/`**: presentational **`FileTreeView`** (or similar) — props: nodes, loading, `onDirectoryClick`, `onFileClick`; **`FileContentPreview`** — props: text, loading, error, truncated.
- **`FileBrowserPage.tsx`**: compose path input + tree + preview panel; **no fetch** inside dumb components.

### Shared

- Prefer colocating types/schemas under `file-browser/lib/` or `api/` until a second consumer needs `libs/shared`.
