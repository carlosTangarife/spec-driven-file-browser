---
name: nestjs-stack
description: NestJS 11 + TypeScript in this workspace. Use when implementing or reviewing API modules, controllers, services, or DTOs. Follows feature-based structure, SOLID, and Screaming Architecture.
---

# NestJS stack (this workspace)

## Stack

- **NestJS 11** with **TypeScript** (strict).
- **Global prefix**: `/api` (e.g. `GET /api`).
- App lives in `apps/api`; entry `src/main.ts`.

## Conventions

1. **AGENTS.md — Code quality (mandatory)**: One primary responsibility per file (controller / service / DTO module as appropriate); explicit return types on public service methods and controller handlers where applicable; thin controllers; avoid high cyclomatic complexity in services—extract helpers or classes. Read **AGENTS.md** § *Code quality (mandatory)* before large edits.
2. **Feature-based modules**: One feature per folder (e.g. `file-listing/` with module, controller, service). Folder name reflects the capability (Screaming Architecture).
3. **SOLID**: Single responsibility; inject dependencies via constructor; depend on abstractions where it helps.
4. **DTOs**: Use classes and `class-validator`/`class-transformer` for request/response validation when needed.
5. **Errors**: Use appropriate HTTP status (400, 403, 404) and Nest exceptions (`BadRequestException`, `NotFoundException`, etc.).

## Module layout (per feature)

```
apps/api/src/app/
  some-feature/
    some-feature.module.ts
    some-feature.controller.ts
    some-feature.service.ts
    dto/
```

- Import the feature module in `AppModule`.
- Controllers expose routes; services hold business logic and (if needed) file system or external calls.

## Security

- Validate path parameters to avoid path traversal; restrict to an allowed base path.
- CORS is enabled (configure origin for production).

Apply these patterns when adding or changing API code in this repo.
