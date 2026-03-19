## Context

`FileBrowserPage` uses `SimpleGrid` with `columns={{ base: 1, lg: 2 }}`: below `lg`, tree and preview stack vertically. Users on phones still struggle to notice the preview below the tree; a **modal** presents content immediately after file selection on narrow viewports.

## Goals / Non-Goals

**Goals:**

- On viewports **below `lg`**, file selection opens a **modal** with backdrop, showing the same preview data as desktop (loading/error/truncation).
- Provide a clear **close** control (button and/or backdrop click policy per Chakra defaults).
- **Playwright** coverage at mobile width for open + close + visible text.

**Non-Goals:**

- Changing API contracts, path rules, or tree expand/collapse behavior.
- Replacing desktop layout; no modal on `lg+` unless we later choose to (explicitly out of scope).

## Decisions

1. **Breakpoint** — Use Chakra’s **`lg`** (same as the two-column split) as the switch: `< lg` → modal, `>= lg` → inline `FileContentPreview` in the second column. **Rationale:** One source of truth for “desktop vs mobile” layout; matches existing grid.

2. **Component choice** — **Portal** + fixed **backdrop** + `role="dialog"` panel with Chakra **`CloseButton`**, plus **Escape** to dismiss. (Chakra v3 `Dialog.*` compound typings in this repo omit `children` on several slots; behavior matches the Dialog recipe: overlay, close control, `aria-label` on the dialog for the full path.) **Drawer** was considered out of scope for this change.

3. **State** — Reuse existing `selectedFilePath` and preview query; modal is **presentation only** (open when `selectedFilePath != null` and viewport is mobile). Closing modal clears selection **or** only closes UI while keeping selection — **Decision:** Closing the modal **clears `selectedFilePath`** so the tree is the single source of “what is open” and re-tapping the file reopens; avoids stale modal state. **Alternative considered:** keep selection and hide modal — rejected: user asked to “not block experience”; clearing matches “dismiss preview”.

4. **E2E** — `page.setViewportSize` to a width **below `lg`** (e.g. 390×844). Select a file under repo root that exists in CI (e.g. `package.json` like existing tests). Assert dialog role / text / close button.

5. **Modal title** — Split the selected **wire path** into **parent directory** (muted line) and **file name** (`Heading`) using a small pure helper in `file-browser/lib/`; root-level files show only the file name. Set `aria-label` on the dialog to `Preview: <wirePath>` for assistive tech and stable Playwright queries.

## Risks / Trade-offs

- **[Risk] Double preview on resize** — User resizes across `lg`; mitigated by derived open state from breakpoint + selection; optional `useEffect` to close modal when switching to desktop.
- **[Risk] Flaky e2e timing** — Mitigation: `expect` with retries, wait for network idle or preview text.

## Migration Plan

None (frontend-only).

## Open Questions

- Whether **Esc** must close the modal (Chakra Dialog typically does; assert in e2e if stable).
