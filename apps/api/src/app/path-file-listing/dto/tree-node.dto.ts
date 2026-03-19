/**
 * Single node in a directory tree response (nested for subdirectories).
 */
export class TreeNodeDto {
  name: string;
  type: 'file' | 'directory';
  /** Wire-relative path under allowed root (forward slashes). */
  path: string;
  /** Empty for files; nested nodes for directories when depth allows. */
  children: TreeNodeDto[];
}
