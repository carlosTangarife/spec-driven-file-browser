## Context

The API runs on **Node.js** (NestJS). Callers send a **path** that must **exist** and (for listing) refer to a **directory**. Hosts may be **Windows** or **macOS/Linux**; path syntax and case sensitivity differ. Implementation must use **Node `path` and `fs`** (or `fs/promises`) with explicit rules so behavior is predictable and spec-testable. Work is **orchestrated by OpenSpec**: design and specs are authoritative; code implements them.

## Goals / Non-Goals

**Goals:**

- Accept a path from the client in a **defined format** (see Decisions).
- **Resolve** it against a configurable **allowed root** (base directory); reject attempts to escape that root.
- **Verify existence** with filesystem APIs; if missing or not a directory, return documented errors.
- **List** immediate children (files and subdirectories) with stable fields (name, type, path or relative path).
- Document **Windows vs POSIX** behavior (separators, case, common edge cases).

**Non-Goals:**

- Mutating files (create/delete/rename) in this change.
- Watching the filesystem for changes.
- Guaranteeing identical ordering across platforms beyond “deterministic per request” (sorting can be specified in spec).

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Path representation in API | **Relative path under an allowed root**, using **forward slashes** in the wire format (e.g. `foo/bar`); empty string or `.` means root | Single JSON-friendly format; avoids raw Windows backslashes in JSON; maps cleanly with `path.posix.normalize` for validation segments. |
| Resolution on disk | **`path.resolve(allowedRoot, ...segments)`** after splitting wire path by `/` and rejecting `..` and empty segments | Keeps traversal safe; works on Windows when `allowedRoot` is absolute (e.g. `D:\data` or `/var/data`). |
| Existence check | Use **`fs.promises.stat` or `access`**; listing uses **`readdir` with `withFileTypes`** | Standard Node APIs; `withFileTypes` gives file vs directory without extra stat per entry where possible. |
| Path must exist | If `stat` fails (**ENOENT**) or node is **not a directory** → **404** (or 400 per spec) with stable error body | Matches business rule “path must exist” for listing; clear client contract. |
| Symlinks | **Document** whether listing follows symlinks for the **target path** and for **children**; default recommendation: **do not follow** symlinked directories when resolving the requested path (treat as not found or forbidden) unless spec explicitly allows — **resolve in spec** | Reduces surprise and security issues; pick one behavior in spec. |
| Encoding | API uses **UTF-8**; filenames on disk are read as Node provides (OS-dependent); document that unusual names may need encoding in responses | Practical for REST/JSON. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Windows case-insensitivity vs macOS case-sensitive | Treat wire paths as case-sensitive for segment matching after normalize; rely on OS for final existence; document behavior. |
| UNC paths (`\\server\share`) | Allow only if `allowedRoot` is under UNC and resolution stays under root; document if supported. |
| Very large directories | Optional pagination/max entries in a follow-up spec; mention in Open Questions. |

## Migration Plan

- New behavior: introduce endpoint(s) per spec; no legacy API to migrate unless an older hello-only route exists (can coexist).

## Open Questions

- Maximum number of entries returned per request (pagination).
- Exact symlink policy for requested path and children (recommend: no traversal of symlink as list root without explicit flag).
- Whether to expose **absolute** resolved paths to clients or only **relative** paths under root (privacy / portability).
