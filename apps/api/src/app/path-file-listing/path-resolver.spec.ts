import * as path from 'path';
import { describe, it, expect } from 'vitest';
import {
  parseWirePath,
  resolvePath,
  isUnderRoot,
} from './path-resolver';

describe('parseWirePath', () => {
  it('returns [] for empty or "."', () => {
    expect(parseWirePath('')).toEqual([]);
    expect(parseWirePath('  ')).toEqual([]);
    expect(parseWirePath('.')).toEqual([]);
    expect(parseWirePath(undefined)).toEqual([]);
  });

  it('splits by / and filters empty segments', () => {
    expect(parseWirePath('foo/bar')).toEqual(['foo', 'bar']);
    expect(parseWirePath('foo//bar')).toEqual(['foo', 'bar']);
  });

  it('returns [] when segment is ".."', () => {
    expect(parseWirePath('..')).toEqual([]);
    expect(parseWirePath('foo/../bar')).toEqual([]);
    expect(parseWirePath('a/..')).toEqual([]);
  });
});

describe('resolvePath', () => {
  it('resolves allowedRoot + segments using path.resolve (cross-platform)', () => {
    // Arrange — use a root that resolves consistently on the current OS
    const root = path.join(process.cwd(), 'allowed-root-fixture');
    // Act + Assert
    expect(resolvePath(root, [])).toBe(path.normalize(path.resolve(root)));
    expect(resolvePath(root, ['projects'])).toBe(
      path.normalize(path.resolve(root, 'projects')),
    );
    expect(resolvePath(root, ['a', 'b'])).toBe(
      path.normalize(path.resolve(root, 'a', 'b')),
    );
  });

  it('resolves Windows-style drive letter root + segments when on Windows', () => {
    if (process.platform !== 'win32') return;
    // Arrange
    const root = 'D:\\base';
    // Act
    const resolved = resolvePath(root, ['foo']);
    // Assert
    expect(resolved).toContain('foo');
    expect(resolved).toMatch(/D:\\base[\s\S]*foo/);
  });
});

describe('isUnderRoot', () => {
  it('returns true when resolved equals root', () => {
    const root = path.join(process.cwd(), 'r1');
    expect(isUnderRoot(root, path.resolve(root))).toBe(true);
    if (process.platform === 'win32') {
      expect(isUnderRoot('C:\\data', 'C:\\data')).toBe(true);
    }
  });

  it('returns true when resolved is under root', () => {
    const root = path.join(process.cwd(), 'r2');
    expect(isUnderRoot(root, path.join(root, 'projects'))).toBe(true);
    expect(isUnderRoot(root, path.join(root, 'a', 'b'))).toBe(true);
  });

  it('returns false when resolved escapes root', () => {
    const root = path.join(process.cwd(), 'r3');
    const parent = path.dirname(root);
    expect(isUnderRoot(root, parent)).toBe(false);
    expect(isUnderRoot(root, path.join(root, '..', 'other'))).toBe(false);
  });
});
