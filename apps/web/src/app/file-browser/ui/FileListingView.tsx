import {
  ListItem,
  ListRoot,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { ListEntry } from '../lib/list-entry.types';

export type FileListingViewProps = {
  entries: ListEntry[] | undefined;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Renders listing state: spinner, error message, or a styled file/directory list.
 */
export const FileListingView = ({
  entries,
  isLoading,
  error,
}: FileListingViewProps) => {
  if (isLoading) {
    return (
      <Stack align="center" py={6}>
        <Spinner size="lg" />
        <Text color="fg.muted">Loading listing…</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Text colorPalette="red" role="alert">
        {error.message}
      </Text>
    );
  }

  if (!entries?.length) {
    return <Text color="fg.muted">This folder is empty.</Text>;
  }

  return (
    <ListRoot as="ul" gap={1}>
      {entries.map((entry) => (
        <ListItem
          key={entry.relativePath ?? `${entry.name}-${entry.type}`}
          as="li"
          py={1}
          px={2}
          borderRadius="md"
          bg={entry.type === 'directory' ? 'bg.subtle' : 'transparent'}
          fontWeight={entry.type === 'directory' ? 'semibold' : 'normal'}
        >
          <Text as="span" fontFamily="mono" fontSize="sm">
            {entry.type === 'directory' ? '📁 ' : '📄 '}
            {entry.name}
          </Text>
        </ListItem>
      ))}
    </ListRoot>
  );
};
