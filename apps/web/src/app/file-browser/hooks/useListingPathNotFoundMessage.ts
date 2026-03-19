import { useMemo } from 'react';
import { ListingRequestError } from '../api/file-listing.service';

/** English copy for tree/listing anchor 404 (after client fallback). */
export const LISTING_PATH_NOT_FOUND_DESCRIPTION =
  'We could not find that folder under the allowed root. Check the path and try again.';

/**
 * Returns a stable user-facing message when the tree query ends in 404; otherwise
 * null. Use the `error` from the directory-tree query (already scoped to the
 * current deferred wire path).
 */
export const useListingPathNotFoundMessage = (error: unknown): string | null => {
  return useMemo(() => {
    if (!error) {
      return null;
    }
    if (!(error instanceof ListingRequestError) || error.status !== 404) {
      return null;
    }
    return LISTING_PATH_NOT_FOUND_DESCRIPTION;
  }, [error]);
};
