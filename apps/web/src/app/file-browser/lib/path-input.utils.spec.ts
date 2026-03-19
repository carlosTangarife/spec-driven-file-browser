import { describe, it, expect } from 'vitest';
import {
  filterEntriesByNamePrefix,
  filterTreeNodesByNestedPrefix,
  parseNestedPathForTreeFallback,
  splitPathInput,
  PATH_INPUT_MAX_LENGTH,
} from './path-input.utils';
import type { ListEntry } from './list-entry.types';

describe('splitPathInput', () => {
  it('treats single segment without slash as wire path to that directory under root', () => {
    expect(splitPathInput('  app  ')).toEqual({
      listingWirePath: 'app',
      namePrefix: '',
    });
  });

  it('uses full wire path when nested without trailing slash', () => {
    expect(splitPathInput('apps/web')).toEqual({
      listingWirePath: 'apps/web',
      namePrefix: '',
    });
  });

  it('treats trailing slash as list directory without name filter', () => {
    expect(splitPathInput('apps/web/')).toEqual({
      listingWirePath: 'apps/web',
      namePrefix: '',
    });
  });

  it('caps length at PATH_INPUT_MAX_LENGTH', () => {
    const long = `${'a'.repeat(PATH_INPUT_MAX_LENGTH)}extra`;
    const { listingWirePath } = splitPathInput(long);
    expect(listingWirePath.length).toBeLessThanOrEqual(PATH_INPUT_MAX_LENGTH);
  });
});

describe('filterEntriesByNamePrefix', () => {
  const entries: ListEntry[] = [
    { name: 'applications', type: 'directory' },
    { name: 'apps', type: 'directory' },
    { name: 'AppService', type: 'file' },
    { name: 'other', type: 'file' },
  ];

  it('returns all entries when prefix length is below 3', () => {
    expect(filterEntriesByNamePrefix(entries, 'ap')).toEqual(entries);
  });

  it('filters by case-insensitive prefix when length is at least 3', () => {
    const result = filterEntriesByNamePrefix(entries, 'app');
    expect(result.map((e) => e.name).sort()).toEqual(
      ['AppService', 'applications', 'apps'].sort(),
    );
  });
});

describe('parseNestedPathForTreeFallback', () => {
  it('returns parent and last segment for nested path', () => {
    expect(parseNestedPathForTreeFallback('apps/a')).toEqual({
      parentPath: 'apps',
      lastSegment: 'a',
    });
  });

  it('returns null when no slash', () => {
    expect(parseNestedPathForTreeFallback('apps')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseNestedPathForTreeFallback('')).toBeNull();
  });
});

describe('filterTreeNodesByNestedPrefix', () => {
  const nodes = [
    { name: 'apple', type: 'directory' as const, path: 'apps/apple', children: [] },
    { name: 'zebra', type: 'file' as const, path: 'apps/zebra', children: [] },
  ];

  it('filters from length 1 case-insensitively', () => {
    const out = filterTreeNodesByNestedPrefix(nodes, 'a');
    expect(out.map((n) => n.name)).toEqual(['apple']);
  });
});
