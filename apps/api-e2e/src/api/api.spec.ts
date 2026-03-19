import axios from 'axios';

describe('File Browser API (e2e)', () => {
  it('GET /api returns app payload', async () => {
    const res = await axios.get<{ message: string }>(`/api`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello World' });
  });

  it('GET /api/listing returns a JSON array at allowed root', async () => {
    const res = await axios.get<unknown[]>(`/api/listing`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('GET /api/listing/tree returns nested nodes', async () => {
    const res = await axios.get<unknown[]>(`/api/listing/tree`, {
      params: { depth: 1 },
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('GET /api/listing/preview returns UTF-8 preview for package.json', async () => {
    const res = await axios.get<{
      content: string;
      encoding: 'utf-8';
      truncated: boolean;
    }>(`/api/listing/preview`, {
      params: { path: 'package.json' },
    });
    expect(res.status).toBe(200);
    expect(res.data.encoding).toBe('utf-8');
    expect(typeof res.data.content).toBe('string');
    expect(res.data.content).toContain('file-browser-workspace');
  });
});
