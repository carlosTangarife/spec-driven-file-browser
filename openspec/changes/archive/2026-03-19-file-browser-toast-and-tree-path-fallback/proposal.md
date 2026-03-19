## Why

Listing-related toasts use a **top-end** placement and read as a **narrow strip**, which is hard to notice and feels misaligned. Separately, treating every nested path **without** a trailing `/` as a **single directory wire path** breaks **incremental typing** (e.g. `apps/a` while searching for `apps/application`): the API correctly returns **404** for a non-existent folder `apps/a`, but the user expects **matches under** `apps` whose names **start with** `a`. The UI SHALL combine **open-folder** behavior for complete paths with **prefix exploration** when the full path does not exist yet.

## What Changes

- **Frontend**: Configure the shared **listing toaster** so notifications (404, hints) appear **bottom-centered** with a **readable width** (not squeezed to the corner).
- **Frontend**: For nested input **without** a trailing `/`, the application SHALL **first** request the **directory tree** (and listing) for the **full trimmed path**; when that request returns **404**, the application SHALL **fall back** to the **parent wire path** and treat the **last segment** as a **name prefix** filter on immediate children (so partial segments like `a` still match).
- **Frontend**: When applying **name prefix** filtering for that fallback, the filter SHALL apply for prefix length **≥ 1** for nested parent+segment shapes (root-only rules MAY keep a higher minimum where already specified).
- **Frontend**: A **single path segment** typed **without** `/` (e.g. `apps`) SHALL use that string as the **listing/tree wire path** immediately after debounce or submit—**not** “root + name prefix”—so the user does **not** need a trailing `/` to open a top-level folder that exists.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- **`file-browser-listing-ui`**: Toast placement/readability; tree/listing path resolution with **404 → parent + prefix** fallback; clarify prefix filtering for short nested prefixes.

## Impact

- **`apps/web/src/app/file-browser/`**: `listing-toaster.tsx`, `useListingNotFoundToast` / tree query path resolution (`useDirectoryTreeQuery` or page-level composition), `path-input.utils.ts` (helpers for primary vs fallback), optional `filterEntriesByNamePrefix` or parallel tree-node filter; **Vitest** for pure path + query behavior.
- **No API change**; uses existing listing/tree endpoints and HTTP status codes.
