import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { getPathFileListingConfig } from './path-file-listing.config';
import { ListEntryDto } from './dto';
import {
  parseWirePath,
  resolvePath,
  isUnderRoot,
} from './path-resolver';

@Injectable()
export class PathFileListingService {
  /**
   * Lists immediate children of the directory identified by wirePath.
   * Wire path: relative under allowed root, forward slashes; empty or "." = root.
   * Throws on missing path, non-directory, or traversal attempt.
   */
  async list(wirePath: string | undefined): Promise<ListEntryDto[]> {
    const { allowedRoot } = getPathFileListingConfig();
    const segments = parseWirePath(wirePath);
    const resolved = resolvePath(allowedRoot, segments);

    if (!isUnderRoot(allowedRoot, resolved)) {
      throw new ForbiddenException('Path is outside allowed root');
    }

    let stats;
    try {
      stats = await stat(resolved);
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code === 'ENOENT') {
        throw new NotFoundException({ message: 'Path not found', path: wirePath ?? '.' });
      }
      throw err;
    }

    if (!stats.isDirectory()) {
      throw new BadRequestException('Path is not a directory');
    }

    const entries = await readdir(resolved, { withFileTypes: true });
    const baseRelative = segments.length === 0 ? '' : segments.join('/') + '/';

    const dtos: ListEntryDto[] = entries.map((dirent) => ({
      name: dirent.name,
      type: dirent.isDirectory() ? 'directory' : 'file',
      relativePath: baseRelative + dirent.name,
    }));

    return dtos.sort((a, b) => {
      const dirCompare = (a.type === 'directory' ? 0 : 1) - (b.type === 'directory' ? 0 : 1);
      if (dirCompare !== 0) return dirCompare;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }
}
