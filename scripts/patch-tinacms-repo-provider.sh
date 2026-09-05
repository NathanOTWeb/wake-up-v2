#!/bin/bash
# Patch tinacms unguarded repoProvider property access (v3.12.1)
# Adds optional chaining at lines 14906 and 14943 in dist/index.js
# to prevent crash when TinaCloud project lacks GitHub App metadata.
#
# Run as part of the build command to ensure it always applies.

set -e

TARGET="node_modules/tinacms/dist/index.js"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found. Run npm install first."
  exit 1
fi

# Check if already patched
if grep -q '(_e = cms.api.admin.api.schema.config.config)' "$TARGET" 2>/dev/null; then
  echo "tinacms repoProvider patch already applied, skipping."
  exit 0
fi

# Patch line 14906: unguarded repoProvider access
# From: repoProvider: cms.api.admin.api.schema.config.config.repoProvider,
# To:   repoProvider: (_e = cms.api.admin.api.schema.config.config) == null ? void 0 : _e.repoProvider,
sed -i 's/repoProvider: cms\.api\.admin\.api\.schema\.config\.config\.repoProvider,/repoProvider: (_e = cms.api.admin.api.schema.config.config) == null ? void 0 : _e.repoProvider,/g' "$TARGET"

echo "tinacms repoProvider patch applied."