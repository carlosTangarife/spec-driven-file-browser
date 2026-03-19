import { PreviewRequestError } from '../api/file-content.service';
import { ListingRequestError } from '../api/file-listing.service';

/**
 * Maps preview query errors to a user-facing Error, or null when there is nothing to show.
 */
export const mapPreviewDisplayError = (previewError: unknown): Error | null => {
  if (previewError == null) return null;
  if (previewError instanceof PreviewRequestError) {
    if (previewError.status === 404) {
      return new Error('File not found.');
    }
    if (previewError.status === 400) {
      return new Error('Cannot preview this path.');
    }
    if (previewError.status === 413) {
      return new Error('File is too large to preview.');
    }
    if (previewError.status === 415) {
      return new Error('Binary or non-text file cannot be previewed.');
    }
    if (previewError.status === 403) {
      return new Error('Path is outside the allowed root.');
    }
  }
  if (previewError instanceof ListingRequestError && previewError.status === 404) {
    return new Error('File not found.');
  }
  return previewError instanceof Error
    ? previewError
    : new Error(String(previewError));
};
