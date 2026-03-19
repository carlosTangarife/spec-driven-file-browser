## 1. API — directory tree (`path-file-listing`)

- [x] 1.1 Add DTOs and validation for tree query (`path`, `depth` default 3) and for nested node JSON shape
- [x] 1.2 Implement tree builder in `PathFileListingService` (or colocated helper) using existing path resolution + `fs` with depth limit and documented node caps if needed
- [x] 1.3 Expose `GET` route for tree (e.g. `listing/tree`) in `PathFileListingController`; wire module; keep controller thin
- [x] 1.4 Add Vitest unit tests (AAA) for tree builder and/or resolver edge cases (`nx test api`)

## 2. API — file content preview (`path-file-content`)

- [x] 2.1 Create `apps/api/src/app/path-file-content/` feature folder: module, controller, service, DTOs
- [x] 2.2 Implement bounded UTF-8 read with max size, directory/binary/large-file handling per spec status codes
- [x] 2.3 Register `PathFileContentModule` in `AppModule`
- [x] 2.4 Add Vitest tests for service (mock `fs`) — success, 404, directory, oversize (`nx test api`)

## 3. Web — services and hooks (`file-browser`)

- [x] 3.1 Extend `api/` with Zod-validated tree fetch and new `file-content.service.ts` for preview
- [x] 3.2 Add React Query hooks (`useDirectoryTreeQuery`, `useFileContentQuery` or equivalent) keyed by path; handle loading/error
- [x] 3.3 Extend or compose `useListingPathState` for selected file path / directory navigation as needed

## 4. Web — UI (`file-browser/ui`)

- [x] 4.1 Add presentational `FileTreeView` (props: nodes, onDirectoryClick, onFileClick, loading)
- [x] 4.2 Add presentational `FileContentPreview` (props: content, error, loading, truncated flag)
- [x] 4.3 Update `FileBrowserPage.tsx` to compose path input + tree + preview; mobile-friendly layout (Chakra)

## 5. Web — tests and gate

- [x] 5.1 Add/update Vitest tests for new services/hooks (`nx test web`)
- [x] 5.2 Run `npm test` and fix until green

## 6. OpenSpec — delta aligned with implementation

- [x] 6.1 Document **VCS/metadata omission** in delta spec `specs/path-file-listing/spec.md` and reference from `directory-tree-listing`
- [x] 6.2 Document **shallow depth**, **lazy expand vs navigate**, and **input debounce/defer** in `file-browser-listing-ui` and `design.md` / `proposal.md`
