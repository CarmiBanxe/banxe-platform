#!/usr/bin/env bash
# post-commit hook — banxe-platform
# Runs fast type check after every commit to catch regressions early

set -euo pipefail

cd /home/mmber/banxe-platform

echo "🔍 Post-commit: TypeScript check..."
pnpm typecheck --noEmit 2>&1 | tail -5

echo "✅ Post-commit checks passed"
