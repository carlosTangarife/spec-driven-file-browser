import { Box, Text, Toaster, ToastRoot } from '@chakra-ui/react';
import type { ToastOptions } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { listingToaster } from './listing-toaster.instance';

const RenderToaster = Toaster as FC<{
  toaster: typeof listingToaster;
  children: (toast: ToastOptions) => ReactNode;
}>;

/**
 * Mount once under the app root next to other providers.
 */
export const ListingToaster = () => (
  <RenderToaster toaster={listingToaster}>
    {(toast: ToastOptions) => (
      <ToastRoot key={toast.id} maxW="min(100vw - 2rem, 28rem)" width="100%" mx="auto">
        <Box px={1} py={0.5}>
          {toast.title != null ? (
            <Text fontWeight="semibold">{toast.title}</Text>
          ) : null}
          {toast.description != null ? (
            <Text fontSize="sm" mt={1}>
              {toast.description}
            </Text>
          ) : null}
        </Box>
      </ToastRoot>
    )}
  </RenderToaster>
);
