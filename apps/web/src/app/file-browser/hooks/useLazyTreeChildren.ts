import { useCallback, useEffect, useRef, useState } from 'react';
import type { DirectoryTreeNode } from '../api/file-listing.service';
import { fetchDirectoryTree } from '../api/file-listing.service';

/**
 * Lazy-loads nested tree children when a folder row is expanded; resets when `listingPath` changes.
 */
export const useLazyTreeChildren = (listingPath: string) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => new Set());
  const [loadedChildren, setLoadedChildren] = useState<
    Record<string, DirectoryTreeNode[]>
  >({});
  const [loadingChildPaths, setLoadingChildPaths] = useState<Set<string>>(
    () => new Set(),
  );

  /** Keeps the latest expanded set for toggle logic without stale `useCallback` closures. */
  const expandedRef = useRef(expandedPaths);
  expandedRef.current = expandedPaths;

  /** Keeps the latest loaded-children map so cache hits are not missed when deps are unchanged. */
  const loadedRef = useRef(loadedChildren);
  loadedRef.current = loadedChildren;

  const prevListingPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevListingPathRef.current === null) {
      prevListingPathRef.current = listingPath;
      return;
    }
    if (prevListingPathRef.current === listingPath) return;
    prevListingPathRef.current = listingPath;
    setExpandedPaths(new Set());
    setLoadedChildren({});
    setLoadingChildPaths(new Set());
  }, [listingPath]);

  const onToggleExpand = useCallback(
    async (wirePath: string) => {
      if (expandedRef.current.has(wirePath)) {
        setExpandedPaths((e) => {
          const n = new Set(e);
          n.delete(wirePath);
          return n;
        });
        return;
      }

      setExpandedPaths((e) => new Set(e).add(wirePath));

      if (loadedRef.current[wirePath]) return;

      setLoadingChildPaths((s) => new Set(s).add(wirePath));
      try {
        const kids = await fetchDirectoryTree(wirePath, 1);
        setLoadedChildren((p) => ({ ...p, [wirePath]: kids }));
      } finally {
        setLoadingChildPaths((s) => {
          const n = new Set(s);
          n.delete(wirePath);
          return n;
        });
      }
    },
    [],
  );

  return {
    expandedPaths,
    loadedChildren,
    loadingChildPaths,
    onToggleExpand,
  };
};
