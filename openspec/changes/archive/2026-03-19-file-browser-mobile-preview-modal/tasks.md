## 1. Web UI — mobile modal preview

- [x] 1.1 Add responsive detection (e.g. Chakra `useBreakpointValue` or theme breakpoint) for **below `lg`** vs **`lg`+** in `FileBrowserPage` (or a small dedicated hook under `file-browser/hooks/` if it keeps the page thin).
- [x] 1.2 Below `lg`: when `selectedFilePath` is set, render **`FileContentPreview`** inside a Chakra **Dialog** (or equivalent) with backdrop, title region if needed, and a **close** button; wire close to clear `selectedFilePath` per **design.md**.
- [x] 1.3 Below `lg`: hide or omit the inline second-column preview stack so preview is **only** shown in the modal (avoid duplicate content).
- [x] 1.4 At `lg` and above: keep the current **inline** two-column layout; do not show the modal for the primary preview flow.
- [x] 1.5 Optional: on breakpoint crossing from mobile to desktop, close modal and rely on inline preview so layout stays consistent.
- [x] 1.6 Modal **title**: show **parent wire path** (muted) + **file name** (heading); `aria-label`=`Preview: <wirePath>`; pure helper + Vitest.

## 2. Unit tests (web)

- [x] 2.1 Add or extend **Vitest** tests for any new hook or breakpoint helper (AAA) — only if non-trivial logic is extracted; otherwise document why tests remain at e2e level. _(No new hook: `useBreakpointValue` is used inline in `FileBrowserPage`; behavior covered by Playwright mobile + existing Vitest for preview services.)_
- [x] 2.2 **Vitest** for `splitWirePathForPreviewTitle` (`preview-dialog-title.utils.spec.ts`) — root file vs nested path.

## 3. End-to-end (Playwright)

- [x] 3.1 Extend `apps/web-e2e` (e.g. `file-browser.spec.ts`): set **mobile viewport** (width &lt; `lg`), navigate tree to a known text file (e.g. `package.json` at repo root), assert modal/preview content is **visible**.
- [x] 3.2 Assert **close** dismisses the modal (and that preview is no longer obstructing the tree).

## 4. Verification

- [x] 4.1 Run `pnpm run verify` and `pnpm exec nx e2e web-e2e`; fix until green.
