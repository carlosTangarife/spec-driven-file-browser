## 1. Create layout and move files

- [x] 1.1 Create `lib/`, `ui/`, `hooks/`, `api/` under `apps/web/src/app/file-browser/`
- [x] 1.2 Move pure modules and tests to `lib/` (`path-input.utils.ts`, `path-input.utils.spec.ts`)
- [x] 1.3 Move presentational components to `ui/` (`PathInput.tsx`, `FileListingView.tsx`)
- [x] 1.4 Move hooks and co-located specs to `hooks/` (`useDebouncedValue`, `useFileListingQuery`, `useListingPathState`, `useMinCharsHint`, `useListingNotFoundToast` + `*.spec.ts`)
- [x] 1.5 Move infrastructure to `api/` (`file-listing.service.ts`, `file-listing.service.spec.ts`, `listing-toaster.tsx`)

## 2. Fix imports and barrel

- [x] 2.1 Update all internal relative imports between moved modules; keep **dependency direction** (ui → no hooks; hooks → lib + api)
- [x] 2.2 Update `file-browser/index.ts` exports to new paths; export `ListingToaster` from barrel if `main.tsx` should import from a single entry
- [x] 2.3 Update `main.tsx` / `app.tsx` imports if they reference old paths

## 3. Verification

- [x] 3.1 Run `nx test web` (or `npm test`); fix failures until green
- [x] 3.2 Smoke-test dev server: listing, path input, 404 toast if applicable
