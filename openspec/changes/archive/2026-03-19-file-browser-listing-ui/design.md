## Context

The web app already has `fetchFileListing(path?)` calling `GET /api/listing` with a **relative** wire path. The API’s allowed root defaults to `process.cwd()`. This change adds the **file-browser** UI slice: default root listing, path input with debounce and keyboard commit, Chakra presentation.

## Goals / Non-Goals

**Goals:**

- On first load, fetch and display listing for **root** (no path or empty path).
- Path field: **300ms debounce** after last change before calling the API (reduces churn while typing).
- **Enter** and **Tab** on the path field trigger an **immediate** listing request for the current value (bypass remaining debounce), then default browser behavior for Tab (move focus).
- Use **Chakra UI** for layout, input, list, and folder/file affordances (icons or labels); **mobile-first** spacing and touch targets.
- **Vertical slice**: hooks + services + presentational components per AGENTS.md; **React Query** for server state.
- **Vitest + AAA** for hooks or debounce helper (web only unless api touched).

**Non-Goals:**

- Backend changes, absolute path support, or full-text search.
- Tree expand/collapse for nested fetch in this change (flat list of current directory only; optional follow-up).
- Replacing React Query with other data libraries.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Debounce | **300ms** `setTimeout` / `useDebouncedCallback` (or equivalent) | Matches user requirement; balances responsiveness vs API load. |
| Enter / Tab | **`keydown`**: Enter → flush + `refetch` / `queryClient.fetchQuery`; Tab → same flush + fetch, **`preventDefault` only if needed** — prefer **not** trapping Tab; use **Tab keydown** to flush debounce and trigger fetch, then allow focus move | User asked for both keys to “search”; Enter is standard; Tab: on `keydown` Tab, cancel debounce timer and run listing once, then default Tab navigation (no long-term focus trap). |
| Data layer | **React Query** `useQuery` with query key `['fileListing', path]` | Cached per path; refetch on explicit submit. |
| Path normalization in UI | Trim input; treat empty as root; **only forward slashes** in field (document in placeholder); reject or strip backslashes client-side optional | Aligns with API wire format. |
| Chakra components | `Input` (or `Field` + input), `Stack`/`VStack`, `List` or `Stack` of rows, `Text`, optional `Icon` / emoji fallback for folder vs file | Keeps bundle small; upgrade to icon set later if needed. |
| Listing component | Dedicated **`FileListingView`** (presentational) receiving `entries[]`, `isLoading`, `error` | Screaming Architecture; no fetch inside. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tab key conflicts with a11y | Only trigger fetch on Tab **keydown** without preventing default unless product requires; document in spec tests. |
| Double fetch (debounce + blur) | Cancel debounce timer on Enter/Tab/blur before immediate fetch. |
| Long paths on mobile | Input full width, horizontal scroll or `truncate` with title tooltip. |

## Migration Plan

- Ship behind existing app route; replace or augment `App` content to render file browser feature.

## Open Questions

- Whether clicking an entry navigates into a folder (future: set path to `entry.relativePath`).
