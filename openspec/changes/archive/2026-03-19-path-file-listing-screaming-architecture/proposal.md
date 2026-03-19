## Why

Directory listing is a core capability of this product; **AGENTS.md** requires NestJS code to follow **Screaming Architecture** (one folder per capability, not horizontal `controllers/` / `services/` at app root). The `path-file-listing` slice is already mostly aligned; this change **locks that layout in spec and design** so it stays obvious and does not drift as the API grows.

## What Changes

- Add **normative requirements** (OpenSpec delta) so the NestJS **path-file-listing** implementation must live in a **single feature folder** with clear controller vs service boundaries.
- Add **`design.md`** with **Code layout (target)** under `apps/api/src/app/path-file-listing/`, aligned with **AGENTS.md** and this repo’s NestJS rules.
- **Implementation tasks** to verify alignment, adjust structure only where needed (e.g. colocation, naming), and keep **unit tests** green—**no breaking change** to the public HTTP contract unless an incidental fix is required and documented.

## Capabilities

### New Capabilities

- _(none — structural rules are added as a delta to the existing capability below)_

### Modified Capabilities

- **`path-file-listing`**: Add requirements that the **NestJS** implementation of this capability follows a **vertical slice** (Screaming Architecture): single feature folder, thin controller, business logic in services or colocated pure helpers under that folder, no mixing this capability into app-wide technical-layer folders.

## Impact

- **`apps/api/src/app/path-file-listing/`** — primary focus; may include minor moves/renames or subfolder organization if tasks reveal drift.
- **`apps/api/src/app/app.module.ts`** — should continue to import **feature modules** only (already imports `PathFileListingModule`); no new horizontal layers.
- **Canonical spec** — after archive, `openspec/specs/path-file-listing/spec.md` will include the new requirements.
- **No change** to wire-format path rules or listing JSON shape unless a separate bugfix is discovered during the audit (out of scope unless explicitly pulled in).
