---
"@gentleduck/primitives": patch
"@gentleduck/motion": patch
"@gentleduck/docs": patch
"@gentleduck/registry-ui": patch
---

Replace `workspace:*` deps in published `dependencies` and `peerDependencies` with explicit semver. Previous publishes leaked `workspace:*` to the npm tarball, breaking `bun install` for downstream consumers (`error: Workspace dependency "@gentleduck/calendar" not found`).
