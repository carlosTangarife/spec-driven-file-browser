#!/usr/bin/env node
/**
 * Creates `feature/<kebab-name>` from the integration branch (prefer `trunk`, else `main`, else `master`) and checks it out.
 * Aligns with AGENTS.md: OpenSpec work happens on a feature branch, not on trunk. `/opsx:propose` runs this before `openspec new change`; `/opsx:apply` repeats the same ensure step.
 *
 * Usage:
 *   node scripts/git-feature-from-trunk.mjs
 *     → infers `<kebab-name>` from the **single** active OpenSpec change (`openspec list --json`).
 *   node scripts/git-feature-from-trunk.mjs <kebab-case-change-name>
 *     → uses that name explicitly.
 *   pnpm run git:feature
 *   pnpm run git:feature -- my-change-name
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

function run(cmd, { allowFail = false, cwd } = {}) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...(cwd ? { cwd } : {}),
    }).trim();
  } catch {
    if (allowFail) return null;
    throw new Error(`Command failed: ${cmd}`);
  }
}

function resolveTrunk() {
  if (run('git rev-parse --verify trunk', { allowFail: true })) return 'trunk';
  if (run('git rev-parse --verify main', { allowFail: true })) return 'main';
  if (run('git rev-parse --verify master', { allowFail: true })) return 'master';
  console.error(
    '[git-feature] No integration branch found. Create local "trunk" (recommended), or "main", or "master".'
  );
  process.exit(1);
}

function isValidKebab(name) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

/**
 * Directory that contains `openspec/` (walk up from cwd; if missing, one level under git root — monorepos).
 * @returns {string | null}
 */
function findOpenSpecProjectRoot() {
  const gitTop = resolve(run('git rev-parse --show-toplevel'));
  let dir = resolve(process.cwd());
  for (let i = 0; i < 40; i++) {
    if (existsSync(join(dir, 'openspec'))) return dir;
    if (dir === gitTop) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  try {
    const entries = readdirSync(gitTop, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory() || e.name.startsWith('.')) continue;
      const candidate = join(gitTop, e.name);
      if (existsSync(join(candidate, 'openspec'))) return candidate;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Resolves the OpenSpec change name: single active change from CLI, or explicit arg.
 * @param {string | undefined} explicit
 * @param {string} openSpecProjectRoot - cwd for `openspec list` (workspace with `openspec/`)
 * @returns {string}
 */
function resolveChangeName(explicit, openSpecProjectRoot) {
  if (explicit) {
    if (!isValidKebab(explicit)) {
      console.error(
        `[git-feature] Invalid change name "${explicit}". Use kebab-case (e.g. my-open-spec-change).`
      );
      process.exit(1);
    }
    return explicit;
  }

  let jsonRaw;
  try {
    jsonRaw = run('openspec list --json', { cwd: openSpecProjectRoot });
  } catch {
    console.error(
      '[git-feature] Could not run `openspec list --json`. Install the OpenSpec CLI and run from the repo root,\n' +
        '  or pass the change name explicitly: pnpm run git:feature -- <kebab-case-change-name>'
    );
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(jsonRaw);
  } catch {
    console.error('[git-feature] Invalid JSON from `openspec list --json`.');
    process.exit(1);
  }

  const changes = Array.isArray(data.changes) ? data.changes : [];
  if (changes.length === 0) {
    console.error(
      '[git-feature] No active OpenSpec changes. Create a change under openspec/changes/ or pass a name:\n' +
        '  pnpm run git:feature -- <kebab-case-change-name>'
    );
    process.exit(1);
  }
  if (changes.length > 1) {
    const names = changes.map((c) => c.name).join(', ');
    console.error(
      `[git-feature] Multiple active OpenSpec changes (${names}). Pass the one to use:\n` +
        '  pnpm run git:feature -- <kebab-case-change-name>'
    );
    process.exit(1);
  }

  const name = changes[0].name;
  if (typeof name !== 'string' || !isValidKebab(name)) {
    console.error(`[git-feature] Unexpected change name from OpenSpec: ${String(name)}`);
    process.exit(1);
  }

  console.log(`[git-feature] Inferred change name from OpenSpec: ${name}`);
  return name;
}

const explicitArg = process.argv[2];

try {
  run('git rev-parse --is-inside-work-tree');
} catch {
  console.error('[git-feature] Not a git repository.');
  process.exit(1);
}

const openSpecRoot = findOpenSpecProjectRoot();
if (!openSpecRoot) {
  console.error(
    '[git-feature] Could not find an OpenSpec workspace (folder with `openspec/`). Run from that directory,\n' +
      '  or pass the branch suffix explicitly:\n' +
      '  pnpm run git:feature -- <kebab-case-change-name>'
  );
  process.exit(1);
}

const raw = resolveChangeName(explicitArg, openSpecRoot);

const branch = `feature/${raw}`;
const current = run('git branch --show-current');

if (current === branch) {
  console.log(`[git-feature] Already on ${branch}.`);
  process.exit(0);
}

const dirty = run('git status --porcelain');
if (dirty) {
  console.error(
    '[git-feature] Working tree is not clean. Commit or stash before creating/switching the feature branch.'
  );
  process.exit(1);
}

const trunk = resolveTrunk();
run(`git checkout ${trunk}`);

try {
  run('git pull --ff-only');
} catch {
  console.warn(`[git-feature] Could not fast-forward ${trunk} (no remote or diverged). Continuing.`);
}

const exists = run(`git rev-parse --verify refs/heads/${branch}`, { allowFail: true });
if (exists) {
  run(`git checkout ${branch}`);
  console.log(`[git-feature] Checked out existing ${branch} (from ${trunk}).`);
} else {
  run(`git checkout -b ${branch}`);
  console.log(`[git-feature] Created and checked out ${branch} from ${trunk}.`);
}
