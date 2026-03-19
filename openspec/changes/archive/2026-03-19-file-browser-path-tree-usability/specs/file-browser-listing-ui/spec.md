## ADDED Requirements

### Requirement: Listing wire path for nested input without trailing slash

When the trimmed path input contains at least one `/` and does **not** end with `/`, the application SHALL derive the **listing wire path** as the full trimmed path with trailing slashes removed, and SHALL use an empty **name prefix** for that input shape.

#### Scenario: Nested path without final slash lists that directory

- **WHEN** the user types `apps/web` (no trailing slash) and debounce or submit applies
- **THEN** listing and tree requests SHALL use wire path `apps/web` and SHALL NOT use wire path `apps` with a separate **name prefix** of `web`

#### Scenario: Root-level segment without slash keeps name prefix

- **WHEN** the user types `Documents` with no `/` in the input
- **THEN** the application SHALL keep **root** as listing wire path and SHALL use `Documents` as the **name prefix** per existing rules

#### Scenario: Trailing slash unchanged

- **WHEN** the user types `apps/web/`
- **THEN** the listing wire path SHALL be `apps/web` and the name prefix SHALL be empty

## MODIFIED Requirements

### Requirement: Expand/collapse vs directory navigation

The tree SHALL support **expanding and collapsing** directory nodes without changing the current path when the user activates a **primary click** on the **directory row** (full-row or equivalent large hit target). A **chevron** or similar icon MAY appear but SHALL NOT be the only clickable region for expand/collapse. **Navigating** to a directory (updating the **path input** and fetching the tree for that anchor) SHALL occur on a distinct gesture from expand-only interaction (e.g. **double-click** on the directory row or an explicit “open” action), documented in the UI implementation.

#### Scenario: Row click expands without changing path

- **WHEN** the user activates a **single-click** on the directory row (outside any documented navigate-only control) to toggle expansion
- **THEN** the subtree loads or toggles visibility per lazy-load rules and the **path input** value SHALL remain unchanged unless a separate navigate gesture occurs

#### Scenario: Navigate gesture updates path and refetches tree

- **WHEN** the user performs the documented **navigate** gesture on a directory node
- **THEN** the path input shows that directory’s wire path and a **fresh tree request** runs for that path (subject to debouncing rules below)
