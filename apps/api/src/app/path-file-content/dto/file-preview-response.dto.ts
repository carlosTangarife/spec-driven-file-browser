import { ApiProperty } from '@nestjs/swagger';

/**
 * Successful file preview payload (UTF-8 text).
 */
export class FilePreviewResponseDto {
  @ApiProperty({ description: 'UTF-8 text (possibly truncated).' })
  content: string;
  @ApiProperty({ enum: ['utf-8'] })
  encoding: 'utf-8';
  @ApiProperty({ description: 'True when preview was cut at the byte limit.' })
  truncated: boolean;
}
