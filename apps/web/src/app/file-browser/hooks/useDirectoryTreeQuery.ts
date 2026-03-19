import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '../api/file-listing.service';

const DEFAULT_DEPTH = 1;

/**
 * Loads directory tree for a wire path. Default **depth=1** (one level); expand folders in UI to load more.
 */
export const useDirectoryTreeQuery = (listingPath: string, depth = DEFAULT_DEPTH) =>
  useQuery({
    queryKey: ['directoryTree', listingPath, depth] as const,
    queryFn: () => fetchDirectoryTree(listingPath, depth),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
