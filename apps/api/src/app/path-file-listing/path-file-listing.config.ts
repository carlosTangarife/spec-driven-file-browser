/**
 * Config for path-file-listing feature.
 * Allowed root: absolute path on host; listing is restricted to this tree.
 * Set FILE_LISTING_ALLOWED_ROOT in env; fallback: process.cwd().
 */
export const getPathFileListingConfig = (): { allowedRoot: string } => {
  const allowedRoot = process.env['FILE_LISTING_ALLOWED_ROOT'] ?? process.cwd();
  return { allowedRoot };
};
