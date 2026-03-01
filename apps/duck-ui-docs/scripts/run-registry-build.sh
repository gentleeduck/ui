#!/bin/bash
set -euo pipefail

# Script: run-registry-build.sh
# Description: Navigates to the `registry-build` package directory and runs the `start` script.
# Usage: ./scripts/run-registry-build.sh

# Log: Script started
echo "🚀 Starting registry build script..."

# Resolve repo root from script location, then navigate to registry-build package
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"
REGISTRY_BUILD_DIR="${REPO_ROOT}/packages/registry-build"

echo "📂 Changing directory to ${REGISTRY_BUILD_DIR}..."
if cd "${REGISTRY_BUILD_DIR}"; then
  echo "✅ Successfully changed directory."
else
  echo "❌ Failed to change directory. Please ensure the path '${REGISTRY_BUILD_DIR}' exists."
  exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
  echo "❌ bun is not installed. Please install bun first."
  exit 1
fi

# Run the start script
echo "🔧 Running 'bun run start'..."
if bun run start; then
  echo "🎉 Registry build completed successfully!"
else
  echo "❌ Failed to run 'bun run start'. Check the logs for errors."
  exit 1
fi

# Log: Script completed
echo "🏁 Script execution finished."

#
# NOTE: THIS SHOULD BE THE OUTPUT
#
# > @gentleduck/docs@0.0.1 build:reg /mnt/1T_wild/wildduck/@gentleduck-ui/apps/docs
# > ./scripts/run-registry-build.sh
#
# 🚀 Starting registry build script...
# 📂 Changing directory to ./packages/registry-build...
# ✅ Successfully changed directory.
# 🔧 Running 'bun run start'...
#
# > @gentleduck/registry-build@0.1.0 start /mnt/1T_wild/wildduck/@gentleduck-ui/packages/registry-build
# > bun ./index.ts
#
#     ██████╗ ██╗   ██╗ ██████╗██╗  ██╗    ██╗   ██╗██╗
#     ██╔══██╗██║   ██║██╔════╝██║ ██╔╝    ██║   ██║██║
#     ██║  ██║██║   ██║██║     █████╔╝     ██║   ██║██║
#     ██║  ██║██║   ██║██║     ██╔═██╗     ██║   ██║██║
#     ██████╔╝╚██████╔╝╚██████╗██║  ██╗    ╚██████╔╝██║
#     ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝
#
# ✔ 🎉 Done!, the registry is ready!
# 🎉 Registry build completed successfully!
# 🏁 Script execution finished.
#
# INFO: hence you saw this message, the registry is ready you can check it in `apps/docs/public`
#
