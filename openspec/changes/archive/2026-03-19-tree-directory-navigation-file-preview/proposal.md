## Why

Users need to **see folder structure** (not only a flat list) and **navigate by clicking** while staying aligned with the path input. They also need a **safe preview of file contents** when a file is selected. The current flat listing API and list UI do not expose a nested tree nor file body; this change adds those capabilities while keeping path rules and Screaming Architecture.

## What Changes

- **Backend**: The API SHALL expose a new **directory tree** response for a given relative path: nested nodes for subfolders and files to a **default depth of at least three** configurable levels under that path (same allowed-root and traversal rules as existing listing). Clients MAY use **shallow** depth (e.g. **1**) for lazy expansion.
- **Backend**: **Flat listing and tree** SHALL omit documented **VCS/metadata** directory names from immediate children (see delta spec **`path-file-listing`** in this change).
- **Backend**: The API SHALL expose a **file content preview** operation for a **file** path (text-oriented, size-capped, clear errors for non-files / binary / oversize).
- **Frontend**: The web app SHALL render a **tree view** driven by the tree API with **expand/collapse** (lazy load when using shallow server depth) and a **separate navigate gesture** (e.g. double-click) to set the path input; **changing the path in the input** SHALL refetch the tree for that path (debounced/deferred as specified); **selecting a file** SHALL load and show **preview content** (presentational panel).
- **No breaking change** to existing flat `GET /listing` contract unless explicitly extended in implementation (prefer additive routes/query params).

## Capabilities

### New Capabilities

- **`directory-tree-listing`**: HTTP contract and server behavior for returning a **nested tree** of files and directories under a relative wire path, with **minimum supported depth of three** levels below the anchor path and configurable depth parameter.
- **`file-content-preview`**: HTTP contract and server behavior for returning **bounded text preview** of a file under the allowed root (encoding, limits, error cases).

### Modified Capabilities

- **`path-file-listing`**: Add normative **omission rules** for VCS/metadata directory names in **flat** listing (and shared with tree).
- **`file-browser-listing-ui`**: Extend the file browser UI with **tree navigation** (expand vs navigate), **input-driven tree refresh**, **lazy subtree load** when using shallow API depth, and **file content preview** area, still using Chakra and presentational components per existing rules.

## Impact

- **`apps/api`**: New or extended routes under feature folders `path-file-listing/` (tree) and a new **`path-file-content/`** slice (preview), or an equivalent split that preserves Screaming Architecture (see `design.md`).
- **`apps/web`**: `file-browser/` feature — new hooks, services, and UI for tree + preview.
- **Shared types**: Optional Zod schemas / types for tree nodes and preview payloads in the feature or `libs/shared` if reuse is justified.
