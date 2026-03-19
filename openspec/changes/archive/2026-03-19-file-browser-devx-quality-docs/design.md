## Context

The monorepo already enforces **Vitest** for `api` and `web`. **ESLint** is not yet a first-class gate in the OpenSpec apply/archive path. **Swagger** is absent. **E2E** projects contain placeholder tests that do not reflect the file browser. **README.md** is accurate but minimal and does not showcase the UI or the OpenSpec story.

## Goals / Non-Goals

**Goals:**

- **Lint + type-aware rules** for TS/React where appropriate; **no `any`** in new or touched file-browser UI exports; `nx lint` (or documented equivalent) runnable in CI and locally.
- **OpenAPI 3** document and **Swagger UI** at a stable path (e.g. `/api/docs` or `/api` swagger json + UI) documenting **path-file-listing** and **path-file-content** routes.
- **Web e2e**: Playwright flow — navigate to file browser, interact with tree, select a file, assert preview panel shows content (or expected empty/error state).
- **API e2e**: Assert real endpoints (e.g. `GET /api/listing`, `GET /api/listing/tree`, preview query) against a running or test-harness API, aligned with current controllers.
- **README**: vision, OpenSpec rationale, screenshots (desktop + mobile) with preview, **worked example** of a hypothetical feature (e.g. “download file” or “search in tree”) with **command sequence**: propose → apply → test → archive.

**Non-Goals:**

- Changing core listing/preview **business** behavior (separate functional spec if needed).
- Full visual regression suite or cross-browser matrix beyond one Chromium run for web e2e unless already standard.

## Decisions

1. **ESLint + Nx** — Use Nx’s ESLint executor for `api` and `web` projects once `eslint.config` (flat) or legacy config exists; extend root `npm test` with `npm run lint` or document **`npm run verify`** = `lint + test` for apply/archive. **Rationale:** single command for humans and CI.

2. **Swagger** — `@nestjs/swagger` `DocumentBuilder` in `apps/api/src/main.ts` (or dedicated `setup-swagger.ts`), decorators on **controllers** and **DTOs** where they exist; global prefix `/api` reflected in paths. **Rationale:** standard Nest pattern.

3. **E2E data** — Web e2e may use **allowed root** pointing at repo root in CI/local (env already documented) and select a **known file** (e.g. `README.md` or `package.json`) for preview. **Rationale:** deterministic.

4. **README images** — Copy user-provided screenshots into **`docs/readme/`** (or `static/readme/`) and reference with relative paths in **README.md**. **Rationale:** assets versioned with the repo.

5. **PathInput / FileTreeView** — Audit props and Chakra `as` / event handlers for **implicit any**; add explicit types or satisfies patterns; fix **eslint-disable** only as last resort with justification.

## Risks / Trade-offs

- **[Risk]** Swagger decorators touch many files → **Mitigation:** incremental; start with listing + preview controllers only.
- **[Risk]** E2e flakiness → **Mitigation:** stable selectors (`role`, `data-testid` sparingly), wait for network/visible text.

## Migration Plan

- Add scripts; document in README; no DB migration.

## Open Questions

- Exact Swagger UI path and whether to expose JSON only in production (document in README).

### Code layout (target)

| Area | Path |
|------|------|
| API Swagger wiring | `apps/api/src/main.ts`, optional `apps/api/src/app/swagger/` or inline bootstrap |
| API controllers/DTOs | `apps/api/src/app/path-file-listing/`, `path-file-content/` — OpenAPI decorators |
| Web UI types | `apps/web/src/app/file-browser/ui/` |
| ESLint | Root `eslint.config.mjs` (or `.eslintrc.json`), `apps/web/eslint.config.mjs`, `apps/api/eslint.config.mjs` per Nx defaults |
| E2E | `apps/web-e2e/src/**/*.spec.ts`, `apps/api-e2e/src/**/*.spec.ts` |
| Docs / images | `docs/readme/*.png`, `README.md` |
