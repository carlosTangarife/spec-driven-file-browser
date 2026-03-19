---
name: /opsx-propose
id: opsx-propose
category: Workflow
description: Propose a new change - create it and generate all artifacts in one step
---

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, run **`/opsx:apply`**. Full Git + OpenSpec lifecycle: **AGENTS.md** § Workflow.

---

**Screaming Architecture (every feature)** — **AGENTS.md** is normative. For **each** proposed change:

- **Frontend (`apps/web`)**: Vertical **feature** folders (e.g. `file-browser/`); optional subfolders (`ui/`, `hooks/`, `lib/`, `api/`) inside the feature when the slice grows — not anonymous app-wide `components/` / `hooks/` / `pages/`.
- **Backend (`apps/api`, NestJS)**: Apply the **same** idea — structure by **capability/feature**, not by technical layer at the app root. New or extended API work belongs under a **named feature folder** (e.g. `path-file-listing/`, `file-browser/`) containing module, controller, service, DTOs for that capability. **Do not** plan work that lands in generic root-level `controllers/`, `services/`, or `modules/` folders that mix many features.
- **`design.md`**: MUST include a **Code layout (target)** subsection that names the intended **feature folder(s)** for web and/or API (paths under `apps/web/src/app/…` and `apps/api/src/app/…` or the repo’s equivalent), aligned with Screaming Architecture on **both** sides when the change touches them.

---

**Input**: The argument after `/opsx:propose` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

3. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies

4. **Create artifacts in sequence until apply-ready**

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

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run `/opsx:apply` to start implementing. See **AGENTS.md** § Workflow for branch and close-out."

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
