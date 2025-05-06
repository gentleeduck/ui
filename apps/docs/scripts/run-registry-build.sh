#!/bin/bash

# Script: run-registry-build.sh
# Description: Navigates to the `registry-build-duckui` package directory and runs the `start` script.
# Usage: ./scripts/run-registry-build.sh

# Log: Script started
echo "🚀 Starting registry build script..."

# Navigate to the registry-build-duckui package directory
echo "📂 Changing directory to ./packages/registry-build-duckui..."
if cd ../../packages/registry-build-duckui; then
  echo "✅ Successfully changed directory."
else
  echo "❌ Failed to change directory. Please ensure the path './packages/registry-build-duckui' exists."
  exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed. Please install pnpm globally."
  exit 1
fi

# Run the start script with sudo (if required)
echo "🔧 Running 'pnpm run start'..."
if sudo pnpm run start; then
  echo "🎉 Registry build completed successfully!"
else
  echo "❌ Failed to run 'pnpm run start'. Check the logs for errors."
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
# 📂 Changing directory to ./packages/registry-build-duckui...
# ✅ Successfully changed directory.
# 🔧 Running 'pnpm run start'...
#
# > @gentleduck/registry-build-duckui@0.1.0 start /mnt/1T_wild/wildduck/@gentleduck-ui/packages/registry-build-duckui
# > tsx ./index.ts
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
