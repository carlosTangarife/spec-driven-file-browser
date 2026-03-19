import { z } from 'zod';
import {
  filterTreeNodesByNestedPrefix,
  parseNestedPathForTreeFallback,
} from '../lib/path-input.utils';
import type { ListEntry } from '../lib/list-entry.types';

/**
 * Fetches directory listing from the path-file-listing API.
 * Wire path: relative, forward slashes; empty = root.
 */

export type { ListEntry };

/** Thrown when the listing HTTP response is not OK; includes HTTP status for UI handling. */
export class ListingRequestError extends Error {
  constructor(
    readonly status: number,
    message?: string,
  ) {
    super(message ?? `Listing error: ${status}`);
    this.name = 'ListingRequestError';
  }
}

/** Zod schema aligned with the API `ListEntry` shape (optional `relativePath`). */
export const listEntrySchema = z.object({
  name: z.string(),
  type: z.enum(['file', 'directory']),
  relativePath: z.string().optional(),
});

export const listEntriesSchema = z.array(listEntrySchema);

export const fetchFileListing = (path?: string): Promise<ListEntry[]> => {
  const params = new URLSearchParams();
  if (path != null && path !== '') params.set('path', path);
  const qs = params.toString();
  const url = `/api/listing${qs ? `?${qs}` : ''}`;
  return fetch(url).then(async (res) => {
    if (!res.ok) throw new ListingRequestError(res.status);
    const json: unknown = await res.json();
    return listEntriesSchema.parse(json);
  });
};

/** Nested directory tree node (matches API `TreeNodeDto`). */
export type DirectoryTreeNode = {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children: DirectoryTreeNode[];
};

export const directoryTreeNodeSchema: z.ZodType<DirectoryTreeNode> = z.lazy(() =>
  z.object({
    name: z.string(),
    type: z.enum(['file', 'directory']),
    path: z.string(),
    children: z.array(directoryTreeNodeSchema),
  }),
);

export const directoryTreeSchema = z.array(directoryTreeNodeSchema);

/**
 * Fetches nested directory tree from `GET /api/listing/tree`.
 */
export const fetchDirectoryTree = (
  path: string | undefined,
  depth = 3,
): Promise<DirectoryTreeNode[]> => {
  const params = new URLSearchParams();
  if (path != null && path !== '') params.set('path', path);
  params.set('depth', String(depth));
  const url = `/api/listing/tree?${params.toString()}`;
  return fetch(url).then(async (res) => {
    if (!res.ok) throw new ListingRequestError(res.status);
    const json: unknown = await res.json();
    return directoryTreeSchema.parse(json);
  });
};

/**
 * Loads tree for `primaryPath`; on **404**, if the path looks like `parent/lastSegment`,
 * loads `parent` and filters immediate children by `lastSegment` (prefix, case-insensitive).
 */
export const fetchDirectoryTreeWithFallback = async (
  primaryPath: string,
  depth: number,
): Promise<DirectoryTreeNode[]> => {
  try {
    return await fetchDirectoryTree(primaryPath, depth);
  } catch (e) {
    if (!(e instanceof ListingRequestError) || e.status !== 404) throw e;
    const parsed = parseNestedPathForTreeFallback(primaryPath);
    if (!parsed) throw e;
    const { parentPath, lastSegment } = parsed;
    const nodes = await fetchDirectoryTree(parentPath, depth);
    return filterTreeNodesByNestedPrefix(nodes, lastSegment);
  }
};
