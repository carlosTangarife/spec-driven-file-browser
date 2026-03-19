## 1. Toasts (`file-browser/api`)

- [x] 1.1 Update `listing-toaster.tsx`: **bottom-centered** placement (or Chakra-supported equivalent); ensure toast body has comfortable **max width** / padding so text is not a narrow strip
- [x] 1.2 Adjust `useListingNotFoundToast` (and any listing hint toasts) so they only fire when appropriate after **fallback** logic (no false “not found” when fallback succeeds)

## 2. Path helpers (`file-browser/lib`)

- [x] 2.1 Add or extend pure helpers (e.g. `primaryNestedWirePath`, `parentAndLastSegment`) used for **primary** vs **404 fallback** resolution; document behavior in `path-input.utils.ts`
- [x] 2.2 Extend or add **tree node / entry** prefix filter for fallback with **min length 1** for nested fallback (keep root behavior per spec)
- [x] 2.3 **Single segment without `/`**: `splitPathInput` SHALL set `listingWirePath` to the trimmed token (e.g. `apps`), not root + `namePrefix`; update tests and hook copy

## 3. Tree query / page (`file-browser/hooks` + `FileBrowserPage`)

- [x] 3.1 Implement **fetch full path → on 404 fetch parent depth-1 → filter by last segment** for tree data; wire `listingPath` / `pathInput` state without breaking deferred debounce
- [x] 3.2 Reset expand/preview state when resolved anchor changes (same as today)

## 4. Tests and gate

- [x] 4.1 Vitest: path helper cases for `apps/web` vs `apps/a` style inputs; filter function; optional hook test with mocked fetch
- [x] 4.2 Run `npm test` (`api` + `web`); fix until green
