import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Query DTO for listing request.
 * Wire format: relative path under allowed root, forward slashes; empty or "." = root.
 */
export class ListQueryDto {
  /** Relative path (e.g. "foo/bar"). Empty or "." means allowed root. */
  @ApiPropertyOptional({
    description: 'Wire path under allowed root; omit for root listing.',
    example: 'apps/web',
  })
  path?: string;
}
