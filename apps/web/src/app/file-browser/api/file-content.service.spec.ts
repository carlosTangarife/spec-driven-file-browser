import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchFilePreview, PreviewRequestError } from './file-content.service';

describe('fetchFilePreview', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls /api/listing/preview with encoded path', async () => {
    const mockJson = vi.fn().mockResolvedValue({
      content: 'hi',
      encoding: 'utf-8',
      truncated: false,
    });
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    const result = await fetchFilePreview('a/b.txt');

    expect(fetch).toHaveBeenCalledWith('/api/listing/preview?path=a%2Fb.txt');
    expect(result.content).toBe('hi');
  });

  it('throws PreviewRequestError when not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 415,
    } as Response);

    await expect(fetchFilePreview('x.bin')).rejects.toBeInstanceOf(
      PreviewRequestError,
    );
  });
});
