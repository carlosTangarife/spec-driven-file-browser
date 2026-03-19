## ADDED Requirements

### Requirement: Responsive page shell with symmetric horizontal spacing

The web application SHALL lay out the file browser page so that primary content has **consistent horizontal padding on left and right** across breakpoints, and SHALL NOT leave content visually stuck to one edge on wide viewports when a centered or full-width column pattern is used (e.g. centered `Container` or full-bleed with equal inline padding).

#### Scenario: Wide viewport

- **WHEN** the user views the file browser on a large-width viewport
- **THEN** horizontal spacing to the left and right of the main content column is visually balanced (no single-sided gutter caused solely by an off-center column)

### Requirement: Path input maximum length

The path input SHALL accept at most **200** characters. The UI SHALL prevent additional characters beyond this limit (e.g. `maxLength` or equivalent).

#### Scenario: User reaches the limit

- **WHEN** the user attempts to type or paste beyond 200 characters
- **THEN** the input does not grow beyond 200 characters

### Requirement: Name prefix filter from three characters

For the **current listing response** (entries returned for `listingWirePath`), the UI SHALL filter visible rows by **entry `name`** when the derived **name prefix** has length **greater than or equal to three**, using **case-insensitive prefix** matching. When the name prefix length is **less than three**, the UI SHALL **not** apply this filter and SHALL show all entries returned for that listing.

The derivation of `listingWirePath` and `namePrefix` from the single input field SHALL follow the design: if the input contains `/`, `listingWirePath` is the parent path and `namePrefix` is the final segment; if there is no `/`, `listingWirePath` is root (empty) and `namePrefix` is the full input.

#### Scenario: Root input filters folder names

- **WHEN** the root listing includes entries named `applications`, `apps`, and `AppService`, and the user input has no `/` and the value is `app`
- **THEN** only entries whose `name` starts with `app` (case-insensitive) are shown among those returned for the root listing

#### Scenario: Short prefix shows full listing

- **WHEN** the name prefix length is 0, 1, or 2
- **THEN** no name-prefix filter is applied to the listing

### Requirement: Friendly English feedback for not found

When the listing request fails with **HTTP 404** (path not found), the application SHALL show a **short, friendly message in English** using a **toast** (or equivalent non-blocking notice), in addition to or instead of a harsh inline error, so the user understands the path does not exist.

#### Scenario: Missing directory

- **WHEN** the API responds with 404 for the requested path
- **THEN** the user sees an English toast with a clear explanation that the path was not found

### Requirement: Feedback when only one character was entered

When the path input length is **exactly one** character, and **three seconds** pass **without** the value changing, the application SHALL show **immediate English feedback** (toast or inline) that **at least three characters are needed** to narrow the listing by name (wording MUST be user-friendly).

#### Scenario: Single character then pause

- **WHEN** the input contains exactly one character and remains unchanged for three seconds
- **THEN** the user sees English feedback that more characters are required before name filtering applies
