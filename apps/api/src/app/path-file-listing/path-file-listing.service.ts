import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as path from 'path';
import { readdir, stat } from 'fs/promises';
import { getPathFileListingConfig } from './path-file-listing.config';
import { ListEntryDto, TreeNodeDto } from './dto';
import {
  parseWirePath,
  resolvePath,
  isUnderRoot,
} from './path-resolver';
import { shouldOmitListingEntry } from './entry-blacklist';
import { MAX_TREE_NODES } from './tree-depth';

@Injectable()
export class PathFileListingService {
  /**
   * Resolves wire path to an existing directory under the allowed root, or throws.
   */
  private async resolveExistingDirectory(
    wirePath: string | undefined,
  ): Promise<{ resolved: string; segments: string[] }> {
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

    return { resolved, segments };
  }

  /**
   * Lists immediate children of the directory identified by wirePath.
   * Wire path: relative under allowed root, forward slashes; empty or "." = root.
   * Throws on missing path, non-directory, or traversal attempt.
   */
  async list(wirePath: string | undefined): Promise<ListEntryDto[]> {
    const { resolved, segments } = await this.resolveExistingDirectory(wirePath);

    const entries = await readdir(resolved, { withFileTypes: true });
    const baseRelative = segments.length === 0 ? '' : segments.join('/') + '/';

    const dtos: ListEntryDto[] = entries
      .filter((dirent) => {
        const isDir = dirent.isDirectory();
        return !shouldOmitListingEntry(dirent.name, isDir);
      })
      .map((dirent) => ({
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

  /**
   * Returns nested tree children for the directory at `wirePath`, up to `depth` levels
   * below the anchor (same resolution rules as `list`).
   */
  async getDirectoryTree(
    wirePath: string | undefined,
    depth: number,
  ): Promise<TreeNodeDto[]> {
    const { resolved, segments } = await this.resolveExistingDirectory(wirePath);

    const wirePrefix = segments.length === 0 ? '' : segments.join('/');
    const counter = { count: 0 };
    return this.readTreeLevel(resolved, wirePrefix, depth, counter);
  }

  private async readTreeLevel(
    dirAbs: string,
    wirePrefix: string,
    levelsLeft: number,
    counter: { count: number },
  ): Promise<TreeNodeDto[]> {
    if (counter.count >= MAX_TREE_NODES) {
      throw new BadRequestException('Directory tree exceeds maximum node count');
    }

    const entries = await readdir(dirAbs, { withFileTypes: true });
    const nodes: TreeNodeDto[] = [];

    for (const dirent of entries) {
      if (counter.count >= MAX_TREE_NODES) {
        break;
      }
      const name = dirent.name;
      const isDir = dirent.isDirectory();
      if (shouldOmitListingEntry(name, isDir)) {
        continue;
      }
      const childWire = wirePrefix === '' ? name : `${wirePrefix}/${name}`;

      if (dirent.isFile()) {
        counter.count += 1;
        nodes.push({
          name,
          type: 'file',
          path: childWire,
          children: [],
        });
      } else if (isDir) {
        counter.count += 1;
        let children: TreeNodeDto[] = [];
        if (levelsLeft > 0) {
          const subAbs = path.join(dirAbs, name);
          children = await this.readTreeLevel(subAbs, childWire, levelsLeft - 1, counter);
        }
        nodes.push({
          name,
          type: 'directory',
          path: childWire,
          children,
        });
      }
    }

    return nodes.sort((a, b) => {
      const dirCompare =
        (a.type === 'directory' ? 0 : 1) - (b.type === 'directory' ? 0 : 1);
      if (dirCompare !== 0) return dirCompare;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }
}
