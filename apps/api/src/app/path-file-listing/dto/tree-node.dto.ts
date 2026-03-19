import { ApiProperty } from '@nestjs/swagger';

/**
 * Single node in a directory tree response (nested for subdirectories).
 */
export class TreeNodeDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: ['file', 'directory'] })
  type: 'file' | 'directory';
  /** Wire-relative path under allowed root (forward slashes). */
  @ApiProperty({ example: 'apps/web' })
  path: string;
  /** Empty for files; nested nodes for directories when depth allows. */
  @ApiProperty({ type: () => TreeNodeDto, isArray: true })
  children: TreeNodeDto[];
}
