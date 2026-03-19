## ADDED Requirements

### Requirement: Directory tree view

The web application SHALL render directory contents as a **tree** (nested outline or expandable rows) backed by the **directory tree** API for the current path anchor, using Chakra UI for layout and accessibility. The view SHALL distinguish **files** and **directories** at every nested level returned by the API.

#### Scenario: Tree loads with path

- **WHEN** the file browser has a current relative path (including empty for root) and the tree request succeeds
- **THEN** the UI displays nested nodes matching the API tree at least up to the depth returned by the server

### Requirement: Expand/collapse vs directory navigation

The tree SHALL support **expanding and collapsing** directory nodes without changing the current path when the user uses the **dedicated expand control** (e.g. chevron). **Navigating** to a directory (updating the **path input** and fetching the tree for that anchor) SHALL occur on a distinct gesture from expand-only interaction (e.g. **double-click** on the directory row or an explicit “open” action), documented in the UI implementation.

#### Scenario: Chevron expands without changing path

- **WHEN** the user activates only the expand/collapse control for a directory that has unloaded or hidden children
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
