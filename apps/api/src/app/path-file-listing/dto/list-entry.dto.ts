import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Single entry in a directory listing response.
 */
export class ListEntryDto {
  /** Base name of the file or directory. */
  @ApiProperty({ example: 'package.json' })
  name: string;
  /** "file" or "directory". */
  @ApiProperty({ enum: ['file', 'directory'] })
  type: 'file' | 'directory';
  /** Relative path under allowed root (optional). */
  @ApiPropertyOptional({ example: 'package.json' })
  relativePath?: string;
}
