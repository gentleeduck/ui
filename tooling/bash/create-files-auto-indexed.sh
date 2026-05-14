#!/usr/bin/env bash
# Usage: ./create-files-auto-indexed.sh <filename> <target_dir> [count]
# Example: ./create-files-auto-indexed.sh input-group.tsx ./src/components 5
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "❌ Usage: $0 <filename> <target_dir> [count]" >&2
  exit 1
fi

file="$1"
target_dir="$2"
count="${3:-1}"

base="$(basename "$file")"
ext="${base##*.}"
name="${base%.*}"

mkdir -p "$target_dir"

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

