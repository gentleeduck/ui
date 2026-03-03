# @gentleduck/cli

## 1.2.3

### Patch Changes

- 22fa78f: fix: align ThemeResponse type with updated registry API response shape

  The theme registry endpoint now returns `light`, `dark`, and `radius` at the top level instead of nesting them under `cssVars`. Updated all consumers to match the new response shape.

## 1.2.2

### Patch Changes

- 7c2aa88: Update dependencies and publish unpublished packages

## 1.2.1

### Patch Changes

- c9bbef8: Documentation and style updates.

## 1.2.0

### Minor Changes

- ad86755: Major CLI overhaul with interactive merge/diff GUI, architecture refactor, and comprehensive test coverage.

  **Features:**

  - Add interactive merge GUI with three-way conflict resolution and syntax highlighting
  - Add interactive diff viewer with side-by-side comparison
  - Add figlet ASCII banner and dynamic terminal resize handling
  - Add merge conflict marker colorization (ours=green, theirs=blue, base=yellow)
  - Add `--verbose` flag for detailed logging output
  - Add `update`, `remove`, and `diff` commands with workspace support

  **Architecture Refactor:**

  - Replace axios with native fetch API across all HTTP operations
  - Split monolithic merge-screen into workflow hook and keyboard hook modules
  - Split monolithic diff-screen into workflow hook and keyboard hook modules
  - Extract shared utilities (formatting helpers, ANSI constants, type definitions)
  - Consolidate scattered type definitions into centralized modules
  - Add VimStdin.asInkStdin() method to encapsulate stream type casting

  **Infrastructure:**

  - Fix tsconfig module resolution (add module: esnext, change to bundler resolution)
  - Sync local registry schema with canonical @gentleduck/registers source
  - Add comprehensive vitest test suite with 170 tests across unit, integration, and e2e
  - Add JSDoc documentation and inline comments throughout the codebase
  - Clean up dependencies, deduplicate logic, remove dead code
  - Fix critical bugs in install command, error handling, and binary resolution

## 1.1.0

### Minor Changes

- Add robust monorepo workspace support across CLI commands.

  - Add `--workspace <path>` support for `init`, `add`, `update`, `remove`, and `diff`
  - Validate workspace targets (`package.json` and `tsconfig.json` where required)
  - Infer workspace from current directory when running inside a monorepo workspace
  - Improve config handling with legacy migration errors for missing `workspace`
  - Add command help/docs/test coverage for workspace behavior

## 1.0.11

### Patch Changes

- Fix binary entry point resolution for global CLI installation via npx.
