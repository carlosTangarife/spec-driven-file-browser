## MODIFIED Requirements

### Requirement: Friendly English feedback for not found

When the directory **tree** (or applicable listing) for the current path anchor fails with **HTTP 404** (path not found) after any documented fallback, the application SHALL show a **short, friendly message in English** in a **prominent inline notice** **immediately above the path input** (full content width within the page shell), with **`role="alert"`** (or equivalent), so the user understands the path does not exist.

#### Scenario: Missing directory

- **WHEN** the API responds with **404** for the requested path anchor and the UI shows path-not-found feedback
- **THEN** the user sees an English message above the path field with a clear explanation that the folder was not found under the allowed root
