# developer-experience

Canonical spec (synced from change `file-browser-devx-quality-docs`).

## Requirements

### Requirement: ESLint is a mandatory gate alongside unit tests

The repository SHALL provide a documented **lint** command (`npm run lint` over `apps/web/src` and `apps/api/src`, or equivalent) that runs **ESLint** with TypeScript-aware rules. Implementers and the **apply / archive** workflow SHALL treat **lint success** as mandatory in the same sense as **`npm test`** for changes that touch those projects: **AGENTS.md** and **opsx-apply / opsx-archive** instructions SHALL reference **`npm run lint`** or **`npm run verify`** (lint + test) before considering work complete.

#### Scenario: Lint catches unsafe typing in file-browser UI

- **WHEN** a file under `apps/web/src/app/file-browser/ui/` uses implicit `any` or violates agreed ESLint rules
- **THEN** `npm run lint` fails until fixed

#### Scenario: Documented verification command

- **WHEN** a developer runs **`npm run verify`** from the repo root
- **THEN** **lint** and **unit tests** for api and web execute in sequence

### Requirement: API exposes documented OpenAPI/Swagger for listing and preview

The NestJS application SHALL expose an **OpenAPI** description and **Swagger UI** for the **path-file-listing** and **path-file-content** HTTP endpoints, including **summaries**, **parameters** (e.g. `path`, `depth`), and **response** documentation consistent with existing DTOs.

#### Scenario: Discover docs while API is running

- **WHEN** a developer starts the API and opens Swagger UI at `/api/docs`
- **THEN** they can see and invoke listing, tree, and preview operations with enough detail to understand inputs and errors

### Requirement: E2E tests reflect the file browser product

**`apps/web-e2e`** SHALL contain Playwright tests that load the file browser, select a **file**, and assert **preview** content. **`apps/api-e2e`** SHALL test the **listing/tree/preview** HTTP API with realistic expectations.

#### Scenario: Web e2e happy path

- **WHEN** the web e2e suite runs with API and web available
- **THEN** a test passes that demonstrates selecting a file and visible preview text

#### Scenario: API e2e contract

- **WHEN** the api e2e suite runs
- **THEN** tests assert successful responses from listing, tree, and preview endpoints

### Requirement: README is the project entrypoint with vision, OpenSpec, and screenshots

The root **`README.md`** SHALL explain the **purpose** of the file browser, **why OpenSpec** is used, and include **images** for **desktop** and **mobile** plus a **preview** screenshot. It SHALL include a **hypothetical feature** example and **OpenSpec-related commands** to propose, verify, and archive.

#### Scenario: New contributor understands workflow

- **WHEN** someone reads **`README.md`**
- **THEN** they understand the app, OpenSpec, see the UI, and can follow an example enhancement workflow
