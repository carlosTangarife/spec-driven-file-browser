import { Box, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { memo, useCallback, type SyntheticEvent } from 'react';
import type { DirectoryTreeNode } from '../api/file-listing.service';

export type FileTreeViewProps = {
  nodes: DirectoryTreeNode[] | undefined;
  loading: boolean;
  expandedPaths: ReadonlySet<string>;
  loadedChildren: Readonly<Record<string, DirectoryTreeNode[]>>;
  loadingChildPaths: ReadonlySet<string>;
  onToggleExpand: (wirePath: string) => void;
  /** Sets the path input to this folder (e.g. double-click). */
  onDirectoryNavigate: (wirePath: string) => void;
  onFileClick: (wirePath: string) => void;
};

type RowProps = {
  node: DirectoryTreeNode;
  depth: number;
} & Omit<FileTreeViewProps, 'nodes' | 'loading'>;

const TreeRow = memo(function TreeRow({
  node,
  depth,
  expandedPaths,
  loadedChildren,
  loadingChildPaths,
  onToggleExpand,
  onDirectoryNavigate,
  onFileClick,
}: RowProps) {
  const pad = 8 + depth * 14;
  const isDir = node.type === 'directory';
  const expanded = isDir && expandedPaths.has(node.path);
  const loadingKids = isDir && loadingChildPaths.has(node.path);
  const branchChildren =
    isDir && expanded ? (loadedChildren[node.path] ?? []) : [];

  const stop = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  if (!isDir) {
    return (
      <Text
        as="button"
        type="button"
        display="block"
        width="100%"
        textAlign="left"
        py={1}
        pl={`${pad}px`}
        borderRadius="md"
        cursor="pointer"
        fontSize="sm"
        onClick={() => onFileClick(node.path)}
      >
        📄 {node.name}
      </Text>
    );
  }

  return (
    <Box>
      <HStack
        gap={1}
        pl={`${pad}px`}
        py={1}
        alignItems="center"
        fontSize="sm"
      >
        <Text
          as="button"
          type="button"
          aria-expanded={expanded}
          flexShrink={0}
          w="6"
          textAlign="center"
          cursor="pointer"
          userSelect="none"
          onClick={(e) => {
            stop(e);
            onToggleExpand(node.path);
          }}
        >
          {expanded ? '▼' : '▶'}
        </Text>
        <Text
          as="button"
          type="button"
          flex="1"
          textAlign="left"
          fontWeight="semibold"
          cursor="pointer"
          onDoubleClick={() => onDirectoryNavigate(node.path)}
          title="Double-click to open this folder in the path field"
        >
          📁 {node.name}
        </Text>
      </HStack>
      {expanded && loadingKids && (
        <Box pl={`${pad + 28}px`} py={1}>
          <Spinner size="sm" aria-label="Loading folder" />
        </Box>
      )}
      {expanded && !loadingKids && branchChildren.length > 0 && (
        <Stack gap={0} role="group">
          {branchChildren.map((child) => (
            <TreeRow
              key={child.path}
              node={child}
              depth={depth + 1}
              expandedPaths={expandedPaths}
              loadedChildren={loadedChildren}
              loadingChildPaths={loadingChildPaths}
              onToggleExpand={onToggleExpand}
              onDirectoryNavigate={onDirectoryNavigate}
              onFileClick={onFileClick}
            />
          ))}
        </Stack>
      )}
      {expanded && !loadingKids && branchChildren.length === 0 && (
        <Text pl={`${pad + 28}px`} fontSize="xs" color="fg.muted" py={1}>
          Empty
        </Text>
      )}
    </Box>
  );
});

/**
 * Lazy tree: one level from props; expand loads children via parent.
 */
export const FileTreeView = memo(function FileTreeView({
  nodes,
  loading,
  expandedPaths,
  loadedChildren,
  loadingChildPaths,
  onToggleExpand,
  onDirectoryNavigate,
  onFileClick,
}: FileTreeViewProps) {
  if (loading) {
    return (
      <Box py={4}>
        <Spinner aria-label="Loading tree" />
      </Box>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <Text color="fg.muted" fontSize="sm">
        Empty folder
      </Text>
    );
  }

  return (
    <Stack gap={0} role="tree">
      {nodes.map((node) => (
        <TreeRow
          key={node.path}
          node={node}
          depth={0}
          expandedPaths={expandedPaths}
          loadedChildren={loadedChildren}
          loadingChildPaths={loadingChildPaths}
          onToggleExpand={onToggleExpand}
          onDirectoryNavigate={onDirectoryNavigate}
          onFileClick={onFileClick}
        />
      ))}
    </Stack>
  );
});
