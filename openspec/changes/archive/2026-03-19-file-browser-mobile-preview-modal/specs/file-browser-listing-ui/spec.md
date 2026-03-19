## ADDED Requirements

### Requirement: Mobile file preview opens in a modal

On viewports **narrower than the `lg` breakpoint** (the same breakpoint at which the file browser uses a single-column layout for tree and preview), when the user **selects a file** in the tree, the application SHALL show the **file content preview** inside a **modal** layer above the page. The modal SHALL include a **semi-opaque backdrop (overlay)** behind the content and SHALL provide a **visible close** control (e.g. button) that dismisses the modal. The modal header SHALL display the **directory wire path** (relative path to the containing folder, or an agreed empty/root treatment) and the **file name** as the primary title so the user sees **where** the file lives and **which** file is open. The preview body SHALL reuse the same loading, error, and truncation behavior as the inline preview (presentational component fed by existing hooks/data).

#### Scenario: Mobile user selects a file

- **WHEN** the viewport is below `lg` and the user selects a file node in the tree
- **THEN** a modal opens, the overlay is visible, the title reflects the file’s path context and name, and the preview area inside the modal shows loading or text per the content API response

#### Scenario: Mobile user closes the preview modal

- **WHEN** the modal is open and the user activates the **close** control
- **THEN** the modal and overlay are dismissed and the user can interact with the tree again

### Requirement: Desktop preview stays inline

On viewports **`lg` and wider**, the application SHALL **not** use the mobile preview modal for the primary preview flow; the preview SHALL remain in the **inline** preview region beside the tree (existing two-column layout).

#### Scenario: Wide viewport inline preview

- **WHEN** the viewport is `lg` or wider and the user selects a file
- **THEN** the preview content appears in the existing second column without requiring a modal for that selection

### Requirement: Playwright mobile coverage for modal preview

The **`apps/web-e2e`** suite SHALL include a test that runs at a **mobile viewport** (width below `lg`), selects an existing text file from the tree, asserts that **preview text** is visible in the **modal**, and asserts that **closing** the modal hides it.

#### Scenario: E2E mobile file tap opens and closes modal

- **WHEN** the Playwright test uses a mobile viewport and selects a file that returns preview content
- **THEN** the modal (or documented accessible container) is visible with a title that includes the file name (and path context where applicable), expected preview content, and the close action removes the modal from view
