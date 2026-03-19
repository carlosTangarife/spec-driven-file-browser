## ADDED Requirements

### Requirement: File text preview endpoint

The API SHALL expose an HTTP operation that accepts a **relative wire path** (same root and traversal rules as `path-file-listing`) identifying a **file**. The server SHALL read a **bounded** portion of the file and return a payload suitable for **text preview** (UTF-8). The implementation SHALL define a **maximum byte length** for preview; if the file exceeds that limit, the response SHALL indicate truncation without loading unbounded data into memory.

#### Scenario: Small UTF-8 text file

- **WHEN** the resolved path exists, is a file, and its size is within the preview limit
- **THEN** the API responds with HTTP **200** and a payload containing the text content (or a documented field holding the text) and metadata sufficient for the client to render preview

#### Scenario: Path does not exist

- **WHEN** the resolved path does not exist
- **THEN** the API responds with HTTP **404** and a stable error payload

#### Scenario: Path is a directory

- **WHEN** the resolved path exists but is a directory
- **THEN** the API responds with HTTP **400** and SHALL NOT return directory contents as file preview

#### Scenario: Binary or undecodable content

- **WHEN** the file is not suitable for UTF-8 text preview (e.g. binary detection policy triggers)
- **THEN** the API responds with HTTP **415** or **400** with a stable error code/message and SHALL NOT stream opaque binary as if it were validated text

#### Scenario: File exceeds preview size cap

- **WHEN** the file size exceeds the configured preview maximum
- **THEN** the API responds with HTTP **413** or returns **200** with explicit **truncation** metadata per documented policy, but SHALL NOT claim full file content without truncation

### Requirement: No reads outside allowed root

File preview SHALL resolve paths only under the configured allowed root using the same resolution rules as directory listing and SHALL NOT read arbitrary absolute paths.

#### Scenario: Traversal attempt

- **WHEN** the client attempts to escape the allowed root
- **THEN** the API responds with HTTP **400** or **403** and SHALL NOT read the file
