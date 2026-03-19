---
name: /feat-merge-main
id: feat-merge-main
category: Git
description: Auto-commit (conventional + OpenSpec/diff context) on feature branch, then merge into main
---

Finish the feature: **automatic conventional commit** on the current branch (no interactive prompt unless ambiguous), then **merge into trunk** (`main` or `master`) locally.

## Preconditions (agent MUST verify)

- Git repo: `git rev-parse --is-inside-work-tree`.
- Current branch is **not** trunk (`main` / `master`).
- **Resolve trunk**: prefer `main` if it exists locally or as `origin/main`; else `master`. Command: `git rev-parse --verify main 2>nul` / `git rev-parse --verify master 2>nul` (use shell-appropriate null redirect).

---

## Step 1 — Context

- `git branch --show-current` → `FEATURE_BRANCH`
- `git status -sb`
- If `FEATURE_BRANCH` is trunk → **stop**: user must checkout the feature branch.

---

## Step 2 — Resolve merge base and diff (mandatory for auto message)

- Ensure trunk ref exists locally: `git fetch origin <trunk>:<trunk> 2>/dev/null` optional if safe; if no network, use local trunk only.
- **Diff summary** (always run; drives scope and bullets):
  - `git diff <trunk>...HEAD --stat`
  - `git diff <trunk>...HEAD --name-only` (group by `apps/web`, `apps/api`, `openspec/`, other)

---

## Step 3 — OpenSpec context (use when present; do not require)

If the repo has `openspec/changes/archive/`:

1. Prefer the **most recently modified** archive folder under `openspec/changes/archive/*/` (by filesystem mtime, or sort by folder name `YYYY-MM-DD-*` descending).
2. Read **`proposal.md`** inside that folder:
   - Use **## What Changes** (first 2–4 bullet lines) or **## Why** (one sentence) to inform the commit **body**.
   - Extract **change name** from folder: `archive/YYYY-MM-DD-<change-name>/` → `<change-name>`.
3. If **`openspec/specs/`** gained/updated `spec.md` files matching that capability name, mention in body: `Specs: openspec/specs/<capability>/spec.md`.
4. **Line for body** (always include when archive matched):  
   `Context: archived OpenSpec change <change-name> (archive/YYYY-MM-DD-<change-name>/)`

If **no** archive folder or unreadable: rely entirely on **diff + branch name** (Step 4).

---

## Step 4 — Automatic conventional commit message (no user question)

Build **one** commit with **Conventional Commits**:

### Title line (required)

- Pattern: `<type>(<scope>): <imperative summary>`
- **type**: `feat` if new behavior/UI/API; `fix` if correcting bugs; `chore` for deps-only/tooling; `docs` for docs-only.
- **scope** (pick from diff; first match wins):
  - Only under `apps/web` → `web`
  - Only under `apps/api` → `api`
  - Both apps → `web-api` (or `monorepo` if many roots)
  - Only `openspec/` / archive moves → `openspec`
  - Mixed → use most lines changed from `--stat`, or `web-api`
- **summary**: 50–72 chars, imperative, English.
  - If `FEATURE_BRANCH` matches `feature/<kebab>`: humanize kebab → short phrase, e.g. `feature/file-browser-listing-ux` → `file browser listing UX improvements`
  - Else: one line from the largest functional area in the diff (e.g. “path listing”, “file browser”).

**Examples**

- `feat(web): improve file browser listing UX and layout`
- `feat(api): add path file listing module`
- `feat(web-api): file browser API and UI`

### Body (required for non-trivial changes; optional for tiny)

- 2–6 lines:
  - 1 line from OpenSpec **What Changes** / **Why** if Step 3 applied.
  - Bullets from **diff groups**: e.g. `- web: path input, toasts, prefix filter`, `- openspec: archive file-browser-listing-ux`.
  - Final line if archive used: `Context: archived OpenSpec change <change-name> (...)`.

### Commit execution

- `git add -A`
- If nothing staged and working tree clean → **stop** (“nothing to commit”).
- Commit with **title + body** (two paragraphs). Use multiple `-m` flags or heredoc:

```bash
git commit -m "feat(web): short title here" -m "Body line 1.

- Bullet from diff
- Another bullet

Context: archived OpenSpec change file-browser-listing-ux"
```

**Do not open an editor.** Do not ask the user for the message unless:

- **Ambiguous**: unrelated changes mixed (e.g. huge diff with two features) → propose one message and **one** short confirmation, or split into two commits if user agrees.

---

## Step 5 — Merge into trunk

- `git checkout <trunk>`
- `git pull origin <trunk>` if remote exists and pull is safe; on failure, report and continue or pause per user policy.
- `git merge FEATURE_BRANCH -m "Merge branch 'FEATURE_BRANCH' into <trunk>"`
- On conflict: **stop**, list files; do not resolve blindly.

---

## Step 6 — After merge

- Print current branch (`<trunk>`). The working copy is now **on trunk**, ready for a **new** OpenSpec change.
- Remind: `git push origin <trunk>` (and feature branch if needed) — not automatic.
- **Next spec**: From trunk, run **`/feat-start-change <next-change-name>`** (or `npm run git:feature -- <next-change-name>`) before **`/opsx:apply`** so the next implementation uses a fresh `feature/<name>` branch (see **AGENTS.md**).

---

## Guardrails

- No `--no-verify` / force unless user explicitly requests.
- Commit message language: **English** (aligns with specs and `AGENTS.md` examples).
- Prefer **one squashed-style commit** on the feature branch before merge when this command is used (single commit capturing the whole feature).

---

## Relation to AGENTS.md

Implements **§6 Commit after archive** with **automatic** conventional messages, using **diff vs trunk** + **OpenSpec archive/proposal** when available.

---

## Manual one-liner (not auto-message)

For human-written messages only; prefer the agent flow above for automation.

```powershell
# Not recommended when OpenSpec context exists — use /feat-merge-main in chat instead.
```
