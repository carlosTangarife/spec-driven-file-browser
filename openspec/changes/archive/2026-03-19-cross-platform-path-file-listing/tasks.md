## 1. Configuration and contracts

- [x] 1.1 Define env/config for **allowed root** (absolute path on host) and document in README / AGENTS pointer
- [x] 1.2 Define request DTO (relative wire path) and response DTO (entries: name, type, optional relativePath)
- [x] 1.3 Document symlink policy chosen (follow or not) and align with spec

## 2. Path resolution (cross-platform)

- [x] 2.1 Implement pure function: wire path string → validated segment array (reject `..`, empty segments)
- [x] 2.2 Implement resolution: `allowedRoot` + segments → absolute path using Node `path` (no string concat by hand)
- [x] 2.3 Implement **root containment** check after resolve (normalized paths must stay under allowed root)
- [x] 2.4 Add unit tests for Windows-style and POSIX-style `allowedRoot` inputs (mock or CI matrix if available)

## 3. NestJS feature module

- [x] 3.1 Add `path-file-listing` (or equivalent) feature folder: module, controller, service
- [x] 3.2 Service: existence check + `readdir` with `withFileTypes`; map to DTOs; map ENOENT / ENOTDIR to HTTP 404 / 400
- [x] 3.3 Controller: GET (or POST) endpoint matching spec; validation pipe for path input
- [x] 3.4 Register module in `AppModule`

## 4. Verification

- [x] 4.1 Manual or e2e check on Windows and macOS/Linux (or document CI strategy)
- [x] 4.2 Ensure CORS still allows web app to call new endpoint
- [x] 4.3 Update frontend service layer to use new contract (separate change if preferred; keep API stable first)
