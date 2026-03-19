## Why

The `apps/web/src/app/file-browser/` slice grew with many files in a **single flat folder**, making roles (pure logic vs UI vs HTTP vs hooks) hard to see at a glance. **AGENTS.md** and **openspec/README.md** now describe a **Clean-style mapping** and **optional subfolders** (`lib/`, `ui/`, `hooks/`, `api/`) under the feature. This change applies that structure so the codebase matches the documented architecture and future OpenSpec changes can reference a stable layout.

## What Changes

- **Reorganize** `file-browser/` into subfolders: `lib/` (pure utilities), `ui/` (presentational components), `hooks/` (React hooks + co-located specs), `api/` (HTTP service, Zod, listing toaster host).
- **Keep** the feature root for the composition screen (`FileBrowserPage.tsx`) and the **barrel** `index.ts` (re-exports unchanged for consumers where possible).
- **No user-visible behavior change** and **no API contract change** — import path updates and file moves only.
- **Update** any external imports (e.g. `main.tsx`) if they deep-link into moved files.

## Capabilities

### New Capabilities

- `file-browser-slice-structure`: Normative requirements that the `file-browser` feature code SHALL be laid out per AGENTS.md (subfolders under the slice) so structure is reviewable and aligned with OpenSpec/design “Code layout” sections.

### Modified Capabilities

- (none — product behavior in `file-browser-listing-ui` / `file-browser-listing-ux` is unchanged.)

## Impact

- **apps/web** only: `apps/web/src/app/file-browser/**`, `apps/web/src/main.tsx` if it imports `listing-toaster` by path, `apps/web/src/app/app.tsx` if needed.
- **apps/api**: none.
- **Dependencies**: none.
