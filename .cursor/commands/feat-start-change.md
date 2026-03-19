---
name: /feat-start-change
id: feat-start-change
category: Git
description: Create and checkout feature/<change-name> from trunk (main/master) for OpenSpec work
---

Start **implementation** on the correct Git branch before **`/opsx:apply`** (see **AGENTS.md**).

## Input

- **Required**: OpenSpec change name in **kebab-case** (same as `openspec/changes/<name>/`), e.g. `feat-start-change my-feature-name`.

## Steps (agent MUST run)

1. `git rev-parse --is-inside-work-tree` — fail if not a repo.
2. Resolve trunk: prefer **`main`**, else **`master`** (`git rev-parse --verify`).
3. Prefer **`npm run git:feature -- <kebab-name>`** from the workspace root (runs `scripts/git-feature-from-trunk.mjs`).
   - If npm is unavailable, equivalent:
     - Require a **clean** working tree (or stop with a clear message).
     - `git checkout <trunk>` && `git pull --ff-only` (warn on failure).
     - If branch `feature/<kebab-name>` exists → `git checkout` it; else `git checkout -b feature/<kebab-name>`.

## Output

- Print current branch (must be `feature/<kebab-name>`).
- Remind: next step is **`/opsx:apply <name>`** (or continue tasks on this branch).

## Relation to AGENTS.md

Implements **“Apply → feature branch from trunk”** so trunk stays clean and each OpenSpec change maps to one branch.
