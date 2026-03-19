---
name: openspec-archive-change
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.2.0"
---

Archive a completed change in the experimental workflow.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

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
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.

   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Assess delta spec sync state**

   Same as **`.cursor/commands/opsx-archive.md`** step **4**. Check for delta specs at `openspec/changes/<name>/specs/`. Prompt sync vs archive-without-sync when applicable. Use openspec-sync-specs when the user chooses sync.

5. **Run lint and unit tests — `api` and `web` (mandatory — block archive if red)**

   Same as **opsx-archive** step **5**: **`pnpm run verify`** (or equivalent **`pnpm run lint`** + **`pnpm test`** / scoped **`nx test`**). If **any** fails: **STOP**; do not run e2e or archive. See **AGENTS.md**.

6. **Run e2e — `api-e2e` and `web-e2e` (mandatory — block archive if red)**

   Same as **opsx-archive** step **6**: from repo root, **`pnpm exec nx e2e api-e2e`** and **`pnpm exec nx e2e web-e2e`** — **both** exit **0**. If e2e fails: **do not** archive; follow **apply re-review protocol** (minimum **3** passes over tasks/specs/diff vs **`/opsx:apply`** output) before a determinate handoff — full rules in **opsx-archive** step **6**.

7. **Perform the archive** (only after steps **5–6** are green)

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

   Same as **opsx-archive** step **8**: change name, schema, archive path, spec sync status, warnings.

9. **Git close-out (mandatory — same session)**

   After a successful archive, execute **Git close-out** per **`.cursor/commands/opsx-archive.md`** step **9** (same session unless the user opts out). **AGENTS.md** § Workflow.

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.

Git: conventional commit + merge to integration branch + checkout completed (`/opsx:archive` step 9).
```

**Guardrails**
- **Block archive** if **`pnpm run verify`** or **e2e** fails; do not move the change directory
- On **e2e** failure, run at least **3** apply re-review passes before a non-vague stop (see **opsx-archive** step **6**)
- After archive, run **opsx-archive step 9** unless the user opts out (**AGENTS.md** § Workflow)
- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Don't block archive on other warnings (incomplete tasks with user confirm) except **failing lint/unit/e2e** — those always block
- Preserve .openspec.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, use openspec-sync-specs approach (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting
