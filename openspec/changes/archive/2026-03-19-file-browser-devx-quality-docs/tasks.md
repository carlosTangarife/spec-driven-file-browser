## 1. ESLint and type safety

- [x] 1.1 Add or align **ESLint** config for `apps/web` and `apps/api` (Nx `lint` targets); ensure `@typescript-eslint` rules flag implicit `any` where configured.
- [x] 1.2 Add root script **`npm run lint`** (and optionally **`npm run verify`** = lint + `npm test`) in `package.json`; document in **AGENTS.md** and **`.cursor/commands/opsx-apply.md`** / **`opsx-archive.md`** that verification includes lint for touched apps.
- [x] 1.3 Fix **PathInput**, **FileTreeView**, and related file-browser UI files so they pass lint with **explicit** props/types (no stray `any`).

## 2. OpenAPI / Swagger (API)

- [x] 2.1 Add **`@nestjs/swagger`** (and peer setup); register **SwaggerModule** in `apps/api` with global `/api` prefix reflected in docs.
- [x] 2.2 Annotate **path-file-listing** and **path-file-content** controllers (and DTOs as needed) with `@ApiTags`, `@ApiOperation`, `@ApiQuery` / `@ApiResponse` for listing, tree, and preview routes.
- [x] 2.3 Document the **Swagger UI URL** in **README.md** (e.g. `http://localhost:3000/api/docs`).

## 3. E2E

- [x] 3.1 **Web (Playwright):** Replace or extend boilerplate with a test that visits the file browser, expands a folder if needed, clicks a known file, and asserts **preview** text/content is visible.
- [x] 3.2 **API (Jest + axios):** Update tests to hit **`/api/listing`** (and tree/preview as appropriate) with realistic expectations; remove or rewrite obsolete “Hello API”-only assertions.
- [x] 3.3 Ensure **`nx e2e web-e2e`** / **`nx e2e api-e2e`** are documented in README with env prerequisites (`FILE_LISTING_ALLOWED_ROOT`, etc.).

## 4. README and assets

- [x] 4.1 Create **`docs/readme/`** (or agreed folder) and add **desktop** and **mobile** screenshots (copy from provided assets or regenerate); reference them in **README.md** with markdown images.
- [x] 4.2 Expand **README.md**: project vision, **why OpenSpec**, stack table, **verification** (`lint` + `test`), Swagger link, e2e commands.
- [x] 4.3 Add section **“Example: hypothetical feature”** (e.g. “Download file” or “Search in tree”) with **step-by-step OpenSpec commands**: `npm run git:feature -- <id>`, `openspec new change`, `/opsx:apply`, `npm test` + `npm run lint`, `/opsx:archive`.

## 5. Verification

- [x] 5.1 Run **`npm run lint`**, **`npm test`**, and e2e targets locally; fix failures until green.
