import * as path from 'path';

/**
 * Parses wire path (forward slashes) into validated segments.
 * Rejects ".." and empty segments; empty or "." returns [].
 */
export const parseWirePath = (wirePath: string | undefined): string[] => {
  const normalized = (wirePath ?? '').trim();
  if (normalized === '' || normalized === '.') return [];
  const segments = normalized.split('/').filter((s) => s.length > 0);
  if (segments.some((s) => s === '..')) return [];
  return segments;
};

/**
 * Resolves allowedRoot + segments to an absolute path using Node path.
 * Does not validate containment; use isUnderRoot after.
 */
export const resolvePath = (allowedRoot: string, segments: string[]): string => {
  const resolved = path.resolve(allowedRoot, ...segments);
  return path.normalize(resolved);
};

/**
 * Returns true if resolvedPath is under allowedRoot (or equal).
 * Uses normalized absolute paths; works on Windows and POSIX.
 */
export const isUnderRoot = (allowedRoot: string, resolvedPath: string): boolean => {
  const normalizedRoot = path.normalize(path.resolve(allowedRoot));
  const normalizedResolved = path.normalize(path.resolve(resolvedPath));
  if (normalizedResolved === normalizedRoot) return true;
  const relative = path.relative(normalizedRoot, normalizedResolved);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
};
