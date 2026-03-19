## Why

The “path not found” feedback for directory-tree **HTTP 404** uses Chakra’s **listing toaster**. In practice it renders as a **tall, unreadable vertical strip** on the edge of the viewport (layout/positioning of the toast region collapses width), so users cannot read the message. We need reliable, readable feedback without fighting the toast stack.

## What Changes

- Replace the **404 tree/listing “path not found”** toast with a **prominent inline alert** placed **above the path input** (same page column, full content width), using Chakra primitives (`role="alert"`, red palette) for accessibility.
- Keep the **min-length hint** (single character for 3s) on the existing **toast** unless implementation shows the same layout bug; if it does, align it with the same inline pattern in a follow-up.
- Remove or stop using **`useListingNotFoundToast`** for the 404 path case; wire message state from **`FileBrowserPage`** (or a small derived hook) from the existing tree error + path.
- Optionally remove **`ListingToaster`** from **`main.tsx`** only if no remaining `listingToaster.create` callers exist.

## Capabilities

### New Capabilities

- _(none — behavior is covered by updates to existing specs)_

### Modified Capabilities

- `file-browser-listing-ui`: Clarify that **404 path-not-found** feedback MUST be readable and **MAY** use an **inline alert above the path field** instead of a toast; retire or narrow the “listing toast placement” requirement so it applies only where toasts remain (e.g. min-char hint).
- `file-browser-listing-ux`: Change “path not found” from **toast-only** to **toast or equivalent prominent inline notice** above the path input, with the same English copy intent.

## Impact

- **Frontend:** `apps/web/src/app/file-browser/` — `FileBrowserPage.tsx`, remove or narrow `useListingNotFoundToast.ts`, possibly `listing-toaster.tsx` / `main.tsx` / `useMinCharsHint.ts` depending on whether the toaster stays for hints.
- **Tests:** Update or replace tests that assert toast calls for 404; add tests for visible inline alert when `ListingRequestError` 404 + path.
- **API:** none.
