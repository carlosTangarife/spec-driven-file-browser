# file-browser-listing-ui

Canonical spec (synced from change `file-browser-listing-ui`).

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
