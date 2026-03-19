import { useEffect, useRef } from 'react';
import { ListingRequestError } from '../api/file-listing.service';
import { listingToaster } from '../api/listing-toaster';

/**
 * Shows a friendly English toast when the listing API returns 404.
 */
export const useListingNotFoundToast = (
  error: unknown,
  listingPath: string,
): void => {
  const lastToastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      lastToastKey.current = null;
      return;
    }

    if (!(error instanceof ListingRequestError) || error.status !== 404) {
      return;
    }

    const key = `${listingPath}:404`;
    if (lastToastKey.current === key) return;
    lastToastKey.current = key;

    listingToaster.create({
      type: 'error',
      title: 'Path not found',
      description:
        'We could not find that folder under the allowed root. Check the path and try again.',
    });
  }, [error, listingPath]);
};
