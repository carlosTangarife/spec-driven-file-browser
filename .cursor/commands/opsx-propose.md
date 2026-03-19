---
name: /opsx-propose
id: opsx-propose
category: Workflow
description: Propose a new change - feature branch, create it, and generate all artifacts in one step
---

Propose a new change - create the change and generate all artifacts in one step.

This command **includes** creating or switching to **`feature/<change-name>`** before **`openspec new change`** (idempotent if you are already on the right branch). **`/opsx:apply`** runs the same ensure step again for safety.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, run **`/opsx:apply`**. Full Git + OpenSpec lifecycle: **AGENTS.md** § Workflow.

---

## Git — feature branch (normative)

Work for this change happens on **`feature/<change-name>`**, not on the integration branch. The **change name** is the kebab-case id you will use for `openspec/changes/<name>/` (same as the OpenSpec change **id** — use that id, not a free-form title).

**Agent MUST:**

1. `git rev-parse --is-inside-work-tree` — fail if not a repo.
2. After the change **`<name>`** is known (step **If no input provided…** below), **before** `openspec new change`:
   - If already on **`feature/<name>`** for this change, skip branch creation.
   - Else from the **repository root** (directory with `openspec/`), run **`pnpm run git:feature -- <name>`**.
3. **Integration branch** resolution for the script is **`trunk`** → **`main`** → **`master`** (see **`scripts/git-feature-from-trunk.mjs`**).
4. On failure (e.g. dirty working tree), **stop** and report — do not create the change on **`trunk`** / **`main`** / **`master`**.
5. If **`pnpm`** is unavailable, replicate **`scripts/git-feature-from-trunk.mjs`** behavior.
6. Announce: **Branch ready: `feature/<name>`**.

**Without this step:** If artifacts were created manually on the wrong branch, run **`pnpm run git:feature -- <name>`** (or move work as appropriate) before continuing; **`/opsx:apply`** also **ensures** the feature branch if you skipped propose’s Git step.

---

**Screaming Architecture (every feature)** — **AGENTS.md** is normative. For **each** proposed change:

- **Frontend (`apps/web`)**: Vertical **feature** folders (e.g. `file-browser/`); optional subfolders (`ui/`, `hooks/`, `lib/`, `api/`) inside the feature when the slice grows — not anonymous app-wide `components/` / `hooks/` / `pages/`.
- **Backend (`apps/api`, NestJS)**: Apply the **same** idea — structure by **capability/feature**, not by technical layer at the app root. New or extended API work belongs under a **named feature folder** (e.g. `path-file-listing/`, `file-browser/`) containing module, controller, service, DTOs for that capability. **Do not** plan work that lands in generic root-level `controllers/`, `services/`, or `modules/` folders that mix many features.
- **`design.md`**: MUST include a **Code layout (target)** subsection that names the intended **feature folder(s)** for web and/or API (paths under `apps/web/src/app/…` and `apps/api/src/app/…` or the repo’s equivalent), aligned with Screaming Architecture on **both** sides when the change touches them.
- **Code quality (mandatory):** **AGENTS.md** § *Code quality (mandatory)* — plan **one primary** component/hook/service per file where practical, thin UI/controllers, explicit return types, low complexity. `tasks.md` SHOULD name files that respect this.

---

**Input**: The argument after `/opsx:propose` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create or switch to `feature/<name>`**

   Follow **Git — feature branch** above.

3. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

4. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies

5. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `outputPath`: Where to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

   b. **Continue until all `applyRequires` artifacts are complete**
      - After creating each artifact, re-run `openspec status --change "<name>" --json`
      - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
      - Stop when all `applyRequires` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

6. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Note: **`feature/<name>`** should already exist from this command; **`/opsx:apply`** will still ensure you are on it.
- Prompt: "Run `/opsx:apply` to start implementing. See **AGENTS.md** § Workflow for close-out (**`/opsx:archive`**)."

**Artifact Creation Guidelines**

- **Before writing artifacts**, read **[AGENTS.md](../../AGENTS.md)** (Screaming Architecture for React **and** NestJS) so `proposal.md`, **`design.md`**, and `tasks.md` reflect feature-based layout on **backend and frontend** where applicable.
- Follow the `instruction` field from `openspec instructions` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output file - fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file
  - Do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact
  - These guide what you write, but should never appear in the output

**Guardrails**
- **Screaming Architecture on the API** is not optional for feature work: every propose pass that includes backend scope must place NestJS code in a **feature-named** folder structure per **AGENTS.md**; reflect that in **`design.md` Code layout (target)** and in tasks.
- Create ALL artifacts needed for implementation (as defined by schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next
