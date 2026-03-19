import { describe, expect, it } from 'vitest';
import { PreviewRequestError } from '../api/file-content.service';
import { ListingRequestError } from '../api/file-listing.service';
import { mapPreviewDisplayError } from './preview-error.utils';

describe('mapPreviewDisplayError', () => {
  it('returns null when there is no error', () => {
    expect(mapPreviewDisplayError(null)).toBeNull();
    expect(mapPreviewDisplayError(undefined)).toBeNull();
  });

  it('maps PreviewRequestError 404 to file not found', () => {
    const err = new PreviewRequestError(404);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('File not found.');
  });

  it('maps PreviewRequestError 400 to cannot preview', () => {
    const err = new PreviewRequestError(400);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('Cannot preview this path.');
  });

  it('maps PreviewRequestError 413 to too large', () => {
    const err = new PreviewRequestError(413);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('File is too large to preview.');
  });

  it('maps PreviewRequestError 415 to binary / non-text', () => {
    const err = new PreviewRequestError(415);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('Binary or non-text file cannot be previewed.');
  });

  it('maps PreviewRequestError 403 to outside root', () => {
    const err = new PreviewRequestError(403);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('Path is outside the allowed root.');
  });

  it('maps ListingRequestError 404 to file not found', () => {
    const err = new ListingRequestError(404);
    const out = mapPreviewDisplayError(err);
    expect(out?.message).toBe('File not found.');
  });

  it('passes through generic Error', () => {
    const err = new Error('network');
    expect(mapPreviewDisplayError(err)).toBe(err);
  });

  it('wraps non-Error values', () => {
    const out = mapPreviewDisplayError('oops');
    expect(out?.message).toBe('oops');
  });
});
