## 1. Hooks and data

- [x] 1.1 Add `useDebouncedValue` or equivalent (300ms) for path string; export from `file-browser` slice
- [x] 1.2 Add `useFileListingQuery` (React Query) with key `['fileListing', path]` calling `fetchFileListing`; support refetch on demand for Enter/Tab
- [x] 1.3 Wire keyboard handler: **Enter** and **Tab** cancel debounce and trigger immediate fetch for current input value

## 2. Presentational UI (Chakra)

- [x] 2.1 Add `PathInput` (Chakra `Input` or Field): controlled value, `onChange`, `onKeyDown` for Enter/Tab, mobile-first width and padding
- [x] 2.2 Add `FileListingView`: receives `entries`, `isLoading`, `error`; uses `Stack`/`List` and distinct styling for directory vs file
- [x] 2.3 Add `FileBrowserPage` (or `FileBrowser`) composing input + listing + loading/error regions
- [x] 2.4 Mount feature in `App` (replace or wrap connection-test-only UI as appropriate)

## 3. Unit tests (Vitest, AAA)

- [x] 3.1 Test debounce helper or hook: Arrange timer/mock timers, Act wait 300ms, Assert single call
- [x] 3.2 Test immediate submit on Enter/Tab (hook or integration-style with `renderHook` / user-event if used): AAA
- [x] 3.3 Ensure `nx test web` passes; run `npm test` before marking apply complete

## 4. Polish

- [x] 4.1 Placeholder/help text: relative path, forward slashes, empty = root
- [x] 4.2 Optional: Zod parse of `ListEntry[]` from API response (align with AGENTS.md)
