## Why

Contributors are starting to see **weak typing / implicit `any`** in file-browser UI code (e.g. `PathInput`, `FileTreeView`), which conflicts with **AGENTS.md** and should be caught **before** merge, not only via unit tests. The repo also lacks a **documented HTTP surface** (OpenAPI/Swagger), **meaningful e2e** coverage aligned with the real file browser (Playwright/Jest e2e projects are still boilerplate), and a **README** that explains the product, **why OpenSpec** is used, and how to run the **full workflow** with a concrete example. The entry **README.md** should be the project’s public face, including **desktop and mobile screenshots** with **preview** when a file is selected.

## What Changes

- Add **ESLint (+ TypeScript rules as needed)** and wire **`nx lint`** (or equivalent) so **lint runs alongside unit tests** as a **mandatory** quality gate for implementation and archive workflows (documented in **AGENTS.md** / opsx commands).
- **Fix** any implicit `any` / unsafe patterns in **`apps/web/src/app/file-browser/ui/`** (and related types) so components stay explicitly typed.
- Enable **Swagger / OpenAPI** in **`apps/api`** with **clear summaries, tags, and response shapes** for listing, tree, and file preview endpoints.
- Replace or extend **e2e** in **`apps/web-e2e`** and **`apps/api-e2e`** with scenarios that match the file browser: **web** — load app, see tree, select a file, **preview visible**; **api** — contract checks against listing/preview routes (no stale “Hello API”-only tests).
- **Rewrite / expand `README.md`**: project idea and goals; **why OpenSpec**; **screenshots** (desktop + mobile) with file preview selected; **example** of an additional business feature and the **sequence of OpenSpec commands** (`/opsx:propose` → apply → archive) for that example.
- Store README image assets under a stable path in the repo (e.g. `docs/readme/` or `static/readme/`), copying from provided captures as needed.

## Capabilities

### New Capabilities

- `developer-experience`: Lint/type-safety gates, OpenAPI exposure, e2e alignment with the file browser, and README as the project entrypoint with OpenSpec narrative and screenshots.

### Modified Capabilities

- *(none — existing functional listing/preview specs are unchanged; this change is tooling, docs, and verification.)*

## Impact

- **Config / tooling**: root `package.json` scripts, Nx targets, ESLint config, possible `apps/api` bootstrap (`main.ts`, feature modules) for Swagger.
- **Apps**: `apps/web` (UI types, e2e), `apps/api` (Swagger, e2e).
- **Docs**: `README.md`, new image folder; **AGENTS.md** / `.cursor/commands` references to lint + e2e where normative.
- **Dependencies**: `@nestjs/swagger` (or NestJS-supported OpenAPI stack), ESLint packages as required by the Nx/eslint setup.
