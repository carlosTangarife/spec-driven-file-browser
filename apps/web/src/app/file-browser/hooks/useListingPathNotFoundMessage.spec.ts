import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListingRequestError } from '../api/file-listing.service';
import {
  LISTING_PATH_NOT_FOUND_DESCRIPTION,
  useListingPathNotFoundMessage,
} from './useListingPathNotFoundMessage';

describe('useListingPathNotFoundMessage', () => {
  it('returns null when there is no error', () => {
    const { result } = renderHook(() => useListingPathNotFoundMessage(undefined));

    expect(result.current).toBeNull();
  });

  it('returns null for non-404 ListingRequestError', () => {
    const err = new ListingRequestError(500, 'Server error');

    const { result } = renderHook(() => useListingPathNotFoundMessage(err));

    expect(result.current).toBeNull();
  });

  it('returns the English description for 404 ListingRequestError', () => {
    const err = new ListingRequestError(404);

    const { result } = renderHook(() => useListingPathNotFoundMessage(err));

    expect(result.current).toBe(LISTING_PATH_NOT_FOUND_DESCRIPTION);
  });

  it('keeps a stable string when the same error is re-rendered', () => {
    const err = new ListingRequestError(404);

    const { result, rerender } = renderHook(
      ({ error }: { error: unknown }) => useListingPathNotFoundMessage(error),
      { initialProps: { error: err as unknown } },
    );

    const first = result.current;
    rerender({ error: err as unknown });

    expect(result.current).toBe(first);
    expect(result.current).toBe(LISTING_PATH_NOT_FOUND_DESCRIPTION);
  });

  it('returns null when the error clears', () => {
    const err = new ListingRequestError(404);

    const { result, rerender } = renderHook(
      ({ error }: { error: unknown }) => useListingPathNotFoundMessage(error),
      { initialProps: { error: err as unknown } },
    );

    expect(result.current).toBe(LISTING_PATH_NOT_FOUND_DESCRIPTION);

    rerender({ error: undefined });

    expect(result.current).toBeNull();
  });
});
