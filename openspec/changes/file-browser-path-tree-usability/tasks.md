## 1. Path derivation (`file-browser` lib)

- [ ] 1.1 Update `splitPathInput` in `path-input.utils.ts`: when trimmed contains `/` and does not end with `/`, set `listingWirePath` to the full trimmed path (strip trailing slashes only if present), `namePrefix` to `''`
- [ ] 1.2 Update `path-input.utils.spec.ts` for the new rules; keep root-only and trailing-slash cases green

## 2. Tree row interaction (`file-browser` UI)

- [ ] 2.1 Refactor `FileTreeView.tsx` so a **single click** on the **directory row** toggles expand/collapse (full-row or `HStack` as one interactive region); chevron is visual-only or shares the same handler without being the sole target
- [ ] 2.2 Keep **double-click** (or documented gesture) for `onDirectoryNavigate`; avoid conflicting handlers
- [ ] 2.3 Adjust helper copy in `FileBrowserPage.tsx` to match behavior

## 3. Tests and gate

- [ ] 3.1 Add or update Vitest tests if `useListingPathState` behavior changes
- [ ] 3.2 Run `npm test` (or `nx test web`); fix until green
