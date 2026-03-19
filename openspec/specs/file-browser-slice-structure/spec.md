# file-browser-slice-structure

Canonical spec (synced from change `file-browser-slice-restructure`).

## Requirements

### Requirement: File browser slice folder layout matches AGENTS.md

The web application’s **`file-browser`** feature code under `apps/web/src/app/file-browser/` SHALL be organized into subfolders that reflect **Clean-style boundaries** as described in **AGENTS.md** (React feature slice structure): at minimum **`lib/`** for pure/path logic without React, **`ui/`** for presentational components only, **`hooks/`** for hooks and their co-located tests, and **`api/`** for HTTP client, response validation, and listing-related toaster wiring. The composition screen (`FileBrowserPage` or equivalent) SHALL remain at the feature folder root or be clearly the single composition entry; a barrel **`index.ts`** SHALL re-export the feature’s public API for consumers.

#### Scenario: Reviewer inspects the slice

- **WHEN** a developer opens `apps/web/src/app/file-browser/`
- **THEN** they find the subfolders `lib/`, `ui/`, `hooks/`, and `api/` present with files placed according to their role (pure logic in `lib/`, Chakra-only presentation in `ui/`, orchestration in `hooks/`, fetch/Zod/toaster in `api/`)

### Requirement: No behavioral regression from restructuring

Refactoring file locations and import paths SHALL **not** change user-visible behavior of the file browser (listing, path input, debounce, filters, toasts, error handling) or the HTTP contract with the API.

#### Scenario: Tests after restructure

- **WHEN** the restructure is complete
- **THEN** existing Vitest tests for the file browser slice pass without weakening assertions, and `npm test` (or `nx test web`) succeeds
