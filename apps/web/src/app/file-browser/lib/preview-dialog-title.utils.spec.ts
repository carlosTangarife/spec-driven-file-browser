import { describe, expect, it } from 'vitest';
import { splitWirePathForPreviewTitle } from './preview-dialog-title.utils';

describe('splitWirePathForPreviewTitle', () => {
  it('returns empty directory for a root-level file', () => {
    expect(splitWirePathForPreviewTitle('package.json')).toEqual({
      directoryLabel: '',
      fileName: 'package.json',
    });
  });

  it('splits nested wire path into directory and file name', () => {
    expect(splitWirePathForPreviewTitle('apps/web/project.json')).toEqual({
      directoryLabel: 'apps/web',
      fileName: 'project.json',
    });
  });
});
