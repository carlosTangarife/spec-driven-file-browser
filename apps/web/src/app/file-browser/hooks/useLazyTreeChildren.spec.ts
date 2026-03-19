import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchDirectoryTree } from '../api/file-listing.service';
import { useLazyTreeChildren } from './useLazyTreeChildren';

vi.mock('../api/file-listing.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/file-listing.service')>();
  return {
    ...actual,
    fetchDirectoryTree: vi.fn(),
  };
});

const sampleNodes = [
  {
    name: 'c',
    type: 'file' as const,
    path: 'a/c',
    children: [],
  },
];

describe('useLazyTreeChildren', () => {
  beforeEach(() => {
    vi.mocked(fetchDirectoryTree).mockClear();
  });

  it('fetches children on first expand and caches them', async () => {
    vi.mocked(fetchDirectoryTree).mockResolvedValue(sampleNodes);

    const { result } = renderHook(() => useLazyTreeChildren('root'));

    await act(async () => {
      await result.current.onToggleExpand('a');
    });

    expect(fetchDirectoryTree).toHaveBeenCalledWith('a', 1);
    expect(result.current.loadedChildren['a']).toEqual(sampleNodes);
    expect(result.current.expandedPaths.has('a')).toBe(true);
  });

  it('collapses without calling fetch again', async () => {
    vi.mocked(fetchDirectoryTree).mockResolvedValue(sampleNodes);
    const { result } = renderHook(() => useLazyTreeChildren('root'));

    await act(async () => {
      await result.current.onToggleExpand('a');
    });
    await waitFor(() => {
      expect(result.current.expandedPaths.has('a')).toBe(true);
    });
    await act(async () => {
      await result.current.onToggleExpand('a');
    });

    expect(fetchDirectoryTree).toHaveBeenCalledTimes(1);
    expect(result.current.expandedPaths.has('a')).toBe(false);
  });

  it('does not refetch when expanding after collapse if cache exists', async () => {
    vi.mocked(fetchDirectoryTree).mockResolvedValue(sampleNodes);
    const { result } = renderHook(() => useLazyTreeChildren('root'));

    await act(async () => {
      await result.current.onToggleExpand('a');
    });
    await waitFor(() => {
      expect(result.current.expandedPaths.has('a')).toBe(true);
    });
    await act(async () => {
      await result.current.onToggleExpand('a');
    });
    expect(result.current.expandedPaths.has('a')).toBe(false);
    await act(async () => {
      await result.current.onToggleExpand('a');
    });

    expect(fetchDirectoryTree).toHaveBeenCalledTimes(1);
    expect(result.current.expandedPaths.has('a')).toBe(true);
  });

  it('clears expansion and cache when listingPath changes', async () => {
    vi.mocked(fetchDirectoryTree).mockResolvedValue(sampleNodes);
    const { result, rerender } = renderHook(
      ({ path }) => useLazyTreeChildren(path),
      { initialProps: { path: 'one' } },
    );

    await act(async () => {
      await result.current.onToggleExpand('a');
    });
    expect(result.current.expandedPaths.size).toBeGreaterThan(0);

    rerender({ path: 'two' });

    expect(result.current.expandedPaths.size).toBe(0);
    expect(Object.keys(result.current.loadedChildren).length).toBe(0);
  });
});
