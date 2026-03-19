import { Box, Container, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ListingRequestError } from './api/file-listing.service';
import { useDirectoryTreeQuery } from './hooks/useDirectoryTreeQuery';
import { useFileContentQuery } from './hooks/useFileContentQuery';
import { useLazyTreeChildren } from './hooks/useLazyTreeChildren';
import { useListingNotFoundToast } from './hooks/useListingNotFoundToast';
import { useListingPathState } from './hooks/useListingPathState';
import { useMinCharsHint } from './hooks/useMinCharsHint';
import { mapPreviewDisplayError } from './lib/preview-error.utils';
import { PathInput } from './ui/PathInput';
import { FileContentPreview } from './ui/FileContentPreview';
import { FileTreeView } from './ui/FileTreeView';

/**
 * File browser: path input, lazy tree (expand to load), text preview.
 */
export const FileBrowserPage = () => {
  const { pathInput, setPathInput, listingPath, onKeyDownPathInput } =
    useListingPathState();
  useMinCharsHint(pathInput);

  /** Deferred wire path so typing stays responsive; tree query follows after. */
  const deferredListingPath = useDeferredValue(listingPath);

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const {
    expandedPaths,
    loadedChildren,
    loadingChildPaths,
    onToggleExpand,
  } = useLazyTreeChildren(listingPath);

  useEffect(() => {
    setSelectedFilePath(null);
  }, [listingPath]);

  const {
    data: treeData,
    isFetching: treeLoading,
    error: treeError,
  } = useDirectoryTreeQuery(deferredListingPath, 1);
  useListingNotFoundToast(treeError, deferredListingPath);

  const treeErrorMessage = useMemo(() => {
    if (!treeError) return null;
    if (treeError instanceof ListingRequestError && treeError.status === 404) {
      return null;
    }
    return treeError instanceof Error ? treeError.message : String(treeError);
  }, [treeError]);

  const {
    data: previewData,
    isFetching: previewLoading,
    error: previewError,
  } = useFileContentQuery(selectedFilePath);

  const previewDisplayError = useMemo(
    () => mapPreviewDisplayError(previewError),
    [previewError],
  );

  const handleDirectoryNavigate = useCallback(
    (wirePath: string) => {
      setSelectedFilePath(null);
      setPathInput(wirePath === '' ? '' : `${wirePath}/`);
    },
    [setPathInput],
  );

  const handleFileClick = useCallback((wirePath: string) => {
    setSelectedFilePath(wirePath);
  }, []);

  return (
    <Box
      as="main"
      width="100%"
      minH="100vh"
      px={{ base: 4, sm: 6, md: 10, lg: 12 }}
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="container.xl" mx="auto" width="100%">
        <Stack gap={8}>
          <Heading size="xl">File browser</Heading>
          <PathInput
            value={pathInput}
            onChange={setPathInput}
            onKeyDown={onKeyDownPathInput}
          />

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} alignItems="start">
            <Stack gap={4}>
              <Heading size="md">Tree</Heading>
              <Text fontSize="xs" color="fg.muted">
                Click a folder row to expand or collapse. Double-click to set
                that folder as the current path (adds a trailing slash in the
                field).                 A single folder name (e.g. apps) works without a trailing slash.
                Nested paths without a final slash open that folder when it
                exists; otherwise matching children of the parent are shown (e.g.
                typing apps/a finds apps/apple).
              </Text>
              {treeErrorMessage && (
                <Text colorPalette="red" fontSize="sm" role="alert">
                  {treeErrorMessage}
                </Text>
              )}
              <FileTreeView
                nodes={treeData}
                loading={treeLoading}
                expandedPaths={expandedPaths}
                loadedChildren={loadedChildren}
                loadingChildPaths={loadingChildPaths}
                onToggleExpand={onToggleExpand}
                onDirectoryNavigate={handleDirectoryNavigate}
                onFileClick={handleFileClick}
              />
            </Stack>
            <Stack gap={4}>
              <Heading size="md">Preview</Heading>
              <FileContentPreview
                content={previewData?.content}
                loading={previewLoading}
                error={previewDisplayError}
                truncated={previewData?.truncated}
              />
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};
