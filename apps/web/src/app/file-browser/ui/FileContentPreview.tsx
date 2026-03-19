import { Box, Spinner, Stack, Text } from '@chakra-ui/react';

export type FileContentPreviewProps = {
  content: string | undefined;
  loading: boolean;
  error: Error | null;
  truncated?: boolean;
};

/**
 * Read-only text preview; data comes from hooks — no fetch inside.
 */
export const FileContentPreview = ({
  content,
  loading,
  error,
  truncated,
}: FileContentPreviewProps) => {
  if (loading) {
    return (
      <Box py={4}>
        <Spinner aria-label="Loading preview" />
      </Box>
    );
  }

  if (error) {
    return (
      <Stack gap={1}>
        <Text fontWeight="semibold" colorPalette="red" role="alert">
          Preview unavailable
        </Text>
        <Text fontSize="sm" colorPalette="red">
          {error.message}
        </Text>
      </Stack>
    );
  }

  if (content === undefined) {
    return (
      <Text color="fg.muted" fontSize="sm">
        Select a file in the tree to preview its contents.
      </Text>
    );
  }

  return (
    <Box>
      {truncated && (
        <Text fontSize="xs" color="fg.muted" mb={2}>
          Preview may be truncated.
        </Text>
      )}
      <Box
        as="pre"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        fontSize="sm"
        p={3}
        borderWidth="1px"
        borderRadius="md"
        maxH="320px"
        overflowY="auto"
      >
        {content}
      </Box>
    </Box>
  );
};
