import type { ListEntry } from './list-entry.types';

const MAX_INPUT_LENGTH = 200;

/** Minimal shape for filtering tree rows by `name`. */
export type TreeNodeName = { name: string };

/**
 * Maximum allowed length for the path input field.
 */
export const PATH_INPUT_MAX_LENGTH = MAX_INPUT_LENGTH;

/**
 * Derives API wire path and optional name prefix filter from the raw path field.
 *
 * - Trailing `/`: list that directory (`listingWirePath` = path without trailing slashes); no name filter.
 * - No `/`: **single segment** — `listingWirePath` is the trimmed string (directory under root); `namePrefix` is empty (same as adding `/` after the name).
 * - Contains `/` but no trailing `/`: list that full path as the directory anchor (same as adding `/`); no name filter.
 */
export const splitPathInput = (raw: string): {
  listingWirePath: string;
  namePrefix: string;
} => {
  const trimmed = raw.trim().slice(0, MAX_INPUT_LENGTH);
  if (!trimmed) {
    return { listingWirePath: '', namePrefix: '' };
  }

  if (/\/$/.test(trimmed)) {
    const pathOnly = trimmed.replace(/\/+$/, '');
    return { listingWirePath: pathOnly, namePrefix: '' };
  }

  const lastSlash = trimmed.lastIndexOf('/');
  if (lastSlash === -1) {
    return { listingWirePath: trimmed, namePrefix: '' };
  }

  return { listingWirePath: trimmed, namePrefix: '' };
};

/**
 * When a nested wire path (contains `/`) is not a directory, split into parent path
 * and last segment for prefix filtering (e.g. `apps/a` → `apps` + `a`).
 * Returns `null` when fallback does not apply (root segment, or no slash).
 */
export const parseNestedPathForTreeFallback = (
  fullWirePath: string,
): { parentPath: string; lastSegment: string } | null => {
  const t = fullWirePath.trim();
  if (!t) return null;
  const lastSlash = t.lastIndexOf('/');
  if (lastSlash <= 0) return null;
  const parentPath = t.slice(0, lastSlash);
  const lastSegment = t.slice(lastSlash + 1);
  if (!parentPath || !lastSegment) return null;
  return { parentPath, lastSegment };
};

/**
 * Case-insensitive prefix filter for tree nodes (nested 404 fallback). Prefix length ≥ 1.
 */
export const filterTreeNodesByNestedPrefix = <T extends TreeNodeName>(
  nodes: T[],
  prefix: string,
): T[] => {
  if (!prefix) return nodes;
  const lower = prefix.toLowerCase();
  return nodes.filter((n) => n.name.toLowerCase().startsWith(lower));
};

/**
 * Filters entries by case-insensitive prefix on `name` when prefix length >= 3.
 */
export const filterEntriesByNamePrefix = (
  entries: ListEntry[],
  namePrefix: string,
): ListEntry[] => {
  if (namePrefix.length < 3) return entries;
  const lower = namePrefix.toLowerCase();
  return entries.filter((e) => e.name.toLowerCase().startsWith(lower));
};
