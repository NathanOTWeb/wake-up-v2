#!/bin/bash
# Patch tinacms's unguarded `schema.config.config` accesses (v3.12.1).
# `schema.config.config` is TinaCloud server-injected project metadata
# (repoProvider, ui regex settings, etc.) that's absent for this project
# (its GitHub App connection isn't fully authorized), so every unguarded
# read of it crashes with "Cannot read properties of undefined". There
# are 6 such occurrences across dist/index.js (FormHeader props x2,
# branch-switcher's baseBranch computation, a validationRegex lookup,
# and two already-partially-guarded defaultBranchName/historyUrl reads
# that still assume schema.config.config itself exists).
#
# Run as part of the build command to ensure it always applies.
#
# IMPORTANT: use native `?.` syntax everywhere, not a hand-rolled
# temp-variable expansion (e.g. `(_e = ...) == null ? void 0 : _e.x`).
# An earlier version of this patch introduced a bare `_e` that wasn't
# declared in that scope -- it didn't throw a ReferenceError, but after
# Next's minifier reprocessed the bundle it silently resolved to some
# unrelated variable, producing a crash that looked identical to the
# original bug. Native `?.` needs no helper variable, so it can't
# collide with anything, regardless of how the surrounding code is
# minified.
#
# IMPORTANT #2: always reinstall a pristine copy of tinacms before
# patching -- do not rely on detecting "already patched" state and
# skipping. Vercel restores a persistent build cache across deployments
# (visible in build logs as "Restored build cache from previous
# deployment"), which can carry forward a copy of node_modules/tinacms
# already patched by an OLDER version of this script. Re-running an
# idempotency check tuned only for the CURRENT patch's pattern won't
# recognize that older pattern, so this same sed then runs a second
# time against already-patched text and corrupts it (this exact bug
# happened: an old `_e = schema.config.config` patch got double-hit by
# this script's sed, producing `schema.config?.config?)` -- a dangling
# `?` with nothing after it -- which is a genuine syntax error:
# "Unexpected )"). Reinstalling fresh every time removes the
# possibility of stale/double-patched state entirely.
#
# IMPORTANT #3: fetch the package via `npm pack` + tar, NOT
# `npm install tinacms@x --no-save`. The latter still runs npm's full
# dependency-tree reconciliation, and since we'd already manually
# rm -rf'd node_modules/tinacms outside of npm's own bookkeeping, npm
# treated the tree as inconsistent and pruned 363 "extraneous" packages
# on a real Vercel build -- including @tinacms/cli itself, so the next
# step ("tinacms build") failed with "tinacms: command not found" (exit
# 127). Fetching the tarball directly touches nothing else in
# node_modules.

set -e

PKG_DIR="node_modules/tinacms"
TARGET="$PKG_DIR/dist/index.js"

if [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules not found. Run npm install first."
  exit 1
fi

TINACMS_VERSION=$(node -p "require('./package.json').dependencies.tinacms.replace(/^[\^~]/, '')")

echo "Fetching pristine tinacms@$TINACMS_VERSION before patching..."
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
TARBALL=$(npm pack "tinacms@$TINACMS_VERSION" --silent --pack-destination "$TMPDIR")
tar -xzf "$TMPDIR/$TARBALL" -C "$TMPDIR"
rm -rf "$PKG_DIR"
mv "$TMPDIR/package" "$PKG_DIR"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found after fetch."
  exit 1
fi

# Single global fix: every unguarded `schema.config.config` becomes
# `schema.config?.config?`, safely composing with whatever follows
# (`.repoProvider`, `.ui`, etc.) regardless of which of the 6 call
# sites it is. Verified against a pristine install that this exact
# literal string has no pre-existing `?.` variant to double-patch.
sed -i 's/schema\.config\.config/schema.config?.config?/g' "$TARGET"

echo "tinacms repoProvider patch applied."
