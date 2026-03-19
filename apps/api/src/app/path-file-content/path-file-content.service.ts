import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { open } from 'fs/promises';
import { stat } from 'fs/promises';
import { getPathFileListingConfig } from '../path-file-listing/path-file-listing.config';
import {
  parseWirePath,
  resolvePath,
  isUnderRoot,
} from '../path-file-listing/path-resolver';
import { FilePreviewResponseDto } from './dto/file-preview-response.dto';
import {
  BINARY_SNIFF_LENGTH,
  FILE_PREVIEW_MAX_BYTES,
} from './path-file-content.config';

@Injectable()
export class PathFileContentService {
  /**
   * Reads a bounded UTF-8 preview for a file under the allowed root.
   */
  async readPreview(wirePath: string | undefined): Promise<FilePreviewResponseDto> {
    const segments = parseWirePath(wirePath);
    if (segments.length === 0) {
      throw new BadRequestException('path is required');
    }

    const { allowedRoot } = getPathFileListingConfig();
    const resolved = resolvePath(allowedRoot, segments);

    if (!isUnderRoot(allowedRoot, resolved)) {
      throw new ForbiddenException('Path is outside allowed root');
    }

    let st;
    try {
      st = await stat(resolved);
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code === 'ENOENT') {
        throw new NotFoundException({ message: 'Path not found', path: wirePath });
      }
      throw err;
    }

    if (st.isDirectory()) {
      throw new BadRequestException('Path is a directory');
    }

    if (!st.isFile()) {
      throw new BadRequestException('Path is not a file');
    }

    const fileSize = st.size;

    if (fileSize > FILE_PREVIEW_MAX_BYTES) {
      throw new PayloadTooLargeException(
        `File exceeds maximum preview size of ${FILE_PREVIEW_MAX_BYTES} bytes`,
      );
    }

    const toRead = Math.min(fileSize, FILE_PREVIEW_MAX_BYTES);
    const buffer = Buffer.alloc(toRead);

    const fh = await open(resolved, 'r');
    try {
      await fh.read(buffer, 0, toRead, 0);
    } finally {
      await fh.close();
    }

    const sniffLen = Math.min(BINARY_SNIFF_LENGTH, buffer.length);
    if (buffer.subarray(0, sniffLen).includes(0)) {
      throw new UnsupportedMediaTypeException('File appears to be binary');
    }

    const content = buffer.toString('utf8');
    return {
      content,
      encoding: 'utf-8',
      truncated: false,
    };
  }
}
