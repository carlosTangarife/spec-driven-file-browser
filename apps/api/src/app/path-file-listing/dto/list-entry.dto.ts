/**
 * Single entry in a directory listing response.
 */
export class ListEntryDto {
  /** Base name of the file or directory. */
  name: string;
  /** "file" or "directory". */
  type: 'file' | 'directory';
  /** Relative path under allowed root (optional). */
  relativePath?: string;
}
