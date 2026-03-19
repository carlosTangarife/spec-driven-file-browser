import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Query for directory tree request.
 */
export class TreeQueryDto {
  /** Relative path; empty or omitted = allowed root. */
  @ApiPropertyOptional({
    description: 'Wire path for tree anchor; omit for root.',
    example: 'apps',
  })
  path?: string;
  /** Recursion depth (levels below anchor). Omitted default handled in controller. */
  @ApiPropertyOptional({
    description: 'Nesting depth (string in query; parsed server-side).',
    example: '2',
  })
  depth?: string;
}
