/**
 * Successful file preview payload (UTF-8 text).
 */
export class FilePreviewResponseDto {
  content: string;
  encoding: 'utf-8';
  truncated: boolean;
}
