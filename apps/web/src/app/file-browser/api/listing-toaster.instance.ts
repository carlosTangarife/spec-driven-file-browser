import { createToaster } from '@chakra-ui/react';

/**
 * Shared toaster instance for listing-related notifications (404, min-length hint).
 */
export const listingToaster = createToaster({
  placement: 'bottom',
  duration: 5000,
  offsets: { bottom: '1rem' },
});
