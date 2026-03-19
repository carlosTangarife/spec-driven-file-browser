import { describe, it, expect } from 'vitest';
import {
  filterEntriesByNamePrefix,
  splitPathInput,
  PATH_INPUT_MAX_LENGTH,
} from './path-input.utils';
import type { ListEntry } from './file-listing.service';

describe('splitPathInput', () => {
  it('treats input without slash as root listing and full string as name prefix', () => {
    expect(splitPathInput('  app  ')).toEqual({
      listingWirePath: '',
      namePrefix: 'app',
    });
  });

  it('splits parent path and final segment when slash is present without trailing slash', () => {
    expect(splitPathInput('apps/web')).toEqual({
      listingWirePath: 'apps',
      namePrefix: 'web',
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
    const { namePrefix } = splitPathInput(long);
    expect(namePrefix.length).toBeLessThanOrEqual(PATH_INPUT_MAX_LENGTH);
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
