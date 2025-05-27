#!/bin/bash

output="report.json"
echo "{" > "$output"

### 1. Git Contributions by Directory
echo '  "directories": [' >> "$output"
first_dir=true
git ls-tree -d --name-only HEAD | while read dir; do
  [ -z "$dir" ] && continue
  if [ "$first_dir" = false ]; then echo "," >> "$output"; fi
  first_dir=false

  git log --numstat --pretty="%aN" -- "$dir" | \
  awk -v dir="$dir" '
    BEGIN {
      added=0; removed=0; total=0;
    }
    /^[^0-9[:space:]]/ { author=$0 }
    /^[0-9]/ {
      added+=$1; removed+=$2; total+=$1-$2;
      commits[author]++;
    }
    END {
      printf "    {\n      \"directory\": \"%s\",\n      \"total_lines\": %d,\n      \"authors\": [\n", dir, total;
      first=1;
      for (a in commits) {
        if (!first) printf ",\n";
        first=0;
        printf "        {\"author\": \"%s\", \"commits\": %d}", a, commits[a];
      }
      printf "\n      ]\n    }";
    }'
done
echo -e "\n  ]," >> "$output"

### 2. Disk Usage
echo '  "disk_usage": [' >> "$output"
du -sh * .[^.]* 2>/dev/null | sort -hr | awk '
  BEGIN { first=1 }
  {
    if (!first) printf ",\n";
    first=0;
    printf "    {\"path\": \"%s\", \"size\": \"%s\"}", $2, $1;
  }
  END { print "" }'
echo '  ],' >> "$output"

### 3. Git Commits Summary (By Author & Date)
echo '  "commit_summary": {' >> "$output"
git log --pretty='%aN %ad' --date=short | awk '
  {
    count[$1]++;
    date[$2]++;
  }
  END {
    printf "    \"by_author\": {\n";
    first=1;
    for (a in count) {
      if (!first) printf ",\n";
      first=0;
      printf "      \"%s\": %d", a, count[a];
    }
    printf "\n    },\n";

    printf "    \"by_date\": {\n";
    first=1;
    for (d in date) {
      if (!first) printf ",\n";
      first=0;
      printf "      \"%s\": %d", d, date[d];
    }
    printf "\n    }\n";
  }'
echo '  }' >> "$output"

### Finalize JSON
echo "}" >> "$output"

echo "✅ Report written to $output"

