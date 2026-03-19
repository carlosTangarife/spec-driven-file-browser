/**
 * Fetches directory listing from the path-file-listing API.
 * Wire path: relative, forward slashes; empty = root.
 */

export interface ListEntry {
  name: string;
  type: 'file' | 'directory';
  relativePath?: string;
}

export const fetchFileListing = (path?: string): Promise<ListEntry[]> => {
  const params = new URLSearchParams();
  if (path != null && path !== '') params.set('path', path);
  const qs = params.toString();
  const url = `/api/listing${qs ? `?${qs}` : ''}`;
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Listing error: ${res.status}`);
    return res.json();
  });
};
