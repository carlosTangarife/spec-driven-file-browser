## 1. Path parsing and listing behavior

- [x] 1.1 Add pure helpers (e.g. `splitPathInput`) to derive `listingWirePath` and `namePrefix` from trimmed input; unit tests (Vitest, AAA)
- [x] 1.2 Update listing state / query so debounced and Enter/Tab “flush” targets **`listingWirePath`** for `fetchFileListing`, not the raw input string
- [x] 1.3 Apply client-side **prefix filter** on `ListEntry[]` when `namePrefix.length >= 3`; pass filtered list into `FileListingView`

## 2. Layout and input

- [x] 2.1 Adjust `FileBrowserPage` (and container wrappers) for **symmetric horizontal spacing** and centered or full-width layout per design; verify at least one wide breakpoint
- [x] 2.2 Enforce **200** character max on path input (`PathInput` or controlled slice)

## 3. User feedback (English)

- [x] 3.1 Integrate Chakra **toast** (or project-standard notifier): on listing failure with **404**, show friendly English message
- [x] 3.2 Implement **3 second** timer when `pathInput.length === 1`; on fire, show English feedback that **3+ characters** are needed for name filtering; clear timer on change/unmount

## 4. Tests and verification

- [x] 4.1 Add/adjust Vitest tests for path split, filter, and timer behavior (AAA); `npm test` passes
