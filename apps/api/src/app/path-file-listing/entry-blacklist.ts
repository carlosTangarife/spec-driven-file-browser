/**
 * Directory / file names omitted from listings and tree (VCS metadata, noise).
 * Applies to immediate children only; nested paths under allowed parents still work
 * if the user navigates by path input.
 */
const GIT_METADATA_DIR_NAMES = new Set([
  '.git',
  '.github',
  '.svn',
  '.hg',
]);

/**
 * Returns true if this entry should be hidden from directory listings and tree.
 */
export const shouldOmitListingEntry = (
  name: string,
  isDirectory: boolean,
): boolean => {
  if (GIT_METADATA_DIR_NAMES.has(name)) return true;
  if (isDirectory && name.startsWith('.git')) return true;
  return false;
};
