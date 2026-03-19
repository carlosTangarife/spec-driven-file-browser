/**
 * Query DTO for listing request.
 * Wire format: relative path under allowed root, forward slashes; empty or "." = root.
 */
export class ListQueryDto {
  /** Relative path (e.g. "foo/bar"). Empty or "." means allowed root. */
  path?: string;
}
