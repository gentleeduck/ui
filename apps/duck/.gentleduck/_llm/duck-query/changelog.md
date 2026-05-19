## 0.1.7

### Patch Changes

* 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 0.1.6

### Patch Changes

* 4f93768: fixing bugs and making sure gen support new format

## 0.1.5

### Patch Changes

* 7c62d44: done
* 7c62d44: fixed bug

## 0.1.5

### Patch Changes

* 533602f: fixed gen and query

## 0.1.4

### Patch Changes

* 48e4bbf: fixed deps

## 0.1.3

### Patch Changes

* batman