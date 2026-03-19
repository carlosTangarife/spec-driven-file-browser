import { useEffect } from 'react';
import { listingToaster } from './listing-toaster';

/**
 * After 3 seconds with exactly one character in the path field, shows a hint toast (English).
 */
export const useMinCharsHint = (pathInput: string): void => {
  useEffect(() => {
    if (pathInput.length !== 1) return;

    const id = window.setTimeout(() => {
      listingToaster.create({
        type: 'info',
        title: 'Keep typing',
        description:
          'Enter at least 3 characters to filter folder and file names by prefix.',
      });
    }, 3000);

    return () => window.clearTimeout(id);
  }, [pathInput]);
};
