#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

"${SCRIPT_DIR}/run-registry-build.sh" "$@"
cd "${DOCS_DIR}"
bunx biome format --write ./__ui_registry__/index.tsx
