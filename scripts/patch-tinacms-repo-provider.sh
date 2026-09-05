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

set -e

TARGET="node_modules/tinacms/dist/index.js"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found. Run npm install first."
  exit 1
fi

# Check if already patched
if grep -Fq 'schema.config?.config' "$TARGET" 2>/dev/null; then
  echo "tinacms repoProvider patch already applied, skipping."
  exit 0
fi

# Single global fix: every unguarded `schema.config.config` becomes
# `schema.config?.config?`, safely composing with whatever follows
# (`.repoProvider`, `.ui`, etc.) regardless of which of the 6 call
# sites it is. Verified against a pristine `tinacms@3.12.1` install
# that this exact literal string has no pre-existing `?.` variant to
# accidentally double-patch.
sed -i 's/schema\.config\.config/schema.config?.config?/g' "$TARGET"

echo "tinacms repoProvider patch applied."