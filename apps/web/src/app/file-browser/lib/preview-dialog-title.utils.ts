/**
 * Splits a wire path (forward slashes) into directory and file name for preview UI titles.
 */
export function splitWirePathForPreviewTitle(wirePath: string): {
  directoryLabel: string;
  fileName: string;
} {
  const trimmed = wirePath.trim();
  const i = trimmed.lastIndexOf('/');
  if (i === -1) {
    return { directoryLabel: '', fileName: trimmed };
  }
  return {
    directoryLabel: trimmed.slice(0, i),
    fileName: trimmed.slice(i + 1),
  };
}
