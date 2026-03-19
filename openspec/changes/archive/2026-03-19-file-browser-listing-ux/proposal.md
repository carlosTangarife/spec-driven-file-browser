## Why

The file browser layout does not feel fully responsive on wide viewports: content stays left-aligned with uneven horizontal space. Users also expect to narrow a directory listing by typing a short prefix (e.g. `app` matching `applications`, `apps`, `AppService`) without typing full folder names, while getting clear English feedback when paths are missing (404) or when they have not typed enough characters to search. This change improves layout symmetry, filtering rules, and user-facing error/ guidance messaging.

## What Changes

- **Layout**: Page shell uses symmetric horizontal spacing and responsive width so content is not stuck to one side on large screens (centered or full-bleed with consistent margins per breakpoint).
- **Name filter**: After the user has entered at least **3** characters in the path field, the **visible listing** filters entry names by **case-insensitive prefix match** against the current API listing (no new search API required). Fewer than 3 characters does not apply this filter (full listing for the resolved path remains visible).
- **Input limits**: Path field **maximum length 200** characters; input is capped or validated in the UI.
- **404 UX**: When the listing request returns **404**, show a **friendly message in English** (e.g. via Chakra **toast**), not only inline error text.
- **Guidance timer**: If the user has entered **exactly one character** and **3 seconds** pass with no further input, show **immediate English feedback** (toast or inline) that **at least 3 characters are needed** to use the name filter (wording must be clear and user-friendly).

## Capabilities

### New Capabilities

- `file-browser-listing-ux`: Responsive file browser shell, 200-character path input cap, optional prefix-based listing filter active from 3 characters, friendly English 404 handling with toast, and timed feedback when only one character was typed.

### Modified Capabilities

- (none — API contracts and path resolution behavior are unchanged; 404 remains HTTP 404 with existing payload.)

## Impact

- **apps/web**: `file-browser` slice — `FileBrowserPage`, `PathInput`, `FileListingView`, hooks (`useListingPathState`, `useFileListingQuery` or new filter helper), Chakra layout and **Toaster** usage; Vitest tests for new behaviors.
- **apps/api**: No change expected unless implementation discovers a need for clearer error bodies (optional; prefer client-side copy mapping 404 → friendly toast).
- **Dependencies**: Chakra UI toast/notification primitives already available or added at implementation time.
