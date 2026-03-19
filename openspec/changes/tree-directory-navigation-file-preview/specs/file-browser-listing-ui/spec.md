## ADDED Requirements

### Requirement: Directory tree view

The web application SHALL render directory contents as a **tree** (nested outline or expandable rows) backed by the **directory tree** API for the current path anchor, using Chakra UI for layout and accessibility. The view SHALL distinguish **files** and **directories** at every nested level returned by the API.

#### Scenario: Tree loads with path

- **WHEN** the file browser has a current relative path (including empty for root) and the tree request succeeds
- **THEN** the UI displays nested nodes matching the API tree at least up to the depth returned by the server

### Requirement: Folder click updates path input

When the user **activates** a **directory** node in the tree (e.g. click or keyboard equivalent), the application SHALL update the **path input** to that directory’s relative wire path and SHALL trigger a **fresh tree fetch** for that path.

#### Scenario: User opens a subfolder

- **WHEN** the user selects a directory node in the tree
- **THEN** the path input shows the corresponding wire path and a new tree request runs for that path

### Requirement: Path input drives tree refresh

When the path input changes and the application performs a **listing or navigation action** consistent with existing debounce and Enter/Tab rules, the application SHALL request the **directory tree** for the trimmed path (empty means root) and SHALL refresh the tree view when the response arrives.

#### Scenario: User types a deeper path

- **WHEN** the user edits the path input and the debounced or immediate submit behavior fires per existing rules
- **THEN** the application requests the tree for that path and updates the tree view accordingly

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
