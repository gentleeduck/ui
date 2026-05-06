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

Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.
