---
name: /opsx-apply
id: opsx-apply
category: Workflow
description: Implement tasks from an OpenSpec change — ensure feature branch + tasks (Experimental)
---

Implement tasks from an OpenSpec change. **`/opsx:propose`** normally **already** created **`feature/<change-name>`**; this command **ensures** you are on that branch (idempotent — same `pnpm run git:feature` step). Finish workflow (archive + commit + merge): **`/opsx:archive`**.

**Setup:** On a new clone or after lockfile changes, run **`pnpm install`** from the repository root before other **`pnpm`** commands (see **README** — Commands).

**Input**: Optionally specify a change name (e.g., `/opsx:apply add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

---

## Git — ensure feature branch (normative)

Work happens on **`feature/<change-name>`**, not on the integration branch. The **change name** is the OpenSpec change **id** (folder under `openspec/changes/<name>/` that contains **`proposal.md`** — use that id, not the proposal title).

**Primary path:** **`/opsx:propose`** already created **`feature/<name>`** — you are usually already checked out there.

**Agent MUST** (same behavior as propose; keeps legacy and manual flows safe):

1. `git rev-parse --is-inside-work-tree` — fail if not a repo.
2. After the change name is known (step **Select the change** below):
   - If already on **`feature/<name>`** for this change, skip branch creation.
   - Else from the **repository root** (directory with `openspec/`), run **`pnpm run git:feature -- <name>`** (same `<name>` as step 1; the script also supports **no** args when exactly one active change exists, but apply always has an explicit name after selection).
3. **Integration branch** resolution for the script is **`trunk`** → **`main`** → **`master`** (see **`scripts/git-feature-from-trunk.mjs`**).
4. On failure (e.g. dirty working tree), **stop** and report — do not implement on **`trunk`** / **`main`** / **`master`**.
5. If **`pnpm`** is unavailable, replicate **`scripts/git-feature-from-trunk.mjs`** behavior.
6. Announce: **Branch ready: `feature/<name>`** (or **Already on `feature/<name>`**).

**If you skipped propose’s branch step:** Run **`pnpm run git:feature -- <name>`** (or **`pnpm run git:feature`** when exactly one active change) **before** continuing from **Check status** onward; same rules as above. See also **`.cursor/commands/opsx-propose.md`** § Git — feature branch.

**When done:** **`/opsx:archive`** (archives OpenSpec and runs commit + merge to integration branch in the same session by default). Details: **AGENTS.md** § Workflow.

**Code quality (mandatory):** When implementing tasks, follow **AGENTS.md** § *Code quality (mandatory)* — one primary unit per file, explicit return types on exports, thin components/controllers, SOLID, low cyclomatic complexity (`apps/web` and `apps/api`). Before considering work complete, run **`pnpm run lint`** (and **`pnpm test`**) for touched apps; **`pnpm run verify`** runs both in sequence.

---

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/opsx:apply <other>`).

2. **Ensure `feature/<name>`**

   Follow **Git — ensure feature branch** above.

3. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

4. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - Context file paths (varies by schema)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using `/opsx:continue`
   - If `state: "all_done"`: congratulate, suggest **`/opsx:archive`**
   - Otherwise: proceed to implementation

5. **Read context files**

   Read the files listed in `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

6. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

7. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

8. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest **`/opsx:archive`**
   - If paused: explain why and wait for guidance

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Next: **`/opsx:archive`** (see **AGENTS.md** § Workflow).
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
