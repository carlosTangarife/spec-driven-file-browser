import { describe, it, expect } from 'vitest';
import { shouldOmitListingEntry } from './entry-blacklist';

describe('shouldOmitListingEntry', () => {
  it('omits known VCS directories', () => {
    expect(shouldOmitListingEntry('.git', true)).toBe(true);
    expect(shouldOmitListingEntry('.github', true)).toBe(true);
    expect(shouldOmitListingEntry('.svn', true)).toBe(true);
  });

  it('omits directories whose name starts with .git', () => {
    expect(shouldOmitListingEntry('.git-hooks-stub', true)).toBe(true);
  });

  it('does not omit normal folders or files', () => {
    expect(shouldOmitListingEntry('src', true)).toBe(false);
    expect(shouldOmitListingEntry('.gitignore', false)).toBe(false);
    expect(shouldOmitListingEntry('README.md', false)).toBe(false);
  });
});
