## Context

The file browser UI and path listing API were implemented in prior changes. Some files grew past the **~150-line** guideline in **AGENTS.md**, and `FileBrowserPage` mixes **preview/tree error mapping**, **lazy child loading**, and layout. The NestJS `PathFileListingService` duplicates **wire-path resolution**, **root checks**, and **stat + error mapping** between `list` and `getDirectoryTree`.

## Goals / Non-Goals

**Goals:**

- Reduce file size and cyclomatic complexity by **extracting pure functions** (error → user message, tree expansion state) and **focused hooks** where orchestration belongs.
- **Deduplicate** shared directory-resolution logic in the API service via **private helpers** or a small colocated module under `path-file-listing/` (still one feature folder).
- Keep **named exports**, **explicit return types** on exported functions and public service methods, and **thin** `FileBrowserPage` / controller layers.
- Preserve **identical** runtime behavior; all existing unit tests pass; add tests for new pure helpers/hooks where valuable.

**Non-Goals:**

- Changing REST contracts, DTO shapes, or wire-path semantics.
- New product features, Chakra redesign, or cross-feature `shared/` libraries unless strictly needed for extraction.

## Decisions

1. **Web: extract preview error mapping** — Move `previewDisplayError` logic from `FileBrowserPage` into **`file-browser/lib/`** (e.g. `preview-error.utils.ts`) with a single exported mapper and unit tests. **Rationale:** Pure, testable, drops branching in the page.

2. **Web: lazy tree expansion** — Move `expandedPaths`, `loadedChildren`, `loadingChildPaths`, and `handleToggleExpand` into a **`useLazyTreeChildren`** (or similarly named) hook under `file-browser/hooks/`, calling `fetchDirectoryTree` from the existing listing service. **Rationale:** Matches AGENTS “composition root wires hooks”; keeps the page declarative.

3. **Web: tree listing error line** — Optionally extract `treeErrorMessage` `useMemo` to a tiny helper or reuse existing listing error utilities if present; avoid duplication with `useListingNotFoundToast`.

4. **API: shared “resolve directory” pipeline** — Introduce **private** functions (same file or `path-file-listing/internal/` only if the service file would still exceed ~150 lines after split) for: parse segments → resolve absolute → `isUnderRoot` → `stat` with **ENOENT → NotFound**, not-a-dir → **BadRequest**. Both `list` and `getDirectoryTree` call this. **Rationale:** Single place for security and error mapping; easier tests.

5. **API: keep tree recursion readable** — `readTreeLevel` may stay private on the service or move to a **pure-ish** helper that receives `readdir` results if that improves testability without widening the public API.

## Risks / Trade-offs

- **[Risk] Refactor regressions** → Mitigation: run full `npm test`; keep diffs behavior-preserving; prefer extracting without renaming public exports used by routes/tests.
- **[Risk] Over-splitting** → Mitigation: stop at one hook + one lib file for the page unless `path-file-listing.service.ts` still exceeds guidance after deduplication.

## Migration Plan

Not applicable (no deployment or data migration). Merge after green tests.

## Open Questions

- None for proposal; implementation may choose exact filenames as long as they stay under `file-browser/` and `path-file-listing/`.

### Code layout (target)

| Area | Path | Notes |
|------|------|--------|
| Web feature | `apps/web/src/app/file-browser/` | Existing `ui/`, `hooks/`, `api/`, `lib/`; add/adjust under these only. |
| Web page | `apps/web/src/app/file-browser/FileBrowserPage.tsx` | Thin: hooks + presentational components only. |
| Web new/updated | `apps/web/src/app/file-browser/lib/*.ts`, `apps/web/src/app/file-browser/hooks/useLazyTreeChildren.ts` (name may vary) | Pure mappers + tree expansion state. |
| API feature | `apps/api/src/app/path-file-listing/` | Service refactor; optional small `*.ts` helper next to service if needed. |
