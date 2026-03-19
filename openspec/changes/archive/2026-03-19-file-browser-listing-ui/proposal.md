## Why

The path-listing API is in place, but users need a **first-class UI** to browse the allowed root: see folders and files at a glance, navigate by path, and trigger listing updates without manually calling the API. A **responsive path field** (debounced + explicit submit) keeps the experience fluid and aligned with mobile-first and Chakra UI conventions.

## What Changes

- **React feature UI** in `apps/web`: default view loads the **listing for the allowed root** (empty relative path) on first render.
- **Controlled path input** with **300ms debounce** after the user stops typing; value maps to the API’s relative wire path.
- **Enter** and **Tab** on the path input trigger an **immediate** listing request to the backend (no need to wait for debounce), then normal focus behavior for Tab.
- **Rendering** of listing results with **Chakra UI** (accessible list, clear folder vs file affordances); prefer Chakra primitives and, where helpful, small composed patterns suitable for hierarchical or flat lists.
- **Vitest + AAA** unit tests for new hooks/services touched by this change (per workspace rules).

## Capabilities

### New Capabilities

- `file-browser-listing-ui`: Web UI that consumes `GET /api/listing`, shows root by default, debounced path input (300ms), Enter/Tab to submit listing request, and Chakra-based rendering of entries.

### Modified Capabilities

- _(none — API contract unchanged; optional future delta if path-file-listing gains query params.)_

## Impact

- **`apps/web`**: `file-browser` vertical slice (components, hooks, services); may extend `file-listing.service` and add React Query hooks.
- **Dependencies**: Existing Chakra UI, React Query, `fetchFileListing` contract.
- **No backend changes** required for this change unless tasks discover a gap (none expected).
