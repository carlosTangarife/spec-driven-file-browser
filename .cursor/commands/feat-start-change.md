---
name: /feat-start-change
id: feat-start-change
category: Git
description: Create feature/<name> from trunk; name inferred from OpenSpec when a single active change exists
---

Start **implementation** on the correct Git branch before **`/opsx:apply`** (see **AGENTS.md**).

## Input

- **Optional**: OpenSpec change name in **kebab-case** (same as `openspec/changes/<name>/`).
- If **omitted**: infer the name from **`openspec list --json`** — only when there is **exactly one** active change; otherwise stop and ask the user to pass `<change-name>`.

## Steps (agent MUST run)

1. `git rev-parse --is-inside-work-tree` — fail if not a repo.
2. Resolve trunk: prefer **`main`**, else **`master`** (`git rev-parse --verify`).
3. From the **repository root**, run **`npm run git:feature`** with **no extra args** to auto-pick the branch name from the sole active OpenSpec change.
   - If the user gave an explicit name, run **`npm run git:feature -- <kebab-name>`** instead.
   - If npm is unavailable, replicate the logic in **`scripts/git-feature-from-trunk.mjs`** (infer via `openspec list --json` when one change; else require a name).

## Output

- Print current branch (must be `feature/<kebab-name>`).
- If inference was used, echo the resolved change name (matches OpenSpec folder / tasks).
- Remind: next step is **`/opsx:apply`** (same change name if inferred) or continue tasks on this branch.

## Relation to AGENTS.md

The Git branch name **`feature/<change-name>`** matches the **OpenSpec change name** (the folder under `openspec/changes/` and the name used by `openspec` tasks) so trunk stays clean and each change maps to one branch without manual naming when only one change is active.
