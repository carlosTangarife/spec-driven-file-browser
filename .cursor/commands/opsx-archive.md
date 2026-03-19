---
name: /opsx-archive
id: opsx-archive
category: Workflow
description: Archive OpenSpec change after lint, unit tests, and e2e pass; then Git close-out (commit, merge to trunk)
---

Archive a completed change and **finish Git in the same session** (conventional commit on the feature branch, merge into the integration branch, checkout that branch). **This command MUST NOT complete** (no OpenSpec move, no Git close-out) until **lint, unit tests, and e2e suites** have been executed and pass (see steps **5** and **6**). Optional opt-out: OpenSpec archive only without Git if the user says so explicitly.

**Input**: Optionally specify a change name after `/opsx:archive` (e.g., `/opsx:archive add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

Normative workflow context: **AGENTS.md** § Workflow.

---

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run `openspec status --change "<name>" --json` to check artifact completion.

   Parse the JSON to understand:
   - `schemaName`: The workflow being used
   - `artifacts`: List of artifacts with their status (`done` or other)

   **If any artifacts are not `done`:**
   - Display warning listing incomplete artifacts
   - Prompt user for confirmation to continue
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.

   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Prompt user for confirmation to continue
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Assess delta spec sync state**

   Check for delta specs at `openspec/changes/<name>/specs/`. If none exist, proceed without sync prompt.

   **If delta specs exist:**
   - Compare each delta spec with its corresponding main spec at `openspec/specs/<capability>/spec.md`
   - Determine what changes would be applied (adds, modifications, removals, renames)
   - Show a combined summary before prompting

   **Prompt options:**
   - If changes needed: "Sync now (recommended)", "Archive without syncing"
   - If already synced: "Archive now", "Sync anyway", "Cancel"

   If user chooses sync, use Task tool (subagent_type: "general-purpose", prompt: "Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"). Proceed to archive regardless of choice.

5. **Run lint and unit tests — `api` and `web` (mandatory — blocks archive if red)**

   From the **repository root**, require **green** **lint** (for touched apps) and **unit tests** before e2e or any OpenSpec move:

   - **Preferred:** **`pnpm run verify`** — runs **`pnpm run lint`** then **`pnpm test`** (ESLint on **`apps/web/src`** and **`apps/api/src`**, then Vitest for **api** and **web**).
   - **Split:** **`pnpm run lint`** and **`pnpm test`** (or **`pnpm exec nx test api`** and **`pnpm exec nx test web`**) — **all** must exit **0**.

   **If any fails:** **STOP** immediately. Do **not** run step **6** (e2e), step **7** (Perform the archive), or step **9** (Git close-out). Report failing output; fix and re-run **`/opsx:archive`**.

   Do not skip tests or lint, ignore failures, or use workarounds (e.g. `passWithNoTests` where tests are required) to fake success. Aligns with **AGENTS.md** (ESLint, Vitest, AAA).

6. **Run end-to-end tests — `api-e2e` and `web-e2e` (mandatory — blocks archive if red)**

   After step **5** is green, from the **repository root** run **both** Nx e2e targets (they start or depend on **`api:serve`** as configured in each project):

   - **`pnpm exec nx e2e api-e2e`**
   - **`pnpm exec nx e2e web-e2e`**

   **Both** must exit **0**. Do **not** archive or run Git close-out if either fails.

   **If e2e fails — apply re-review protocol (minimum 3 passes before stopping):**

   1. **Do not** perform the OpenSpec archive move or Git close-out. State clearly that archive is **blocked** on e2e.
   2. Run **at least three** structured **apply re-review** passes. Each pass MUST:
      - Re-read **`tasks.md`** and **`openspec/changes/<name>/specs/`** (or delta specs) for the change.
      - Re-inspect **git diff** / files touched during **`/opsx:apply`** against those tasks and specs.
      - Record: suspected root cause, files to fix, and whether the failure matches a missing test or a product bug.
   3. After each pass, either implement a fix and **re-run the failed e2e** (then the other e2e if needed), or document what was ruled out.
   4. Only after **three** full passes may you end with a **determinate** blocked handoff: a short written summary (what failed, what was checked 3×, what remains). Do **not** leave the workflow in a vague or **indeterminate** state (“unknown”, “maybe”) without having completed these three passes.

   Optional: if the user **explicitly** opts out of e2e for a given archive (e.g. environment cannot run browsers), document that opt-out in the reply; default is **e2e required**.

7. **Perform the archive**

   Create the archive directory if it doesn't exist:
   ```bash
   mkdir -p openspec/changes/archive
   ```

   Generate target name using current date: `YYYY-MM-DD-<change-name>`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming existing archive or using different date
   - If no: Move the change directory to archive

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

8. **Display summary (OpenSpec only)**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Spec sync status (synced / sync skipped / no delta specs)
   - Note about any warnings (incomplete artifacts/tasks)

9. **Git close-out (mandatory — same session)** unless the user **explicitly** opts out of Git (OpenSpec-only archive).

   **9.1 — Preconditions**

   - `git rev-parse --is-inside-work-tree`
   - **Resolve integration branch** `<integration>`: **`trunk`** → **`main`** → **`master`** (first that exists locally — same order as **`scripts/git-feature-from-trunk.mjs`**).
   - Current branch must be **`feature/<change-name>`** for this archived change. If current branch equals `<integration>` → **stop** (checkout the feature branch first). If not on the correct feature branch → **stop** and instruct.

   **9.2 — Context and diff (for auto commit message)**

   - `git branch --show-current` → `FEATURE_BRANCH`
   - `git status -sb`
   - Optional: `git fetch origin <integration>:<integration>` if safe; if no network, use local only.
   - Always run:
     - `git diff <integration>...HEAD --stat`
     - `git diff <integration>...HEAD --name-only` (group by `apps/web`, `apps/api`, `openspec/`, other)

   **9.3 — OpenSpec context for the commit body (when present)**

   If `openspec/changes/archive/` exists:

   1. Prefer the **most recently modified** folder under `openspec/changes/archive/*/` (mtime or sort `YYYY-MM-DD-*` descending).
   2. Read **`proposal.md`**: use **## What Changes** (2–4 bullets) or **## Why** (one line) for the body.
   3. Change name from folder: `archive/YYYY-MM-DD-<change-name>/`.
   4. If `openspec/specs/` updated matching capability, mention in body.
   5. Include when matched: `Context: archived OpenSpec change <change-name> (archive/YYYY-MM-DD-<change-name>/)`

   If no archive readable: use **diff + branch name** only.

   **9.4 — Conventional commit (no editor)**

   - **Title:** `<type>(<scope>): <imperative summary>` — **type**: `feat` / `fix` / `chore` / `docs` by change kind.
   - **scope** (first match from diff): only `apps/web` → `web`; only `apps/api` → `api`; both → `web-api`; only openspec → `openspec`; else strongest from `--stat`.
   - **summary:** 50–72 chars, English, imperative; if branch is `feature/<kebab>`, humanize kebab for a short phrase.
   - **Body:** 2–6 lines — OpenSpec lines if any, bullets from diff groups, final `Context:` line if archive matched.
   - `git add -A`. If nothing to commit and clean → **stop** (“nothing to commit”).
   - `git commit` with **title + body** (multiple `-m` or heredoc). **Do not open an editor.**
   - Only ask the user if the diff mixes unrelated features (ambiguous).

   **9.5 — Merge into integration branch**

   - `git checkout <integration>`
   - `git pull origin <integration>` if remote exists and safe
   - `git merge FEATURE_BRANCH -m "Merge branch 'FEATURE_BRANCH' into <integration>"`
   - On conflict: **stop**, list files.

   **9.6 — After merge**

   - Print current branch (`<integration>`). Working copy is on the integration branch; next work: **AGENTS.md** § Workflow step **6**.
   - Remind: `git push origin <integration>` (and feature branch if used) — not automatic.

   **Git close-out guardrails:** No `--no-verify` / `--force` unless the user asks. Commit messages in **English**. Prefer **one** commit on the feature branch before merge when using this flow.

---

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs
**Tests:** ✓ lint + `api` + `web` unit tests + **`api-e2e`** + **`web-e2e`** (before archive)

All artifacts complete. All tasks complete.

Git: conventional commit + merge to integration branch + checkout completed.
```

**Output On Success (No Delta Specs)**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** No delta specs
**Tests:** ✓ lint + `api` + `web` unit tests + **`api-e2e`** + **`web-e2e`** (before archive)

All artifacts complete. All tasks complete.

Git: conventional commit + merge to integration branch + checkout completed.
```

**Output On Success With Warnings**

```
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** Sync skipped (user chose to skip)

**Warnings:**
- Archived with 2 incomplete artifacts
- Archived with 3 incomplete tasks
- Delta spec sync was skipped (user chose to skip)

Review the archive if this was not intentional.
```

**Output On Error (Archive Exists)**

```
## Archive Failed

**Change:** <change-name>
**Target:** openspec/changes/archive/YYYY-MM-DD-<name>/

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
```

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (`openspec status --json`) for completion checking
- **Steps 5–6 (lint + unit tests + e2e) are mandatory** — if any fail, **do not** archive or run Git close-out; on e2e failure follow **step 6** apply re-review protocol (minimum **3** passes) before a determinate handoff
- Don't block archive on *other* warnings (incomplete artifacts/tasks with user confirm) — inform and confirm
- Preserve `.openspec.yaml` when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, use the Skill tool to invoke `openspec-sync-specs` (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting
- After OpenSpec archive succeeds, run **step 9** unless the user opts out of Git; full workflow: **AGENTS.md** § Workflow
