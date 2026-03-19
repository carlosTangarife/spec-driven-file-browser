/**
 * Query for directory tree request.
 */
export class TreeQueryDto {
  /** Relative path; empty or omitted = allowed root. */
  path?: string;
  /** Recursion depth (levels below anchor). Omitted default handled in controller. */
  depth?: string;
}
