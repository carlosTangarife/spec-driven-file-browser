import type { ListEntry } from './list-entry.types';

const MAX_INPUT_LENGTH = 200;

/**
 * Maximum allowed length for the path input field.
 */
export const PATH_INPUT_MAX_LENGTH = MAX_INPUT_LENGTH;

/**
 * Derives API wire path and optional name prefix filter from the raw path field.
 *
 * - Trailing `/`: list that directory (`listingWirePath` = path without trailing slashes); no name filter.
 * - No `/`: root listing; `namePrefix` is the full string (filter when length ≥ 3).
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
    return { listingWirePath: '', namePrefix: trimmed };
  }

  return { listingWirePath: trimmed, namePrefix: '' };
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
