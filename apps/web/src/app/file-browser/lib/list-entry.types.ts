/**
 * Listing row shape aligned with the path-file-listing API (shared with Zod in `api/`).
 */
export interface ListEntry {
  name: string;
  type: 'file' | 'directory';
  relativePath?: string;
}
