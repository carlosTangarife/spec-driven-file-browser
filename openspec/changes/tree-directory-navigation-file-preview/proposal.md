## Why

Users need to **see folder structure** (not only a flat list) and **navigate by clicking** while staying aligned with the path input. They also need a **safe preview of file contents** when a file is selected. The current flat listing API and list UI do not expose a nested tree nor file body; this change adds those capabilities while keeping path rules and Screaming Architecture.

## What Changes

- **Backend**: New **directory tree** response for a given relative path: nested nodes for subfolders and files to a **default depth of at least three** configurable levels under that path (same allowed-root and traversal rules as existing listing).
- **Backend**: New **file content preview** operation for a **file** path (text-oriented, size-capped, clear errors for non-files / binary / oversize).
- **Frontend**: **Tree view** driven by the tree API; **clicking a folder** updates the path input and refetches the tree; **changing the path in the input** refetches the tree for that path; **selecting a file** loads and shows **preview content** (presentational panel).
- **No breaking change** to existing flat `GET /listing` contract unless explicitly extended in implementation (prefer additive routes/query params).

## Capabilities

### New Capabilities

- **`directory-tree-listing`**: HTTP contract and server behavior for returning a **nested tree** of files and directories under a relative wire path, with **minimum supported depth of three** levels below the anchor path and configurable depth parameter.
- **`file-content-preview`**: HTTP contract and server behavior for returning **bounded text preview** of a file under the allowed root (encoding, limits, error cases).

### Modified Capabilities

- **`file-browser-listing-ui`**: Extend the file browser UI with **tree navigation**, **folder click → path input sync**, **input-driven tree refresh**, and **file content preview** area, still using Chakra and presentational components per existing rules.

## Impact

- **`apps/api`**: New or extended routes under feature folders `path-file-listing/` (tree) and a new **`path-file-content/`** slice (preview), or an equivalent split that preserves Screaming Architecture (see `design.md`).
- **`apps/web`**: `file-browser/` feature — new hooks, services, and UI for tree + preview.
- **Shared types**: Optional Zod schemas / types for tree nodes and preview payloads in the feature or `libs/shared` if reuse is justified.
