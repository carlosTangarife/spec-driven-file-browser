# developer-experience

Canonical spec (synced from change `file-browser-devx-quality-docs`).

## Requirements

### Requirement: ESLint is a mandatory gate alongside unit tests

The repository SHALL provide a documented **lint** command (`pnpm run lint` over `apps/web/src` and `apps/api/src`, or equivalent) that runs **ESLint** with TypeScript-aware rules. Implementers and the **apply / archive** workflow SHALL treat **lint success** as mandatory in the same sense as **`pnpm test`** for changes that touch those projects: **AGENTS.md** and **opsx-apply / opsx-archive** instructions SHALL reference **`pnpm run lint`** or **`pnpm run verify`** (lint + test) before considering work complete.

#### Scenario: Lint catches unsafe typing in file-browser UI

- **WHEN** a file under `apps/web/src/app/file-browser/ui/` uses implicit `any` or violates agreed ESLint rules
- **THEN** `pnpm run lint` fails until fixed

#### Scenario: Documented verification command

- **WHEN** a developer runs **`pnpm run verify`** from the repo root
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

### Requirement: Archive runs e2e after lint and unit tests; e2e failure triggers structured apply re-review

The **`/opsx:archive`** workflow (and equivalent **openspec-archive-change** skill) SHALL **not** move an OpenSpec change to **`openspec/changes/archive/`** or run Git close-out until **`pnpm exec nx e2e api-e2e`** and **`pnpm exec nx e2e web-e2e`** have been executed from the repository root and **both** exit **0**, in addition to lint and unit tests (**`pnpm run verify`** or equivalent). **WHEN** any e2e run fails, the agent SHALL **not** leave the workflow in an indeterminate state without first completing **at least three** structured **apply re-review** passes (re-read **`tasks.md`** and change specs, re-inspect diffs from **`/opsx:apply`**, record hypotheses and ruled-out causes); only then MAY the agent hand off with a determinate summary of what failed and what remains.

#### Scenario: Archive blocked on red e2e

- **WHEN** **`pnpm exec nx e2e web-e2e`** or **`pnpm exec nx e2e api-e2e`** exits non-zero during archive
- **THEN** the OpenSpec directory is **not** archived and Git close-out does **not** run until e2e is green or the user explicitly opts out of e2e for that run

#### Scenario: E2e failure requires three apply reviews before vague stop

- **WHEN** e2e fails during archive
- **THEN** the agent performs **at least three** documented passes comparing implementation to **`tasks.md`** and specs before ending with only a vague or inconclusive status

### Requirement: README is the project entrypoint with vision, OpenSpec, and screenshots

The root **`README.md`** SHALL explain the **purpose** of the file browser, **why OpenSpec** is used, and include **images** for **desktop** and **mobile** plus a **preview** screenshot. It SHALL include a **hypothetical feature** example and **OpenSpec-related commands** to propose, verify, and archive.

#### Scenario: New contributor understands workflow

- **WHEN** someone reads **`README.md`**
- **THEN** they understand the app, OpenSpec, see the UI, and can follow an example enhancement workflow
