import {
  Box,
  CloseButton,
  Container,
  Heading,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import { ListingRequestError } from './api/file-listing.service';
import { useDirectoryTreeQuery } from './hooks/useDirectoryTreeQuery';
import { useFileContentQuery } from './hooks/useFileContentQuery';
import { useLazyTreeChildren } from './hooks/useLazyTreeChildren';
import { useListingPathNotFoundMessage } from './hooks/useListingPathNotFoundMessage';
import { useListingPathState } from './hooks/useListingPathState';
import { useMinCharsHint } from './hooks/useMinCharsHint';
import { mapPreviewDisplayError } from './lib/preview-error.utils';
import { splitWirePathForPreviewTitle } from './lib/preview-dialog-title.utils';
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

  const pathNotFoundMessage = useListingPathNotFoundMessage(treeError);

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

  /** Below `lg`: preview opens in a modal; at `lg+` inline in the second column. */
  const isNarrowViewport = useBreakpointValue({ base: true, lg: false }) ?? false;

  const isPreviewDialogOpen = isNarrowViewport && selectedFilePath !== null;

  useEffect(() => {
    if (!isPreviewDialogOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFilePath(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPreviewDialogOpen]);

  const previewPanel = (
    <FileContentPreview
      content={previewData?.content}
      loading={previewLoading}
      error={previewDisplayError}
      truncated={previewData?.truncated}
    />
  );

  const previewModalTitle = useMemo(() => {
    if (!selectedFilePath) {
      return { directoryLabel: '', fileName: '' };
    }
    return splitWirePathForPreviewTitle(selectedFilePath);
  }, [selectedFilePath]);

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
          {pathNotFoundMessage != null ? (
            <Box
              role="alert"
              width="100%"
              borderWidth="1px"
              borderRadius="md"
              borderColor="red.muted"
              bg="red.subtle"
              p={3}
            >
              <Text fontWeight="semibold" colorPalette="red">
                Path not found
              </Text>
              <Text fontSize="sm" mt={1} colorPalette="red">
                {pathNotFoundMessage}
              </Text>
            </Box>
          ) : null}
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
            {!isNarrowViewport && (
              <Stack gap={4}>
                <Heading size="md">Preview</Heading>
                {previewPanel}
              </Stack>
            )}
          </SimpleGrid>

          {isPreviewDialogOpen && (
            <Portal>
              <Box
                position="fixed"
                inset={0}
                zIndex="modal"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="blackAlpha.600"
                onClick={() => setSelectedFilePath(null)}
              >
                <Box
                  role="dialog"
                  aria-modal="true"
                  aria-label={
                    selectedFilePath
                      ? `Preview: ${selectedFilePath}`
                      : 'File preview'
                  }
                  onClick={(e: MouseEvent) => e.stopPropagation()}
                  bg="bg"
                  borderRadius="lg"
                  boxShadow="lg"
                  borderWidth="1px"
                  maxW="lg"
                  w={{ base: '92vw', sm: '90vw' }}
                  maxH="85vh"
                  display="flex"
                  flexDirection="column"
                  p={4}
                >
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    gap={2}
                    mb={3}
                    flexShrink={0}
                  >
                    <Box id="file-preview-dialog-title" flex="1" minW={0}>
                      {previewModalTitle.directoryLabel ? (
                        <>
                          <Text
                            fontSize="xs"
                            color="fg.muted"
                            lineHeight="short"
                            wordBreak="break-all"
                          >
                            {previewModalTitle.directoryLabel}
                          </Text>
                          <Heading size="md" lineClamp={2}>
                            {previewModalTitle.fileName}
                          </Heading>
                        </>
                      ) : (
                        <Heading size="md" lineClamp={2}>
                          {previewModalTitle.fileName}
                        </Heading>
                      )}
                    </Box>
                    <CloseButton
                      aria-label="Close preview"
                      size="sm"
                      flexShrink={0}
                      onClick={() => setSelectedFilePath(null)}
                    />
                  </Box>
                  <Box overflowY="auto" flex="1" minH={0}>
                    {previewPanel}
                  </Box>
                </Box>
              </Box>
            </Portal>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
