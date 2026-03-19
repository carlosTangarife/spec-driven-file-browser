import {
  BadRequestException,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { mkdir, mkdtemp, writeFile, rm } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FILE_PREVIEW_MAX_BYTES } from './path-file-content.config';
import { PathFileContentService } from './path-file-content.service';

describe('PathFileContentService', () => {
  let tmp: string;
  let prevRoot: string | undefined;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), 'pfc-'));
    prevRoot = process.env['FILE_LISTING_ALLOWED_ROOT'];
    process.env['FILE_LISTING_ALLOWED_ROOT'] = tmp;
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
    if (prevRoot === undefined) {
      delete process.env['FILE_LISTING_ALLOWED_ROOT'];
    } else {
      process.env['FILE_LISTING_ALLOWED_ROOT'] = prevRoot;
    }
  });

  const createService = async () => {
    const mod = await Test.createTestingModule({
      providers: [PathFileContentService],
    }).compile();
    return mod.get(PathFileContentService);
  };

  it('returns UTF-8 content for a small text file', async () => {
    await writeFile(path.join(tmp, 'a.txt'), 'hello', 'utf8');
    const svc = await createService();
    const res = await svc.readPreview('a.txt');
    expect(res.content).toBe('hello');
    expect(res.truncated).toBe(false);
    expect(res.encoding).toBe('utf-8');
  });

  it('throws NotFoundException when path missing', async () => {
    const svc = await createService();
    await expect(svc.readPreview('nope.txt')).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException for directory path', async () => {
    await mkdir(path.join(tmp, 'subdir'));
    const svc = await createService();
    await expect(svc.readPreview('subdir')).rejects.toThrow(BadRequestException);
  });

  it('throws PayloadTooLargeException when file size exceeds cap', async () => {
    const big = path.join(tmp, 'big.bin');
    const buf = Buffer.alloc(FILE_PREVIEW_MAX_BYTES + 1, 97);
    await writeFile(big, buf);
    const svc = await createService();
    await expect(svc.readPreview('big.bin')).rejects.toThrow(PayloadTooLargeException);
  });

  it('throws UnsupportedMediaTypeException for binary (NUL byte)', async () => {
    const bin = path.join(tmp, 'x.bin');
    await writeFile(bin, Buffer.from([0, 1, 2]));
    const svc = await createService();
    await expect(svc.readPreview('x.bin')).rejects.toThrow(UnsupportedMediaTypeException);
  });
});
