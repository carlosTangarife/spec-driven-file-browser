## Why

We need a **clear, testable contract** for an API that lists files and folders for a **caller-supplied path**. That path **must exist** on the filesystem before listing is allowed. The product is **AI-first**: implementation must follow OpenSpec (proposal → design → specs → tasks), not ad-hoc code. Defining **cross-platform file semantics** (Windows and macOS/Linux) up front avoids subtle bugs and keeps agents aligned with business intent.

## What Changes

- **API contract**: Expose an endpoint that accepts a **path** (or path identifier) identifying a directory to list. If the path does not exist or is not a directory, the API returns an explicit error (e.g. 404) and **does not** infer or create paths.
- **Cross-platform rules**: Document how paths are represented in requests and how they are resolved and validated on disk (separators, drive letters, UNC, normalization, allowed root).
- **Governance**: This change is the **source of truth** for behavior; future code changes must trace to these specs and tasks.

## Capabilities

### New Capabilities

- `path-file-listing`: API accepts a path for listing; path must exist and be listable; behavior and errors are specified for missing paths, non-directories, and traversal outside an allowed root. Cross-platform filesystem rules are part of this capability.

### Modified Capabilities

- _(none — this change refines and formalizes listing-by-path; if an older spec exists elsewhere, align or supersede in archive phase.)_

## Impact

- **Backend** (`apps/api`): NestJS feature module(s) implementing path validation, resolution, and listing per spec.
- **Consumers**: React app and any future clients must use the agreed path representation (e.g. relative segments under root, or normalized string per design).
- **Documentation**: `AGENTS.md` remains high-level; **this change** carries the normative business and technical rules for path-based listing.
