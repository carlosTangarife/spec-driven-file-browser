import { BadRequestException } from '@nestjs/common';
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PathFileListingService } from './path-file-listing.service';

describe('PathFileListingService getDirectoryTree', () => {
  let tmp: string;
  let prevRoot: string | undefined;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), 'pfl-tree-'));
    prevRoot = process.env['FILE_LISTING_ALLOWED_ROOT'];
    process.env['FILE_LISTING_ALLOWED_ROOT'] = tmp;
    await mkdir(path.join(tmp, 'a'));
    await mkdir(path.join(tmp, 'a', 'b'));
    await writeFile(path.join(tmp, 'a', 'b', 'f.txt'), 'hi');
    await writeFile(path.join(tmp, 'root.txt'), 'root');
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
    if (prevRoot === undefined) {
      delete process.env['FILE_LISTING_ALLOWED_ROOT'];
    } else {
      process.env['FILE_LISTING_ALLOWED_ROOT'] = prevRoot;
    }
  });

  it('returns nested nodes for depth 2 from root', async () => {
    const mod = await Test.createTestingModule({
      providers: [PathFileListingService],
    }).compile();
    const svc = mod.get(PathFileListingService);

    const tree = await svc.getDirectoryTree(undefined, 2);

    const a = tree.find((n) => n.name === 'a');
    expect(a?.type).toBe('directory');
    expect(a?.children?.length).toBeGreaterThanOrEqual(1);
    const b = a?.children?.find((c) => c.name === 'b');
    expect(b?.type).toBe('directory');
    expect(b?.children?.some((c) => c.name === 'f.txt')).toBe(true);
  });

  it('rejects non-directory anchor with 400 semantics', async () => {
    const mod = await Test.createTestingModule({
      providers: [PathFileListingService],
    }).compile();
    const svc = mod.get(PathFileListingService);

    await expect(svc.getDirectoryTree('root.txt', 1)).rejects.toThrow(
      BadRequestException,
    );
  });
});
