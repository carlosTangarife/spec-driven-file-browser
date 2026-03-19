/** Default depth for GET /listing/tree when `depth` is omitted. */
export const DEFAULT_TREE_DEPTH = 3;

/** Maximum allowed `depth` query value. */
export const MAX_TREE_DEPTH_PARAM = 20;

/** Hard cap on total nodes to avoid huge JSON responses. */
export const MAX_TREE_NODES = 5000;

/**
 * Parses `depth` query string: default 3, clamped to 1..MAX_TREE_DEPTH_PARAM.
 */
export const parseTreeDepthParam = (depthRaw: string | undefined): number => {
  if (depthRaw === undefined || String(depthRaw).trim() === '') {
    return DEFAULT_TREE_DEPTH;
  }
  const n = Number.parseInt(String(depthRaw), 10);
  if (Number.isNaN(n)) {
    return DEFAULT_TREE_DEPTH;
  }
  return Math.min(MAX_TREE_DEPTH_PARAM, Math.max(1, n));
};
