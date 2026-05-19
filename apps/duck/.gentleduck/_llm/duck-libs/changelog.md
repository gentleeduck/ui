## 0.2.1

### Patch Changes

* 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 0.2.0

### Minor Changes

* 7d6fb7b: Namespace refactors: calendar react namespaces renamed to match hook names, hooks/lazy types moved into namespaces, libs utils extracted into own modules, vim react types collapsed into single Vim namespace.

## 0.1.16

### Patch Changes

* 6f0e067: Standardize package exports to use explicit named exports, add `sideEffects` field and `types` export entries to package.json, and annotate internal APIs with `@internal` JSDoc tags.

## 0.1.15

### Patch Changes

* 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.

## 0.1.14

### Patch Changes

* 7c2aa88: Update dependencies and publish unpublished packages

## 0.1.13

### Patch Changes

* c9bbef8: Documentation and style updates.

## 0.1.12

### Patch Changes

* ad86755: Align biome and tsconfig build info exclusions. Rebrand package metadata to gentleduck/duck-ui.

## 0.1.11

### Patch Changes

* Add composeEventHandlers and createContext utility functions. Normalize package metadata and set up type checking across the library.