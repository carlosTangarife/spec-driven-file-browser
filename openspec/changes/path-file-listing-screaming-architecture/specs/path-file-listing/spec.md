## ADDED Requirements

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
