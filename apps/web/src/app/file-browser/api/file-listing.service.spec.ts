import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDirectoryTree, fetchFileListing } from './file-listing.service';

describe('fetchFileListing', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /api/listing without query when path is empty', async () => {
    // Arrange
    const mockJson = vi.fn().mockResolvedValue([]);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    // Act
    await fetchFileListing('');

    // Assert
    expect(fetch).toHaveBeenCalledWith('/api/listing');
  });

  it('calls /api/listing?path= when path is provided', async () => {
    // Arrange
    const mockJson = vi.fn().mockResolvedValue([{ name: 'a', type: 'file' }]);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    // Act
    const result = await fetchFileListing('foo/bar');

    // Assert
    expect(fetch).toHaveBeenCalledWith('/api/listing?path=foo%2Fbar');
    expect(result).toEqual([{ name: 'a', type: 'file' }]);
  });

  it('throws ListingRequestError with HTTP status when response is not ok', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    // Act + Assert
    await expect(fetchFileListing('missing')).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe('fetchDirectoryTree', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /api/listing/tree with path and depth', async () => {
    const mockJson = vi.fn().mockResolvedValue([]);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    await fetchDirectoryTree('foo', 3);

    expect(fetch).toHaveBeenCalledWith('/api/listing/tree?path=foo&depth=3');
  });

  it('parses nested tree nodes', async () => {
    const payload = [
      {
        name: 'a',
        type: 'directory' as const,
        path: 'a',
        children: [
          { name: 'b.txt', type: 'file' as const, path: 'a/b.txt', children: [] },
        ],
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    } as unknown as Response);

    const result = await fetchDirectoryTree('root', 2);
    expect(fetch).toHaveBeenCalledWith('/api/listing/tree?path=root&depth=2');
    expect(result).toEqual(payload);
  });
});
