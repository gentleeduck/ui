#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------------------
# create-files-auto-indexed.sh
# ------------------------------------------------------------------------------
# Creates multiple indexed files like:
#   input-group-1.tsx, input-group-2.tsx, ...
#
# Usage:
#   ./create-files-auto-indexed.sh <filename> <target_dir> [count]
#
# Example:
#   ./create-files-auto-indexed.sh input-group.tsx ./src/components 5
# ------------------------------------------------------------------------------

# --- Check arguments ----------------------------------------------------------
if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <filename> <target_dir> [count]" >&2
  exit 1
fi

file="$1"
target_dir="$2"
count="${3:-1}" # default: create 1 file

# --- Parse base and extension -------------------------------------------------
base="$(basename "$file")"
ext="${base##*.}"
name="${base%.*}"

# --- Create directory if it doesn't exist -------------------------------------
mkdir -p "$target_dir"

# --- Create indexed files -----------------------------------------------------
for ((i=1; i<=count; i++)); do
  new_file="${target_dir}/${name}-${i}.${ext}"

  if [ -e "$new_file" ]; then
    echo "⚠️  Skipped: $new_file (already exists)"
  else
    touch "$new_file"
    echo "✅ Created: $new_file"
  fi
done

echo "✨ Done! Created $count file(s) in $target_dir"

