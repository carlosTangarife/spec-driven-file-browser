import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ListingRequestError } from './api/file-listing.service';
import { useFileListingQuery } from './hooks/useFileListingQuery';
import { useListingNotFoundToast } from './hooks/useListingNotFoundToast';
import { useListingPathState } from './hooks/useListingPathState';
import { useMinCharsHint } from './hooks/useMinCharsHint';
import { filterEntriesByNamePrefix } from './lib/path-input.utils';
import { PathInput } from './ui/PathInput';
import { FileListingView } from './ui/FileListingView';

/**
 * File browser: debounced listing wire path, name prefix filter, toasts, responsive shell.
 */
export const FileBrowserPage = () => {
  const { pathInput, setPathInput, namePrefix, listingPath, onKeyDownPathInput } =
    useListingPathState();
  useMinCharsHint(pathInput);

  const { data, isFetching, error } = useFileListingQuery(listingPath);
  useListingNotFoundToast(error, listingPath);

  const filteredEntries = useMemo(
    () => (data ? filterEntriesByNamePrefix(data, namePrefix) : data),
    [data, namePrefix],
  );

  const queryError = useMemo(() => {
    if (!error) return null;
    if (error instanceof ListingRequestError && error.status === 404) {
      return new Error(
        'This folder path does not exist under the allowed root.',
      );
    }
    return error instanceof Error ? error : new Error(String(error));
  }, [error]);

  return (
    <Box
      as="main"
      width="100%"
      minH="100vh"
      px={{ base: 4, sm: 6, md: 10, lg: 12 }}
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="container.lg" mx="auto" width="100%">
        <Stack gap={8}>
          <Heading size="xl">File browser</Heading>
          <PathInput
            value={pathInput}
            onChange={setPathInput}
            onKeyDown={onKeyDownPathInput}
          />
          <FileListingView
            entries={filteredEntries}
            isLoading={isFetching}
            error={queryError}
          />
        </Stack>
      </Container>
    </Box>
  );
};
