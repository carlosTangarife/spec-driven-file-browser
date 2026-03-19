---
name: /feat-spec-close
id: feat-spec-close
category: Workflow
description: Close an OpenSpec change: archive, then commit + merge to trunk; end on main ready for the next spec
---

Run the **end-of-change** sequence so **trunk** has the work and you are **ready for the next OpenSpec change**.

## When to use

After **`npm test`** is green and implementation is done: close the loop **archive → commit → merge → trunk**.

## Sequence (strict order)

1. **`/opsx:archive <change-name>`** (or **openspec-archive-change** skill)  
   - Moves `openspec/changes/<name>/` → `openspec/changes/archive/YYYY-MM-DD-<name>/`  
   - Sync delta specs to `openspec/specs/` when applicable  

2. **`/feat-merge-main`**  
   - Stages everything, **conventional commit** on the **feature** branch (uses diff + latest archive + `proposal.md` when present)  
   - Checks out **trunk** (`main` / `master`), merges the feature branch  
   - You **finish on trunk** — same as “switch to main immediately” for the next workflow  

3. **Optional**: `git push origin <trunk>` (and delete remote feature branch if you use PRs).

## Next spec

From **trunk**, start the next change with **`/feat-start-change <next-change-name>`**, then proposal/apply as usual.

## Guardrails

- Do not skip **`npm test`** before archive (see **AGENTS.md** and **openspec-archive-change** skill).
- If `/feat-merge-main` reports conflicts, resolve them before pushing.
