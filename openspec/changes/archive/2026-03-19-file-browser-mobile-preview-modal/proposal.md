## Why

On small viewports the tree and preview share a single column, but the **preview** is easy to miss (below the fold or perceived as “off to the side”), so users do not reliably see file content after tapping a file. Showing the preview in a **full-width modal** with an **overlay** and an explicit **close** action makes the mobile flow obvious and avoids blocking navigation.

## What Changes

- **Web (`apps/web`)**: On **narrow** viewports (below the `lg` breakpoint, aligned with the existing `SimpleGrid` split), selecting a **file** in the tree opens the same preview content inside a **modal** (dialog) with backdrop overlay and a visible **close** control. The modal **title** shows the **path context** (parent directory wire path) and the **file name** (primary heading). At **`lg` and above**, behavior stays **inline** in the existing two-column layout.
- **E2E (`apps/web-e2e`)**: Playwright tests at a **mobile viewport** that assert: selecting a file opens the modal, preview text is visible, closing the modal returns to the tree without breaking selection rules.

## Capabilities

### New Capabilities

- _(none — delta spec extends **`file-browser-listing-ui`**.)_

### Modified Capabilities

- **`file-browser-listing-ui`**: Add normative requirements for **mobile modal preview** (overlay, close) and clarify that **desktop** keeps inline preview; extend acceptance with **Playwright** mobile scenarios.

## Impact

- **Code**: `apps/web/src/app/file-browser/` — primarily `FileBrowserPage.tsx` and possibly small presentational wrappers; reuse `FileContentPreview` via props (no `fetch` in dumb components).
- **Tests**: `apps/web-e2e` — new or extended specs; Vitest unchanged unless a tiny pure helper is extracted.
- **API**: None.
