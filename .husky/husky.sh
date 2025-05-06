#!/usr/bin/env sh

echo "[husky] Process has been starting..."

echo "[biome] Running biome linting..."
echo "[biome] Running biome formatting..."
sudo pnpm biome format --write ./
