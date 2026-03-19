import { z } from 'zod';
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
