# file-browser-listing-ui

Canonical spec (synced from change `file-browser-listing-ui`).

## Purpose

Define the web **file browser** UI: path input, directory listing, loading/error behavior, and (when extended) tree navigation and file preview—using Chakra and presentational components.
## Requirements
### Requirement: Initial load lists allowed root

The web application SHALL request a directory listing for the **root** (empty relative path) when the file browser view first mounts, and SHALL render the result using Chakra UI.

#### Scenario: User opens the file browser

- **WHEN** the user loads the file browser view
- **THEN** the application issues a listing request with no path (or empty path) and shows a loading state until the response completes

#### Scenario: Root listing succeeds

- **WHEN** the root listing request succeeds
- **THEN** the UI displays each entry with name and a clear distinction between file and directory (e.g. label, icon, or badge)

### Requirement: Path input with debounced listing

The web application SHALL provide a text input for the **relative wire path** (forward slashes under the allowed root). After the user stops typing for **300 milliseconds**, the application SHALL request a listing for the current input value (empty means root).

#### Scenario: User types a path and pauses

- **WHEN** the user changes the path input and does not type for 300ms
- **THEN** the application requests a listing for the trimmed path value and updates the list when the response returns

### Requirement: Enter and Tab trigger immediate listing

The web application SHALL treat **Enter** and **Tab** on the path input as an **immediate** listing request for the current input value, without waiting for the remainder of the debounce delay.

#### Scenario: User presses Enter

- **WHEN** the user presses Enter while focus is in the path input
- **THEN** the application immediately requests a listing for the current trimmed value and the default debounce timer for that keystroke SHALL NOT delay this request

#### Scenario: User presses Tab

- **WHEN** the user presses Tab while focus is in the path input
- **THEN** the application immediately requests a listing for the current trimmed value before focus moves according to normal tab order

### Requirement: Loading and error states

The web application SHALL show loading and error feedback for listing requests (e.g. Chakra `Spinner` or skeleton, and an error message region).

#### Scenario: Listing fails

- **WHEN** the listing request fails (network or HTTP error)
- **THEN** the UI shows an error state and does not pretend the previous list is still valid for the new path unless explicitly kept by design

### Requirement: Presentational listing and tests

Listing rows SHALL be implemented as presentational components that receive data via props. New or changed hooks and services for this feature SHALL have **Vitest** unit tests using the **AAA** pattern; `npm test` for the web project SHALL pass before the change is considered implemented.

#### Scenario: Tests cover debounce or submit behavior

- **WHEN** implementation includes debounce or keyboard submit logic
- **THEN** at least one unit test documents expected timing or immediate submit behavior using Arrange–Act–Assert

### Requirement: Directory tree view

The web application SHALL render directory contents as a **tree** (nested outline or expandable rows) backed by the **directory tree** API for the current path anchor, using Chakra UI for layout and accessibility. The view SHALL distinguish **files** and **directories** at every nested level returned by the API.

#### Scenario: Tree loads with path

- **WHEN** the file browser has a current relative path (including empty for root) and the tree request succeeds
- **THEN** the UI displays nested nodes matching the API tree at least up to the depth returned by the server

### Requirement: Expand/collapse vs directory navigation

The tree SHALL support **expanding and collapsing** directory nodes without changing the current path when the user activates a **primary click** on the **directory row** (full-row or equivalent large hit target). A **chevron** or similar icon MAY appear but SHALL NOT be the only clickable region for expand/collapse. **Navigating** to a directory (updating the **path input** and fetching the tree for that anchor) SHALL occur on a distinct gesture from expand-only interaction (e.g. **double-click** on the directory row or an explicit “open” action), documented in the UI implementation.

#### Scenario: Row click expands without changing path

- **WHEN** the user activates a **single-click** on the directory row (outside any documented navigate-only control) to toggle expansion
- **THEN** the subtree loads or toggles visibility per lazy-load rules and the **path input** value SHALL remain unchanged unless a separate navigate gesture occurs

#### Scenario: Navigate gesture updates path and refetches tree

- **WHEN** the user performs the documented **navigate** gesture on a directory node
- **THEN** the path input shows that directory’s wire path and a **fresh tree request** runs for that path (subject to debouncing rules below)

### Requirement: Lazy-loaded subtree

When the UI uses **shallow** tree requests (e.g. **depth=1**), expanding a directory whose children were not yet loaded SHALL trigger a **tree fetch** for that directory path so nested rows can be rendered. Cached data MAY be reused per React Query (or equivalent) policy.

#### Scenario: First expand loads children

- **WHEN** the user expands a directory node that has no loaded children
- **THEN** the application requests the tree for that directory’s path and renders the returned children when the response arrives

### Requirement: Path input drives tree refresh

When the path input changes and the application performs a **listing or navigation action** consistent with existing debounce and Enter/Tab rules, the application SHALL request the **directory tree** for the trimmed path (empty means root) and SHALL refresh the tree view when the response arrives.

#### Scenario: User types a deeper path

- **WHEN** the user edits the path input and the debounced or immediate submit behavior fires per existing rules
- **THEN** the application requests the tree for that path and updates the tree view accordingly

### Requirement: Input responsiveness for tree fetches

Path-driven **tree** fetches SHALL use the same **debounced** path resolution as listing where applicable. The path value driving tree queries SHALL be **deferred** from the raw input (e.g. `useDeferredValue` or equivalent) so typing stays responsive. Tree list hooks SHALL configure a **non-zero** `staleTime` for directory-tree queries unless a documented exception applies.

#### Scenario: Rapid typing does not spam tree requests

- **WHEN** the user types quickly in the path input without committing a navigation
- **THEN** the application SHALL NOT issue a tree request for every intermediate keystroke beyond what debounce/defer policy allows

### Requirement: File selection shows content preview

When the user **selects a file** node in the tree (or equivalent control), the application SHALL request **file content preview** from the API for that file path and SHALL display the returned text in a dedicated **preview** region (with loading and error states). The preview region SHALL be a **presentational** component receiving data via props from hooks/services.

#### Scenario: User selects a text file

- **WHEN** the user selects a file and the preview request succeeds
- **THEN** the preview area shows the text content (or a clear empty state) without embedding `fetch` inside the dumb preview component

#### Scenario: Preview fails

- **WHEN** the preview request fails (HTTP error, binary rejection, or network)
- **THEN** the UI shows an error or informational state in the preview region and does not claim successful load

### Requirement: Tests for new hooks and services

New or changed hooks and services for **tree** and **file preview** SHALL include **Vitest** unit tests using **AAA** where logic is non-trivial (query keys, path handling, error mapping), and `npm test` for the web project SHALL pass before the change is considered complete.

#### Scenario: Tree hook or service has tests

- **WHEN** implementation adds tree or preview data fetching
- **THEN** at least one test covers success and one failure path for parsing or error handling using Arrange–Act–Assert

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

