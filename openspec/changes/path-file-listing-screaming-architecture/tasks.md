## 1. Audit and align NestJS layout

- [ ] 1.1 Verify all path-file-listing code (module, controller, service, config, DTOs, path resolver + tests) lives under `apps/api/src/app/path-file-listing/` with no listing core logic in app-wide `controllers/` / `services/` / `modules/` folders
- [ ] 1.2 If any import or file location violates the target layout in `design.md`, move or re-export within the feature folder with minimal churn and fix imports
- [ ] 1.3 Confirm `app.module.ts` imports `PathFileListingModule` only as a feature module (no duplicate registration of listing providers at app root unless required for global bootstrap)

## 2. Tests and verification

- [ ] 2.1 Run and fix `nx test api` (Vitest, AAA); add or adjust unit tests if moves affect modules or path resolver behavior
- [ ] 2.2 Run `npm test` (or repo-wide test gate) and ensure green before considering the change complete
