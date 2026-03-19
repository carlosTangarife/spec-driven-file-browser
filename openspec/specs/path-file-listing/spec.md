# path-file-listing

Canonical spec (synced from archived change `cross-platform-path-file-listing`).

## Purpose

Define the HTTP contract and server-side rules for **listing files and directories** under a configured allowed root, including cross-platform path handling and how the **NestJS** implementation is organized as a vertical slice.

## Requirements

### Requirement: API accepts a path for directory listing

The API SHALL expose an operation that accepts a **path** identifying which directory to list. The path SHALL be interpreted as a **relative path** under a configured **allowed root**, using **forward slashes** as segment separators in the request (e.g. `projects/acme`). The segment `..` SHALL NOT be accepted. An empty path or `.` SHALL mean the allowed root itself.

#### Scenario: Client requests listing for the root

- **WHEN** the client requests a listing with an empty relative path (or `.`) and the allowed root exists and is a directory
- **THEN** the API responds with HTTP 200 and a list of immediate children of the allowed root

#### Scenario: Client requests listing for a nested directory

- **WHEN** the client requests a listing with a valid relative path under the allowed root and that directory exists
- **THEN** the API responds with HTTP 200 and a list of immediate children of that directory

### Requirement: Requested path must exist and be a directory

The system SHALL verify the resolved path exists on the filesystem and is a directory before listing. If the path does not exist, the API SHALL NOT perform listing.

#### Scenario: Path does not exist

- **WHEN** the resolved path does not exist on the host filesystem
- **THEN** the API responds with HTTP 404 and a stable error payload indicating that the path was not found

#### Scenario: Path exists but is not a directory

- **WHEN** the resolved path exists but is a file or other non-directory node
- **THEN** the API responds with HTTP 400 or 404 per implementation policy documented in the API, and SHALL NOT return a directory listing

### Requirement: Resolved path must stay within allowed root

The system SHALL resolve the client path against the configured allowed root and SHALL reject any resolution that escapes the root (e.g. via traversal).

#### Scenario: Attempt to escape allowed root

- **WHEN** the client supplies segments that would resolve outside the allowed root
- **THEN** the API responds with HTTP 400 or 403 and SHALL NOT read outside the allowed root

### Requirement: Cross-platform filesystem behavior

The implementation SHALL use Node.js path and filesystem APIs so that the same API contract works on **Windows** and **macOS/Linux**. Wire-format paths SHALL use forward slashes; resolution SHALL produce a host-correct absolute path under the allowed root. The API SHALL NOT require clients to send platform-specific path separators.

#### Scenario: Windows host with allowed root on a drive

- **WHEN** the server runs on Windows and the allowed root is an absolute path on a drive
- **THEN** listing succeeds for valid relative wire paths and the same HTTP status and payload shapes apply as on POSIX hosts

#### Scenario: POSIX host

- **WHEN** the server runs on macOS or Linux and the allowed root is an absolute POSIX path
- **THEN** listing succeeds for valid relative wire paths and responses match the agreed JSON shape

### Requirement: Listing entries include type and identity

Each listed entry SHALL identify whether it is a **file** or **directory** and SHALL include a stable name (and optionally a relative path under root as specified by the API contract).

#### Scenario: Successful listing shape

- **WHEN** listing succeeds
- **THEN** each entry in the response includes at least a `name`, a `type` discriminating file vs directory, and any additional fields fixed in the OpenAPI or DTO contract

### Requirement: NestJS path-file-listing vertical slice (Screaming Architecture)

The NestJS implementation of directory listing SHALL reside in a **single feature folder** `apps/api/src/app/path-file-listing/`. Listing-related **HTTP controllers**, **injectable services**, **DTOs**, and **colocated path resolution or pure helpers** SHALL live in that folder or its subfolders (e.g. `dto/`). The API application SHALL NOT implement this capability by placing core listing handlers or listing business logic in **app-wide technical-layer folders** that mix unrelated features (e.g. root-level `controllers/`, `services/`, or `modules/` grouping many domains). The listing **controller** SHALL delegate filesystem access and path resolution rules to **services** or **colocated pure modules** under the feature folder.

#### Scenario: Capability is visible from the app tree

- **WHEN** a developer lists `apps/api/src/app/` without opening files
- **THEN** a folder named for the capability (`path-file-listing`) exists and contains the NestJS module, controller, service, and DTOs for directory listing

#### Scenario: Controller does not embed filesystem logic

- **WHEN** a client invokes the listing HTTP operation
- **THEN** the controller validates input and delegates listing and path resolution to injectable services or pure helpers under `path-file-listing/`, and does not perform `readdir` or path resolution inline in the controller

#### Scenario: App module composes feature modules

- **WHEN** the API application boots
- **THEN** `AppModule` imports a dedicated `PathFileListingModule` (or equivalent feature module) for this capability rather than registering listing controllers or listing services only through anonymous app-wide provider lists that obscure the feature

