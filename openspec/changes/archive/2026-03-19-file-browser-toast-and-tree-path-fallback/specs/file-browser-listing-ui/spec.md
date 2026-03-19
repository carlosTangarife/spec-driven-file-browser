## ADDED Requirements

### Requirement: Single-segment path without slash

When the trimmed input contains **no** `/` and is **non-empty**, the application SHALL set the **listing wire path** to that trimmed string and SHALL use an **empty** **name prefix**, so listing and tree requests target that directory under the allowed root **without** requiring a trailing `/`.

#### Scenario: Top-level folder name without slash

- **WHEN** the user types `apps` (no `/`) and debounce or submit applies
- **THEN** listing and tree requests SHALL use wire path `apps` and SHALL NOT keep **root** with a separate **name prefix** of `apps`

### Requirement: Listing toast placement

Toast notifications used for **listing-related** messages (including “path not found” and optional hints) SHALL be placed **at the bottom** of the viewport and **centered horizontally**. Toast content SHALL use a layout wide enough to read comfortably (the toast SHALL NOT be confined to a narrow strip at a screen corner).

#### Scenario: Error toast is bottom-centered

- **WHEN** a listing-related toast is shown (e.g. path not found)
- **THEN** the toast appears in the **bottom** region, **centered** horizontally, with sufficient width for the title and description

### Requirement: Prefix filtering for nested fallback

When the application applies **name prefix** filtering as part of the **404 fallback** described above, the filter SHALL apply when the last segment has length **≥ 1** (case-insensitive prefix match on child **name**).

#### Scenario: Single-character prefix under nested parent

- **WHEN** fallback uses parent `apps` and last segment `a`
- **THEN** immediate children whose names start with `a` SHALL be eligible to appear regardless of whether the prefix length is below three characters

## MODIFIED Requirements

### Requirement: Listing wire path for nested input without trailing slash

When the trimmed path input contains at least one `/` and does **not** end with `/`, the application SHALL first derive a **primary listing wire path** as the full trimmed path with trailing slashes removed and SHALL request the **directory tree** (and listing when applicable) for that path. If that request returns **HTTP 404** (path not found as a directory), the application SHALL **fall back**: it SHALL derive the **parent** wire path as all segments before the last `/` and SHALL treat the **last segment** as a **name prefix** for filtering **immediate** children of that parent. The application SHALL NOT show a **“path not found”** toast when the fallback yields a successful tree or listing response.

#### Scenario: Complete nested directory without final slash still works

- **WHEN** the user types `apps/web` (no trailing slash), the full path exists as a directory, and debounce or submit applies
- **THEN** listing and tree requests SHALL succeed using wire path `apps/web` without requiring fallback

#### Scenario: Partial segment under a parent uses fallback

- **WHEN** the user types `apps/a` (no trailing slash), the directory `apps/a` does **not** exist, but `apps` exists and contains entries whose names start with `a`
- **THEN** the application SHALL fall back to wire path `apps` and SHALL filter (or equivalent) so that entries such as `application` and `apple` MAY appear, and the UI SHALL NOT show a false **not found** toast solely because `apps/a` returned 404

#### Scenario: Trailing slash unchanged

- **WHEN** the user types `apps/web/`
- **THEN** the listing wire path SHALL be `apps/web` and the name prefix SHALL be empty, and fallback SHALL NOT apply for that shape
