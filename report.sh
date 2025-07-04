#!/bin/bash

set -euo pipefail

output="report.json"
tmpfile="$(mktemp)"

echo "{" > "$tmpfile"

### 1. Git Contributions by Directory
echo '  "directories": [' >> "$tmpfile"
first_dir=true

# Get all unique top-level directories from tracked files
git ls-files | awk -F/ 'NF>1 {print $1}' | sort -u | while read -r dir; do
  [ -z "$dir" ] && continue

  # Run git log stats per directory
  stats=$(git log --numstat --pretty="%aN" -- "$dir" | awk -v dir="$dir" '
    BEGIN {
      added=0; removed=0; total=0;
    }
    /^[^0-9[:space:]]/ { author=$0 }
    /^[0-9]/ {
      added+=$1; removed+=$2; total+=$1-$2;
      commits[author]++;
    }
    END {
      printf "{\n  \"directory\": \"%s\",\n  \"total_lines\": %d,\n  \"authors\": [\n", dir, total;
      f=1;
      for (a in commits) {
        if (!f) printf ",\n";
        f=0;
        gsub(/"/, "\\\"", a);
        printf "    {\"author\": \"%s\", \"commits\": %d}", a, commits[a];
      }
      print "\n  ]\n}"
    }')

  if [ "$first_dir" = true ]; then
    first_dir=false
  else
    echo "," >> "$tmpfile"
  fi

  echo "    $stats" >> "$tmpfile"
done
echo -e "\n  ]," >> "$tmpfile"

### 2. Disk Usage
echo '  "disk_usage": [' >> "$tmpfile"
first=true
du -sh * .[^.]* 2>/dev/null | sort -hr | while read -r size path; do
  # Escape path (e.g., with spaces)
  path_escaped=$(printf "%s" "$path" | sed 's/"/\\"/g')
  size_escaped=$(printf "%s" "$size" | sed 's/"/\\"/g')

  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$tmpfile"
  fi

  echo "    {\"path\": \"$path_escaped\", \"size\": \"$size_escaped\"}" >> "$tmpfile"
done
echo -e "\n  ]," >> "$tmpfile"

### 3. Git Commit Summary
echo '  "commit_summary": {' >> "$tmpfile"

# Commits by author
echo '    "by_author": {' >> "$tmpfile"
git log --pretty='%aN' | sort | uniq -c | sort -rn | awk '
  {
    printf "      \"%s\": %s", $2, $1;
    if (NR != NR_END) print ",";
    else print ""
  }' NR_END=$(git log --pretty='%aN' | sort | uniq -c | wc -l) >> "$tmpfile"
echo "    }," >> "$tmpfile"

# Commits by date
echo '    "by_date": {' >> "$tmpfile"
git log --pretty='%ad' --date=short | sort | uniq -c | sort -rn | awk '
  {
    printf "      \"%s\": %s", $2, $1;
    if (NR != NR_END) print ",";
    else print ""
  }' NR_END=$(git log --pretty='%ad' --date=short | sort | uniq -c | wc -l) >> "$tmpfile"
echo "    }" >> "$tmpfile"
echo "  }" >> "$tmpfile"

### Finalize JSON
echo "}" >> "$tmpfile"

mv "$tmpfile" "$output"
echo "✅ Report written to $output"

