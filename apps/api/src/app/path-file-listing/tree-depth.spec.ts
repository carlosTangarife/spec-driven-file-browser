import { describe, it, expect } from 'vitest';
import {
  parseTreeDepthParam,
  DEFAULT_TREE_DEPTH,
  MAX_TREE_DEPTH_PARAM,
} from './tree-depth';

describe('parseTreeDepthParam', () => {
  it('defaults to DEFAULT_TREE_DEPTH when omitted or empty', () => {
    expect(parseTreeDepthParam(undefined)).toBe(DEFAULT_TREE_DEPTH);
    expect(parseTreeDepthParam('')).toBe(DEFAULT_TREE_DEPTH);
    expect(parseTreeDepthParam('   ')).toBe(DEFAULT_TREE_DEPTH);
  });

  it('parses valid integers and clamps to 1..MAX', () => {
    expect(parseTreeDepthParam('1')).toBe(1);
    expect(parseTreeDepthParam('3')).toBe(3);
    expect(parseTreeDepthParam(String(MAX_TREE_DEPTH_PARAM))).toBe(MAX_TREE_DEPTH_PARAM);
    expect(parseTreeDepthParam('999')).toBe(MAX_TREE_DEPTH_PARAM);
    expect(parseTreeDepthParam('0')).toBe(1);
  });

  it('returns default for NaN', () => {
    expect(parseTreeDepthParam('x')).toBe(DEFAULT_TREE_DEPTH);
  });
});
