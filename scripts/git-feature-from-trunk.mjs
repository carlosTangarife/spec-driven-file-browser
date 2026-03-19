#!/usr/bin/env node
/**
 * Creates `feature/<kebab-name>` from trunk (`main` or `master`) and checks it out.
 * Aligns with AGENTS.md: OpenSpec implementation happens on a feature branch, not on trunk.
 *
 * Usage: node scripts/git-feature-from-trunk.mjs <kebab-case-change-name>
 *    or: npm run git:feature -- <kebab-case-change-name>
 */

import { execSync } from 'node:child_process';

function run(cmd, { allowFail = false } = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    if (allowFail) return null;
    throw new Error(`Command failed: ${cmd}`);
  }
}

function resolveTrunk() {
  if (run('git rev-parse --verify main', { allowFail: true })) return 'main';
  if (run('git rev-parse --verify master', { allowFail: true })) return 'master';
  console.error('[git-feature] Neither local branch "main" nor "master" exists.');
  process.exit(1);
}

const raw = process.argv[2];
if (!raw || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
  console.error(
    '[git-feature] Usage: node scripts/git-feature-from-trunk.mjs <kebab-case-change-name>\n' +
      '  Example: node scripts/git-feature-from-trunk.mjs my-open-spec-change'
  );
  process.exit(1);
}

try {
  run('git rev-parse --is-inside-work-tree');
} catch {
  console.error('[git-feature] Not a git repository.');
  process.exit(1);
}

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
