---
"@gentleduck/calendar": patch
"@gentleduck/cli": patch
"@gentleduck/docs": patch
"@gentleduck/gen": patch
"@gentleduck/hooks": patch
"@gentleduck/iam": patch
"@gentleduck/lazy": patch
"@gentleduck/libs": patch
"@gentleduck/motion": patch
"@gentleduck/primitives": patch
"@gentleduck/query": patch
"@gentleduck/ttest": patch
"@gentleduck/upload": patch
"@gentleduck/variants": patch
"@gentleduck/vim": patch
"@gentleduck/registry-ui": patch
---

Re-publish with `clean-publish.ts` actually wired into the changesets action `publish:` step. The previous release used `bunx changeset publish` directly, bypassing the root `release` script. As a result `workspace:*` and `catalog:` tokens still leaked into devDependencies metadata for the artifacts published in this cycle. This release runs the cleanup inline before publish.
