## ADDED Requirements

### Requirement: Directory tree endpoint

The API SHALL expose an HTTP operation that accepts a **relative wire path** (same segment and root rules as `path-file-listing`) identifying a **directory** anchor and a **depth** query parameter. The response SHALL represent a **tree**: each **directory** node includes a list of **child** nodes (files and subdirectories); **file** nodes SHALL NOT include nested directory children. The server SHALL recurse into subdirectories until the remaining depth reaches zero or there are no further subdirectories.

#### Scenario: Default depth yields nested structure

- **WHEN** the client requests a tree for a valid directory anchor and omits **depth** or uses the documented default
- **THEN** the default depth SHALL be **3** unless documented otherwise, and the response SHALL include nested children up to that depth where the filesystem contains subdirectories

#### Scenario: Minimum supported depth capability

- **WHEN** the client requests a tree with **depth** set to **3** for a directory that contains at least three levels of nested subdirectories under the anchor
- **THEN** the API SHALL include nested **children** for those levels (subject to documented node limits) and SHALL NOT cap recursion below **3** for a valid request solely because depth is greater than one

#### Scenario: Anchor must be a directory

- **WHEN** the resolved anchor path is not a directory (e.g. it is a file)
- **THEN** the API responds with HTTP **400** or **404** with a stable error payload and SHALL NOT return a tree

#### Scenario: Path resolution matches existing listing rules

- **WHEN** the client supplies a wire path that would violate allowed-root or traversal rules
- **THEN** the API SHALL reject the request consistent with `path-file-listing` policy (HTTP **400** or **403**) and SHALL NOT read outside the allowed root

### Requirement: Tree node shape

Each node in the tree SHALL include a **name**, a **type** discriminating **file** and **directory**, a stable **path** or wire-relative identifier for the entry under the allowed root, and for directories a **children** array (possibly empty). File nodes SHALL use an empty **children** array or omit **children** per the documented JSON contract, but the contract SHALL be consistent for clients.

#### Scenario: File leaf

- **WHEN** a node represents a file
- **THEN** the node’s **type** indicates a file and the node SHALL NOT imply nested directory listing under that path

### Requirement: Cross-platform behavior

The tree implementation SHALL use Node.js **path** and **fs** APIs consistent with existing cross-platform listing so that Windows and POSIX hosts behave per the same HTTP contract for equivalent wire paths.

#### Scenario: POSIX vs Windows hosts

- **WHEN** the server runs on Windows or on POSIX
- **THEN** successful tree responses follow the same JSON shape and status codes for equivalent valid wire paths under the configured allowed root
