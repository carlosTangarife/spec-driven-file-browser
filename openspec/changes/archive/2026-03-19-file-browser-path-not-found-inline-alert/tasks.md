## 1. Derive path-not-found message

- [x] 1.1 Add `useListingPathNotFoundMessage` (or equivalent) in `apps/web/src/app/file-browser/hooks/` that returns `string | null` for **404 + `ListingRequestError`** on the deferred listing path, with **dedup** behavior equivalent to today’s `useListingNotFoundToast` ref keying (explicit return type, no `any`).
- [x] 1.2 Remove `useListingNotFoundToast` usage from `FileBrowserPage.tsx` and delete `useListingNotFoundToast.ts` if nothing else imports it.

## 2. Inline UI

- [x] 2.1 Render the message **above** `PathInput` in `FileBrowserPage.tsx` (or a small `ui/` component if the page grows), using Chakra with **`role="alert"`**, red/error palette, and width constrained to the existing content column (not a side strip).

## 3. Tests and verify

- [x] 3.1 Add **Vitest** tests (AAA) for the new hook: **no message** when no error; **no message** for non-404; **message** for 404 + path; **dedup** when the same error/path repeats; **clears** when error clears.
- [x] 3.2 Run **`pnpm run lint`** and **`pnpm test`** (or `nx test web`); fix any regressions.

## 4. Manual check

- [x] 4.1 Manually enter a non-existent path, confirm the English copy is **readable** above the path field at **mobile** and **desktop** widths.
