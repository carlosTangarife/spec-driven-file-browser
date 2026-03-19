## Why

The file browser and path listing features work end-to-end, but several hot spots exceed **AGENTS.md** guidance (single responsibility, ~150-line files, thin composition roots, explicit exported types, low cyclomatic complexity). This change addresses **maintainability and consistency** without altering user-visible behavior.

## What Changes

- Refactor **`apps/web/src/app/file-browser/`** so `FileBrowserPage` and related code align with **one primary unit per file**, **pure error/label mapping in `lib/`**, and **hooks** for non-trivial local state (e.g. lazy tree expansion).
- Refactor **`apps/api/src/app/path-file-listing/`** to **deduplicate** shared resolution/stat validation between `list` and `getDirectoryTree`, keep the service **readable**, and preserve explicit **`Promise<…>`** return types on public methods.
- Add or extend **unit tests** where logic moves into new pure helpers or hooks (behavior unchanged).
- **No** API contract changes, **no** new HTTP routes, **no** UX behavior changes (**not** a breaking change).

## Capabilities

### New Capabilities

- `file-browser-implementation-quality`: Non-functional, structural requirements for the file-browser slice and the path-file-listing API slice so refactors stay aligned with **AGENTS.md** § *Code quality (mandatory)* and **Screaming Architecture**.

### Modified Capabilities

- *(none — product behavior and existing functional specs stay the same.)*

## Impact

- **Code**: `apps/web/src/app/file-browser/**` (especially `FileBrowserPage.tsx`, hooks, `lib/`), `apps/api/src/app/path-file-listing/**` (service and small extracted helpers).
- **Tests**: Vitest suites under `apps/web` and `apps/api` for touched modules.
- **Dependencies**: None added unless an existing internal pattern already used in the repo requires it (prefer none).
