import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchFileListing } from './file-listing.service';

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

  it('throws when response is not ok', async () => {
    // Arrange
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    // Act + Assert
    await expect(fetchFileListing('missing')).rejects.toThrow('Listing error: 404');
  });
});
