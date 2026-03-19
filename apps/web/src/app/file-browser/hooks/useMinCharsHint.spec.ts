import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMinCharsHint } from './useMinCharsHint';

vi.mock('../api/listing-toaster.instance', () => ({
  listingToaster: {
    create: vi.fn(),
  },
}));

import { listingToaster } from '../api/listing-toaster.instance';

describe('useMinCharsHint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(listingToaster.create).mockClear();
  });

  it('shows hint toast after 3 seconds when exactly one character is entered', () => {
    const create = vi.mocked(listingToaster.create);
    renderHook(() => useMinCharsHint('a'));

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(create).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'info',
        title: 'Keep typing',
      }),
    );
  });

  it('clears the timer when input is no longer a single character', () => {
    const create = vi.mocked(listingToaster.create);
    const { rerender } = renderHook(
      ({ path }: { path: string }) => useMinCharsHint(path),
      { initialProps: { path: 'a' } },
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    rerender({ path: 'ab' });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(create).not.toHaveBeenCalled();
  });
});
