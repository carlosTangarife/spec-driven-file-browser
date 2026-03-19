import { useQuery } from '@tanstack/react-query';
import { fetchFilePreview } from '../api/file-content.service';

/**
 * Loads file preview when `wirePath` is set; disabled when null/empty.
 */
export const useFileContentQuery = (wirePath: string | null) =>
  useQuery({
    queryKey: ['filePreview', wirePath] as const,
    queryFn: () => fetchFilePreview(wirePath as string),
    enabled: wirePath != null && wirePath.length > 0,
  });
