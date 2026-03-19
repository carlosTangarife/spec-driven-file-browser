---
description: Archive a completed change in the experimental workflow
---

Archive a completed change in the experimental workflow.

**Canonical instructions (single source):** **`.cursor/commands/opsx-archive.md`**.

That file defines the full sequence: change selection → artifact/task checks → delta spec sync assessment → **`pnpm run verify`** (lint + unit tests) → **`pnpm exec nx e2e api-e2e`** and **`pnpm exec nx e2e web-e2e`** → OpenSpec archive move → summary → **Git close-out** (step **9**). If **e2e** fails, follow the **apply re-review protocol** (minimum **3** passes) in that document before a determinate handoff.

**Input**: Optionally specify a change name after `/opsx:archive`. If omitted, infer from context or prompt via **`openspec list --json`**.

Do **not** skip verification steps; do **not** duplicate the full procedure here — read **`.cursor/commands/opsx-archive.md`** each time.
