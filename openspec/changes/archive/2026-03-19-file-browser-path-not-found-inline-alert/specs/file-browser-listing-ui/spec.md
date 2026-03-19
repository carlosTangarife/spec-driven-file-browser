## MODIFIED Requirements

### Requirement: Listing wire path for nested input without trailing slash

When the trimmed path input contains at least one `/` and does **not** end with `/`, the application SHALL first derive a **primary listing wire path** as the full trimmed path with trailing slashes removed and SHALL request the **directory tree** (and listing when applicable) for that path. If that request returns **HTTP 404** (path not found as a directory), the application SHALL **fall back**: it SHALL derive the **parent** wire path as all segments before the last `/` and SHALL treat the **last segment** as a **name prefix** for filtering **immediate** children of that parent. The application SHALL NOT show a **false “path not found”** message when the fallback yields a successful tree or listing response.

#### Scenario: Complete nested directory without final slash still works

- **WHEN** the user types `apps/web` (no trailing slash), the full path exists as a directory, and debounce or submit applies
- **THEN** listing and tree requests SHALL succeed using wire path `apps/web` without requiring fallback

#### Scenario: Partial segment under a parent uses fallback

- **WHEN** the user types `apps/a` (no trailing slash), the directory `apps/a` does **not** exist, but `apps` exists and contains entries whose names start with `a`
- **THEN** the application SHALL fall back to wire path `apps` and SHALL filter (or equivalent) so that entries such as `application` and `apple` MAY appear, and the UI SHALL NOT show a false **not found** message solely because `apps/a` returned 404

#### Scenario: Trailing slash unchanged

- **WHEN** the user types `apps/web/`
- **THEN** the listing wire path SHALL be `apps/web` and the name prefix SHALL be empty, and fallback SHALL NOT apply for that shape

### Requirement: Listing toast placement

Toast notifications used for **listing-related** messages that are still delivered via the **toast** stack (for example the **minimum-character** hint) SHALL be placed **at the bottom** of the viewport and **centered horizontally**. Toast content SHALL use a layout wide enough to read comfortably (the toast SHALL NOT be confined to a narrow strip at a screen corner).

#### Scenario: Hint toast is bottom-centered

- **WHEN** a listing-related **hint** toast is shown (e.g. more characters needed for name filtering)
- **THEN** the toast appears in the **bottom** region, **centered** horizontally, with sufficient width for the title and description

## ADDED Requirements

### Requirement: Path not found inline alert

When the directory **tree** request for the current path anchor fails with **HTTP 404** after any documented fallback, and the application determines the user should see **path not found** feedback, the application SHALL show a **short, friendly English message** in an **inline** region **immediately above the path input**, spanning the **main content width** (within the page shell), with **`role="alert"`** (or equivalent assistive semantics). The message SHALL be readable at typical viewports (MUST NOT rely on a narrow vertical strip layout).

#### Scenario: Missing directory shows readable alert

- **WHEN** the tree request for the current anchor returns **HTTP 404** and no successful fallback applies
- **THEN** the user sees the English **path not found** message above the path field, with sufficient width to read title and explanation in one or two lines on a mobile-width viewport
