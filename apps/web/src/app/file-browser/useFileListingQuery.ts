import { useQuery } from '@tanstack/react-query';
import { fetchFileListing } from './file-listing.service';

/**
 * Loads directory listing for a wire path (relative, `/` segments; empty string = root).
 *
 * @param listingPath - Path used for the API query key and request
 */
export const useFileListingQuery = (listingPath: string) =>
  useQuery({
    queryKey: ['fileListing', listingPath] as const,
    queryFn: () => fetchFileListing(listingPath),
  });
