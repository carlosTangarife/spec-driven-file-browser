## Context

`splitPathInput` today treats `parent/child` (no trailing `/`) as **list `parent`** + **name prefix `child`** for filtering. The file browser page uses the derived **listing wire path** for the **directory tree** anchor, so the tree loads the wrong folder unless the user adds a trailing `/`.

## Goals / Non-Goals

**Goals:**

- When the input contains at least one `/` and does **not** end with `/`, derive **`listingWirePath`** as the **full trimmed path** (no trailing slashes), with **`namePrefix`** empty, so listing and tree match the folder the user typed.
- Preserve **root-level** behavior: input **without** any `/` remains **root listing** with the whole string as **`namePrefix`** (filter when length ≥ 3), unchanged.
- **Directory rows**: one large **click** target for **expand/collapse**; **double-click** (or equivalent) for **navigate** / set path in the field.

**Non-Goals:**

- Server-side path guessing (e.g. probing file vs directory) for ambiguous last segments.
- Changing debounce duration (still 500ms in hook unless adjusted elsewhere).

## Decisions

| Decision | Rationale |
|----------|-----------|
| **Full path when `/` present and no trailing `/`** | Matches user expectation that `a/b` means “inside `b`” for browsing; aligns tree with typed path without requiring `/`. |
| **Keep root-only `namePrefix`** | Single-segment typing at root (`Documents`) still supports prefix filter without `/`. |
| **Row-level click = expand** | Chevron remains visual affordance but is not the only hit target; whole row toggles expand with **stopPropagation** only where needed to avoid double-firing with navigate. |
| **Double-click = navigate** | Preserves distinct action from single-click expand; document in UI copy. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users relied on “parent + prefix” for multi-segment filter | Product choice: browsing into the typed folder is preferred; document in changelog/spec. |
| Single-click on row toggles expand when user meant to select | Acceptable; navigate remains double-click per current pattern. |

## Migration Plan

Deploy with web only; no data migration.

## Open Questions

None.

## Code layout (target)

- **`apps/web/src/app/file-browser/lib/path-input.utils.ts`** — `splitPathInput` rules and tests.
- **`apps/web/src/app/file-browser/hooks/useListingPathState.ts`** — unchanged unless derived fields need renaming (only if tests require).
- **`apps/web/src/app/file-browser/ui/FileTreeView.tsx`** — row layout: full-width interactive area for expand; optional chevron as visual only or nested in same button region.
- **`apps/web/src/app/file-browser/FileBrowserPage.tsx`** — update hint text for tree interactions.
