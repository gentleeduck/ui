# @gentleduck/vim

## 0.2.1

### Patch Changes

- 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 0.2.0

### Minor Changes

- 7d6fb7b: Namespace refactors: calendar react namespaces renamed to match hook names, hooks/lazy types moved into namespaces, libs utils extracted into own modules, vim react types collapsed into single Vim namespace.

## 0.1.18

### Patch Changes

- 32d0136: fix: use optional chain in parser for biome lint compliance

## 0.1.17

### Patch Changes

- 6f0e067: Standardize package exports to use explicit named exports, add `sideEffects` field and `types` export entries to package.json, and annotate internal APIs with `@internal` JSDoc tags.

## 0.1.16

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.

## 0.1.15

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages

## 0.1.14

### Patch Changes

- c9bbef8: Documentation and style updates.

## 0.1.13

### Patch Changes

- ad86755: Add comprehensive keyboard input processing pipeline and React integration hooks.

  **New Modules:**

  - Add platform detection module for OS-aware modifier key handling
  - Add key parser module for normalizing raw keyboard events into structured key objects
  - Add key matcher module for comparing parsed keys against registered bindings
  - Add format module for human-readable key combination display strings
  - Add sequence module for multi-key chord and sequence matching
  - Add recorder module for capturing and replaying key input sessions

  **React Integration:**

  - Add useVim and useKeySequence React hooks for declarative keybinding in components
  - Enhance KeyProvider with context-based keybinding registration and conflict detection
  - Enhance command module with options parameter and binding conflict detection

  **Maintenance:**

  - Align biome and tsconfig build info exclusions
  - Update package config, tsconfig, and README

## 0.1.12

### Patch Changes

- Fix TypeScript type exports and resolve type-only import issues affecting downstream consumers.

## 0.1.1

### Patch Changes

- Initial integration with gentleduck/ui monorepo. Set up package configuration, build pipeline, and core vim keybinding primitives.
