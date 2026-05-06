# @gentleduck/upload

## 0.2.5

### Patch Changes

- 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 0.2.4

### Patch Changes

- 0acb667: Point package `exports` at compiled `./dist/*` output instead of `./src/*.ts` source. Add multi-entry build (`index`, `core`, `react`, `strategies`) so subpath imports work for non-bundler consumers (e.g. NestJS via Node CJS). Fixes runtime `SyntaxError` when consumed by apps that don't transpile package source.

## 0.2.2

### Patch Changes

- 0d9dc94: Add publishConfig with public access for scoped npm package.

## 0.2.1

### Patch Changes

- 97606b5: Fix release workflow to skip redundant CI checks during publish.

## 0.2.0

### Minor Changes

- 7c4d70c: Initial release of @gentleduck/upload - a resumable, strategy-based file upload engine for the browser.
