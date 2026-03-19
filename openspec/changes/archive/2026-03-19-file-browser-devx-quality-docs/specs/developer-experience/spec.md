## ADDED Requirements

### Requirement: ESLint is a mandatory gate alongside unit tests

The repository SHALL provide a documented **lint** command (via Nx `lint` targets for `api` and `web`, or equivalent) that runs **ESLint** with TypeScript-aware rules. Implementers and the **apply / archive** workflow SHALL treat **lint success** as mandatory in the same sense as **`npm test`** for changes that touch those projects: **AGENTS.md** and **opsx-apply / opsx-archive** instructions SHALL reference running **lint** (or a combined **verify** script) before considering work complete.

#### Scenario: Lint catches unsafe typing in file-browser UI

- **WHEN** a file under `apps/web/src/app/file-browser/ui/` uses implicit `any` or violates agreed ESLint rules
- **THEN** `nx lint web` (or the documented lint command) fails until fixed

#### Scenario: Documented verification command

- **WHEN** a developer runs the documented verification script from the repo root
- **THEN** both **lint** and **unit tests** for api and web execute (or the docs clearly state the exact sequence if split)

### Requirement: API exposes documented OpenAPI/Swagger for listing and preview

The NestJS application SHALL expose an **OpenAPI** description and **Swagger UI** (or equivalent interactive docs) for the **path-file-listing** and **path-file-content** HTTP endpoints, including **summaries**, **parameters** (e.g. `path`, `depth`), and **response** documentation consistent with existing DTOs.

#### Scenario: Discover docs while API is running

- **WHEN** a developer starts the API and opens the documented Swagger UI URL
- **THEN** they can see and invoke listing, tree, and preview operations with enough detail to understand inputs and errors

### Requirement: E2E tests reflect the file browser product

**`apps/web-e2e`** SHALL contain at least one Playwright test that loads the file browser, interacts with the **tree**, selects a **file**, and asserts that the **preview** region shows expected content (or a documented empty/error state). **`apps/api-e2e`** SHALL test the real **listing/preview** HTTP API (not obsolete placeholder routes), with setup compatible with the existing global setup.

#### Scenario: Web e2e happy path

- **WHEN** the web e2e suite runs against a running API and web app
- **THEN** a test passes that demonstrates tree navigation and file preview visibility

#### Scenario: API e2e contract

- **WHEN** the api e2e suite runs
- **THEN** tests assert successful responses from the current listing/tree/preview endpoints consistent with production behavior

### Requirement: README is the project entrypoint with vision, OpenSpec, and screenshots

The root **`README.md`** SHALL explain the **purpose** of the file browser project, **why OpenSpec** is used for spec-driven development, and include **images** showing **desktop** and **mobile** layouts **with a file selected and preview visible**. It SHALL include a **concrete example** of an additional feature relevant to the product (e.g. download, search, or bookmarks) and the **ordered OpenSpec commands** to propose, implement, and archive that example (`/opsx:propose`, `/opsx:apply`, `/opsx:archive` or CLI equivalents).

#### Scenario: New contributor understands workflow

- **WHEN** someone reads only `README.md`
- **THEN** they understand what the app does, how OpenSpec fits, see the UI, and can follow an example command sequence for a hypothetical enhancement
