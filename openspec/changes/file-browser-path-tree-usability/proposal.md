## Why

Typing a nested path **without** a trailing slash (e.g. `apps/web`) currently drives the **tree** from the **parent** folder only, so the tree does not show the contents of the folder the user meant to open. Separately, **expand** is only easy to hit on the small chevron; users expect the **whole folder row** to toggle expansion.

## What Changes

- **Frontend**: Derive the **listing/tree wire path** from the path input so that when the value contains `/` and does **not** end with `/`, the application SHALL use the **full trimmed path** (normalized) as the directory anchor for listing and tree requests—same outcome as if the user had typed a trailing slash—without requiring a final `/`.
- **Frontend**: Make the **entire directory row** (or a single full-width hit target) activate **expand/collapse**; keep **navigate** (e.g. open folder in the path field) on a distinct gesture such as **double-click** so expand does not require clicking only the icon.

## Capabilities

### New Capabilities

_(none — behavior is an adjustment to existing UI rules.)_

### Modified Capabilities

- **`file-browser-listing-ui`**: Update path-input derivation for nested segments without trailing slash; update tree row interaction so expand is not confined to a small icon-only control.

## Impact

- **`apps/web/src/app/file-browser/`**: `path-input.utils.ts`, `useListingPathState.ts` (if needed), `FileTreeView.tsx`, `FileBrowserPage.tsx` helper text; **Vitest** updates for `splitPathInput` and any hook tests.
- **No API contract change**; server already accepts directory wire paths with or without a redundant trailing slash when the path identifies a directory.
