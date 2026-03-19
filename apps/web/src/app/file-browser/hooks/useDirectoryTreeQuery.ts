import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTreeWithFallback } from '../api/file-listing.service';

const DEFAULT_DEPTH = 1;

/**
 * Loads directory tree for a wire path. On **404**, falls back to parent + prefix filter
 * when the path contains `/` (see `fetchDirectoryTreeWithFallback`).
 */
export const useDirectoryTreeQuery = (listingPath: string, depth = DEFAULT_DEPTH) =>
  useQuery({
    queryKey: ['directoryTree', listingPath, depth] as const,
    queryFn: () => fetchDirectoryTreeWithFallback(listingPath, depth),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
