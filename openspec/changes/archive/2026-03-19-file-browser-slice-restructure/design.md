## Context

**AGENTS.md** (*React feature slice structure*, *OpenSpec ↔ code layout*) and **openspec/README.md** define how a vertical slice should group **domain/pure**, **hooks**, **UI**, and **infrastructure**. The `file-browser` slice is past the “~15 files” threshold where subfolders are recommended; files are still flat.

## Goals / Non-Goals

**Goals:**

- Match the documented folder layout under `apps/web/src/app/file-browser/`.
- Preserve **named exports**, **behavior**, and **test coverage** (Vitest + AAA).
- Keep **one feature name** at the app path (`file-browser/`); subfolders are internal only.
- Update **barrel** `index.ts` so importers can continue using `from './file-browser'` or `from './file-browser/index'` for public exports.

**Non-Goals:**

- Moving `useDebouncedValue` to a shared lib (reuse not required yet per AGENTS).
- Changing NestJS or OpenSpec canonical specs content beyond adding this change’s spec.
- Renaming the feature folder (`file-browser` stays).

## Decisions

1. **Target tree (Code layout)**

   ```
   file-browser/
     FileBrowserPage.tsx          # composition root (screen)
     index.ts                     # barrel re-exports
     lib/
       path-input.utils.ts
       path-input.utils.spec.ts
     ui/
       PathInput.tsx
       FileListingView.tsx
     hooks/
       useDebouncedValue.ts
       useDebouncedValue.spec.ts
       useFileListingQuery.ts
       useListingPathState.ts
       useListingPathState.spec.ts
       useMinCharsHint.ts
       useMinCharsHint.spec.ts
       useListingNotFoundToast.ts
     api/
       file-listing.service.ts
       file-listing.service.spec.ts
       listing-toaster.tsx
   ```

   **Rationale:** Maps directly to AGENTS table: `lib` = domain/pure, `hooks` = application, `api` = infrastructure (HTTP + toaster wiring), `ui` = presentation. `FileBrowserPage` stays at slice root as the composition root.

2. **Import strategy**

   - Internal imports use **relative paths** between subfolders (e.g. `hooks/useFileListingQuery` imports from `../api/file-listing.service`).
   - **Barrel** `index.ts` re-exports the same public symbols as today so `app.tsx` and tests importing from `./file-browser` need minimal or no changes.

3. **`main.tsx`**

   - If it imports `ListingToaster` from `./app/file-browser/listing-toaster`, update to `./app/file-browser/api/listing-toaster` **or** export `ListingToaster` from `file-browser/index.ts` and import from `./app/file-browser` (prefer single public entry).

## Risks / Trade-offs

- **Large diff** → Mitigation: move files in one change; run `nx test web` after; fix path by path if needed.
- **Circular imports** → Mitigation: hooks depend on `api/` and `lib/` only; `ui/` does not import hooks; page imports hooks + ui + lib as today.

## Migration Plan

1. Create subfolders; move files; fix imports.
2. Run `npm test` / `nx test web`.
3. Manual smoke: dev server listing still works.

## Open Questions

- None for this refactor.
