---
"@gentleduck/cli": patch
---

fix: deduplicate dependencies and skip already-installed components

- Filter initial registry dependencies against already-installed top-level components to avoid false "already exists" prompts on first install
- Move dependency deduplication to right before the package manager install so all collected deps (including from registry dependencies) are properly deduplicated
