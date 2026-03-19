## ADDED Requirements

### Requirement: Omission of VCS and metadata directory names from listings

The server SHALL omit certain **immediate child** entries from **flat directory listing** and from **directory tree** responses when those children are directories whose **names** match documented omission rules. Omission applies only to **name-based** filtering at listing time; the client MAY still request a deeper **wire path** that traverses under an omitted name if the path is supplied explicitly (e.g. typed path input), unless a separate security policy forbids it.

#### Scenario: VCS root folders are hidden from children lists

- **WHEN** a directory contains immediate subdirectories named **`.git`**, **`.github`**, **`.svn`**, or **`.hg`**
- **THEN** those entries SHALL NOT appear in flat listing or tree node **children** arrays for that parent

#### Scenario: Directories whose name starts with `.git` are hidden

- **WHEN** a directory contains an immediate **subdirectory** whose name starts with the prefix **`.git`**
- **THEN** that subdirectory SHALL NOT appear in flat listing or tree node **children** arrays for that parent

#### Scenario: Prefix rule does not remove non-directory files

- **WHEN** an immediate child is a **file** whose name starts with **`.git`** (e.g. a **`.gitignore`** file)
- **THEN** the **prefix** rule SHALL NOT apply (only directories use the prefix rule); the file SHALL appear unless an **exact-name** omission rule applies
