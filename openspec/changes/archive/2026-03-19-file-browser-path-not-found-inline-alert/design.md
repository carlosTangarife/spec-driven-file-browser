## Context

The file browser uses **`listingToaster`** (Chakra v3 / Ark **`Toaster`**) for “path not found” (**`ListingRequestError` 404** from the tree query) via **`useListingNotFoundToast`**. The toaster’s rendered region can end up with **collapsed horizontal width** in the live layout, producing a **tall red strip** with vertically wrapped text—unreadable and failing the intent of **“Listing toast placement”** in `file-browser-listing-ui`.

**Current touchpoints:** `apps/web/src/main.tsx` mounts **`ListingToaster`**; **`FileBrowserPage`** calls **`useListingNotFoundToast(treeError, deferredListingPath)`**; copy matches the broken toast in the screenshot.

## Goals / Non-Goals

**Goals:**

- Show **404 path-not-found** feedback as a **readable, accessible** message **above the path field**, consistent with the page’s content width.
- Preserve **deduplication** behavior (do not spam on every render): today **`useListingNotFoundToast`** uses a ref keyed by path/error; replicate with stable React state or a small hook.
- Keep **min-character hint** on **`listingToaster`** initially; if the same width bug appears, treat as a separate change.

**Non-Goals:**

- Redesigning Chakra/Ark toaster globally or upgrading the design system for this fix.
- Changing API or tree **404 fallback** rules (`useDirectoryTreeQuery` / `fetchDirectoryTreeWithFallback`).

## Decisions

1. **Inline alert instead of toast for 404 anchor**  
   **Rationale:** Matches the user’s fallback (“div above the path”), avoids portal/positioner width issues, and aligns with existing **`treeErrorMessage`** inline pattern for non-404 errors.  
   **Alternative considered:** Patch **`ToastRoot`** / **`Toaster`** styles and portal placement—fragile across Chakra patches and harder to verify.

2. **Placement: directly above `PathInput` inside `FileBrowserPage`**  
   **Rationale:** Single column, same **`Container`** as the title—guaranteed readable width.  
   **Alternative:** New presentational **`PathNotFoundAlert`** in **`file-browser/ui/`** if JSX grows beyond a thin block; prefer extraction only if the page exceeds clarity thresholds.

3. **Dedup logic**  
   **Rationale:** Reuse the same rules as **`useListingNotFoundToast`**: clear when error clears; show once per distinct **(404, path)** until path or error changes. Implement via **`useMemo` + `useEffect`** or a dedicated **`useListingPathNotFoundMessage.ts`** hook with explicit return type.

4. **Remove 404 path from toaster**  
   **Rationale:** Eliminates the broken UI path entirely. **`listingToaster`** remains for **`useMinCharsHint`**.

## Risks / Trade-offs

- **[Risk] Inline alert pushes content down** → **Mitigation:** Acceptable for an error state; message is short. Dismissal is implicit when the user fixes the path and the query succeeds.
- **[Risk] E2E or unit tests assert toaster calls for 404** → **Mitigation:** Update tests to assert **`role="alert"`** and copy near the path field.

## Migration Plan

Not applicable (web-only behavior change; no data migration).

## Open Questions

- None for the 404 case; min-char toast can be revisited if it reproduces the strip layout.

## Code layout (target)

| Area | Path |
|------|------|
| Page composition | `apps/web/src/app/file-browser/FileBrowserPage.tsx` |
| Optional UI extract | `apps/web/src/app/file-browser/ui/PathNotFoundAlert.tsx` (only if needed for size/clarity) |
| Hook (optional) | `apps/web/src/app/file-browser/hooks/useListingPathNotFoundMessage.ts` (derived string + reset rules) |
| Remove / narrow | `apps/web/src/app/file-browser/hooks/useListingNotFoundToast.ts` (delete or stop exporting if unused) |
| Tests | `apps/web/src/app/file-browser/**/*.spec.ts` affected by 404 feedback; Playwright only if an e2e asserted toast |

**API:** no changes under `apps/api/`.
