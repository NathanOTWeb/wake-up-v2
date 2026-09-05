#!/bin/bash
# Patches tinacms's dist/index.js (v3.12.1) for two separate bugs. Despite
# the filename, this now covers more than the original repoProvider fix --
# see IMPORTANT #4 below for the second one.
#
# --- Patch A: unguarded `schema.config.config` accesses ---
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
#
# --- Patch B: CollectionListPage's handleNavigate exits the SPA entirely
# instead of navigating to the live-preview iframe ---
# Clicking a document in the collection list (once ui.router is defined,
# see tina/collection/home.tsx) calls handleNavigate(), which checks a CMS
# flag called "tina-preview" to decide whether to stay inside the admin
# (navigate to `#/~/...`) or do a full `window.location.href = ...` exit.
# But "tina-preview" is never set ANYWHERE in this entire bundle -- it's
# read in 6 places, and grep confirms zero writers. The other 5 read sites
# use it as a STRING (a static-preview build's output subpath, e.g.
# "some-path/index.html#..."), a separate/unrelated feature from ours, so
# blindly setting it truthy would corrupt those other 5 call sites' hrefs
# into "true/index.html#...". This is a genuine upstream gap: the flag our
# setup actually sets when a `preview` prop is provided is "tina-iframe"
# (via SetPreviewFlag), and handleNavigate's check was never updated to
# also recognize it.
#
# Fix: patch ONLY the one `tinaPreview` read inside handleNavigate
# (anchored via the unique preceding `route-mapping` line right above it,
# confirmed to appear exactly once in the whole file) to also accept
# "tina-iframe", leaving the other 5 call sites' string-based usage
# completely untouched.

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

# Patch A: every unguarded `schema.config.config` becomes
# `schema.config?.config?`, safely composing with whatever follows
# (`.repoProvider`, `.ui`, etc.) regardless of which of the 6 call
# sites it is. Verified against a pristine install that this exact
# literal string has no pre-existing `?.` variant to double-patch.
sed -i 's/schema\.config\.config/schema.config?.config?/g' "$TARGET"

if ! grep -Fq 'schema.config?.config' "$TARGET"; then
  echo "ERROR: patch A (schema.config.config) did not apply."
  exit 1
fi

# Patch B: handleNavigate's tinaPreview flag check, anchored to the unique
# preceding route-mapping line so only this one call site is touched.
sed -i '/const routeMapping = plugins\.find(({ name: name2 }) => name2 === "route-mapping");/{n;s/const tinaPreview = cms\.flags\.get("tina-preview") || false;/const tinaPreview = cms.flags.get("tina-preview") || cms.flags.get("tina-iframe") || false;/}' "$TARGET"

if ! grep -Fq 'cms.flags.get("tina-preview") || cms.flags.get("tina-iframe")' "$TARGET"; then
  echo "ERROR: patch B (handleNavigate tina-iframe) did not apply."
  exit 1
fi

echo "tinacms patches applied (repoProvider + handleNavigate iframe check)."
