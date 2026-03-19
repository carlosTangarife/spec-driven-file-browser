## 1. Web — extract pure preview error mapping

- [x] 1.1 Add `apps/web/src/app/file-browser/lib/preview-error.utils.ts` (or equivalent name) with an exported function that maps `unknown` preview errors to `Error | null`, matching current `FileBrowserPage` behavior.
- [x] 1.2 Add `apps/web/src/app/file-browser/lib/preview-error.utils.spec.ts` (Vitest, AAA) covering status branches (404, 400, 413, 415, 403) and fallback cases.
- [x] 1.3 Update `FileBrowserPage.tsx` to use the helper and remove inlined `previewDisplayError` `useMemo` logic.

## 2. Web — lazy tree expansion hook

- [x] 2.1 Add `apps/web/src/app/file-browser/hooks/useLazyTreeChildren.ts` encapsulating `expandedPaths`, `loadedChildren`, `loadingChildPaths`, reset on `listingPath` change, and `onToggleExpand` behavior using `fetchDirectoryTree`.
- [x] 2.2 Add `apps/web/src/app/file-browser/hooks/useLazyTreeChildren.spec.ts` with focused tests for state transitions (expand/collapse, load once, loading flag) using mocks where appropriate.
- [x] 2.3 Wire `FileBrowserPage.tsx` to the hook and trim the page to composition + small `useMemo` only if still needed.

## 3. API — deduplicate path-file-listing service

- [x] 3.1 Refactor `apps/api/src/app/path-file-listing/path-file-listing.service.ts` to extract private helper(s) for shared: parse → resolve → `isUnderRoot` → `stat` with consistent Nest exceptions for ENOENT / not-a-directory.
- [x] 3.2 Keep `list` and `getDirectoryTree` behavior identical; ensure explicit `Promise<ListEntryDto[]>` and `Promise<TreeNodeDto[]>` return types on public methods.
- [x] 3.3 Update or add `path-file-listing.service.spec.ts` cases if helpers warrant direct coverage; otherwise rely on existing service tests passing.

## 4. Verification

- [x] 4.1 Run `npm test` (or `nx test api` and `nx test web`) and fix any regressions until green.
