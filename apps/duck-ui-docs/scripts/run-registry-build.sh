#!/bin/bash
set -euo pipefail

# Run the shared registry-build source entry from the docs app so config discovery starts here
# without rebuilding the package on every local docs registry build.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"
REGISTRY_BUILD_ENTRY="${REPO_ROOT}/packages/registry-build/index.ts"

cd "${DOCS_DIR}"

if ! command -v bun &> /dev/null; then
  echo "bun is not installed."
  exit 1
fi

exec bun "${REGISTRY_BUILD_ENTRY}" build
