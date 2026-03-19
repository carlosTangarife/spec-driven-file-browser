## Context

`listingToaster` uses `placement: 'top-end'`. Tree queries use a single **wire path** from `splitPathInput`. Full nested paths without a trailing slash work for **existing** directories (e.g. `apps/web`) but produce **404** while the user is still typing a **prefix** (e.g. `apps/a`).

## Goals / Non-Goals

**Goals:**

- Bottom **center** (or equivalent) placement for listing toasts; avoid a **narrow** corner layout—use container `maxWidth` / padding on toast content if needed.
- **Two-step resolution** for nested input without trailing `/`: (1) `GET` tree for **full** path; (2) on **404**, fetch tree for **parent** path with **depth=1** and **filter** child nodes by **case-insensitive prefix** = last segment (length ≥ 1).
- **Do not** show a misleading **“path not found”** toast when the **fallback** succeeds.
- **Do** show 404 toast only when **both** primary and fallback fail (or non-404 errors).

**Non-Goals:**

- Server-side fuzzy search or multi-level prefix matching beyond immediate children.
- Changing allowed-root or traversal rules on the API.

## Decisions

| Decision | Rationale |
|----------|-----------|
| **404-triggered fallback** | Distinguishes `apps/web` (exists → 200) from `apps/a` (no dir → 404 → treat as `apps` + prefix `a`) without requiring a trailing `/` for every case. |
| **Suppress toast on successful fallback** | Avoid false “not found” when matches exist under the parent. |
| **`placement: 'bottom'`** (or Chakra’s bottom-center equivalent) | Matches product ask; verify against `@chakra-ui/react` `createToaster` supported placements. |
| **Prefix length ≥ 1 in nested fallback** | User types single-letter folder prefixes; root listing MAY retain stricter min length if spec keeps it. |
| **Single segment = directory wire path** | `apps` without `/` maps to `listingWirePath === 'apps'` (not root + filter). Removes the old root **namePrefix** behavior for one segment so tree/listing queries fire without typing `apps/`. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Extra request on every 404 for typos | Acceptable; cache React Query by key; only fallback on 404. |
| `apps/web` typo returns 404 then shows filtered `apps` + `web` | Acceptable exploration UX; user can correct path. |
| Loss of one-segment “root name prefix” filter | Tree/listing now open `apps` as a path; old root+prefix behavior removed (see **Single segment** decision). |

## Migration Plan

Web-only deploy; no migration.

## Open Questions

None.

## Code layout (target)

- **`apps/web/src/app/file-browser/api/listing-toaster.tsx`** — toaster `placement`, optional width on `ToastRoot` / inner `Box`.
- **`apps/web/src/app/file-browser/hooks/useListingNotFoundToast.ts`** — only fire when path is “really” not found (coordinate with query state if needed).
- **`apps/web/src/app/file-browser/lib/path-input.utils.ts`** — export helpers: e.g. `parseNestedPathForTree(raw)` → `{ primaryWirePath, parentWirePath, lastSegment }` for fallback.
- **`apps/web/src/app/file-browser/hooks/useDirectoryTreeQuery.ts`** (and/or **`FileBrowserPage.tsx`**) — implement fetch + 404 fallback + filtered nodes; keep **Screaming Architecture** inside `file-browser/`.
