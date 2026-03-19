# OpenSpec in this workspace

OpenSpec changes live under `openspec/changes/` (active) and `openspec/changes/archive/` (completed). Canonical specs synced from archived changes live under `openspec/specs/<capability>/spec.md`.

**Git:** **`feature/<change-name>`** from the integration branch (**`trunk`** — see **AGENTS.md**). **`/opsx:propose`** creates it before `openspec new change`; **`npm run git:feature`** can infer `<change-name>` when one active change exists (`openspec list`). Implement: **`/opsx:apply`** (also ensures the branch); finish (archive + commit + merge): **`/opsx:archive`** — **AGENTS.md** § Workflow, **`.cursor/commands/opsx-propose.md`**, **`.cursor/commands/opsx-apply.md`**, **`.cursor/commands/opsx-archive.md`**.

## Link to coding style

**Before implementing** any change, read **[AGENTS.md](../AGENTS.md)** at the repo root. It defines:

- **Screaming Architecture** (feature folders, not horizontal layers).
- **How a React feature slice maps to Clean-style boundaries** (domain vs application vs infrastructure vs UI).
- **What to put in OpenSpec `design.md`** so implementation matches structure (see *OpenSpec ↔ code layout* in AGENTS.md).

Agents and humans should treat **AGENTS.md + `openspec/changes/<change>/design.md`** together: the spec says *what*; AGENTS + design say *where and how* code is organized.

## Suggested `design.md` section

When writing **design.md** for a change, include a short **Code layout (target)** subsection, for example:

- Feature folder name (e.g. `apps/web/src/app/file-browser/`).
- New files or groups (e.g. `path-input.utils.ts` for pure parsing, `file-listing.service.ts` for HTTP).
- Whether UI stays flat or uses subfolders (`ui/`, `hooks/`, `lib/`) if the slice is large.

This keeps OpenSpec aligned with Screaming / Clean boundaries without duplicating all of AGENTS.md.

## Reference implementation

The **`file-browser`** feature under `apps/web/src/app/file-browser/` follows the subfolder layout (`lib/`, `ui/`, `hooks/`, `api/`) described in **AGENTS.md** (see archived change **`file-browser-slice-restructure`** under `openspec/changes/archive/` for **Code layout (target)**). New changes that touch that slice SHOULD follow the same pattern.
