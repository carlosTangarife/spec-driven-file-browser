## ADDED Requirements

### Requirement: File browser slice follows AGENTS code-quality rules

The implementation under `apps/web/src/app/file-browser/` SHALL comply with **AGENTS.md** § *Code quality (mandatory)* and § *React rules*: vertical slice only, named exports, presentational UI separated from orchestration, no raw `fetch` in presentational components, and files SHOULD stay within the ~150-line guideline by splitting when needed.

#### Scenario: Page is a thin composition root

- **WHEN** reviewing `FileBrowserPage.tsx` after this change
- **THEN** it primarily composes hooks and presentational components and does not embed large blocks of error-mapping or tree-loading logic that belong in `lib/` or `hooks/`

#### Scenario: Error mapping for preview is testable

- **WHEN** mapping preview-related errors to display messages
- **THEN** the mapping logic lives in a pure module under `file-browser/lib/` (or equivalent) with explicit types and is covered by unit tests where non-trivial

### Requirement: Path file listing service stays cohesive and DRY

The NestJS code under `apps/api/src/app/path-file-listing/` SHALL avoid duplicating the same resolution, root containment, and stat error handling between public methods; shared steps SHALL be factored into private helpers or colocated modules within that feature folder. Public service methods SHALL retain explicit `Promise<…>` return types.

#### Scenario: Shared directory resolution

- **WHEN** both `list` and `getDirectoryTree` validate a wire path
- **THEN** repeated logic for resolving the absolute path, enforcing allowed root, and translating `stat` failures is consolidated in one place within the feature

#### Scenario: Tests remain green

- **WHEN** `npm test` runs for `api` and `web`
- **THEN** all tests pass with no change to externally observable API behavior described in existing functional specs
