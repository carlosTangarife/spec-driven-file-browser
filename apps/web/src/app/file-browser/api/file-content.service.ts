import { z } from 'zod';

/** Thrown when preview HTTP response is not OK. */
export class PreviewRequestError extends Error {
  constructor(
    readonly status: number,
    message?: string,
  ) {
    super(message ?? `Preview error: ${status}`);
    this.name = 'PreviewRequestError';
  }
}

const previewResponseSchema = z.object({
  content: z.string(),
  encoding: z.literal('utf-8'),
  truncated: z.boolean(),
});

export type FilePreviewPayload = z.infer<typeof previewResponseSchema>;

/**
 * Fetches UTF-8 file preview from `GET /api/listing/preview`.
 */
export const fetchFilePreview = (wirePath: string): Promise<FilePreviewPayload> => {
  const params = new URLSearchParams();
  params.set('path', wirePath);
  const url = `/api/listing/preview?${params.toString()}`;
  return fetch(url).then(async (res) => {
    if (!res.ok) throw new PreviewRequestError(res.status);
    const json: unknown = await res.json();
    return previewResponseSchema.parse(json);
  });
};
