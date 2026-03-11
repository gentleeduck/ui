---
"@gentleduck/registry-ui": patch
---

fix(registry-ui): replace workspace:* dependencies with published npm versions

The published package had `workspace:*` references that broke any consumer's install.
