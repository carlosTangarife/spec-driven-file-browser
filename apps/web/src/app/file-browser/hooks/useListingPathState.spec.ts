import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement, type KeyboardEvent, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useListingPathState } from './useListingPathState';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
};

describe('useListingPathState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies listing wire path immediately on Enter before debounce (single segment)', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useListingPathState(), { wrapper });

    act(() => {
      result.current.setPathInput('skip-wait');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.listingPath).toBe('');

    act(() => {
      result.current.onKeyDownPathInput({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.listingPath).toBe('skip-wait');
  });

  it('applies full nested wire path on Tab when input contains a slash without trailing slash', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useListingPathState(), { wrapper });

    act(() => {
      result.current.setPathInput('parent/child');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.onKeyDownPathInput({
        key: 'Tab',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.listingPath).toBe('parent/child');
  });
});
