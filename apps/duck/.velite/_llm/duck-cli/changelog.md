## 1.3.2

### Patch Changes

- 918b34c: Strip `workspace:*` and `catalog:` protocol tokens from `devDependencies`/`dependencies`/`peerDependencies` of every public package before `changeset publish`. Previously published artifacts leaked these tokens into npm metadata, which broke strict resolvers (bun, deno) for downstream consumers. Adds `scripts/clean-publish.ts` and wires it into the root `release` script with a `git checkout` restore step so source remains workspace-friendly.

## 1.3.1

### Patch Changes

- 7d6fb7b: Align tsconfig shared configs, fix TS strict mode errors (exactOptionalPropertyTypes, verbatimModuleSyntax), align package.json deps to catalog refs, apply biome lint fixes.

## 1.3.0

### Minor Changes

- 6f0e067: Add `--template` flag to the `init` command for scaffolding projects from templates. Run `npx @gentleduck/cli init --template acme` to download and extract the acme monorepo template.

## 1.2.7

### Patch Changes

- 42f8439: fix(cli): resolve monorepo config, CSS, and components to workspace directory

  - Write `duck-ui.config.json` to workspace instead of monorepo root
  - Write CSS theme file to workspace instead of monorepo root
  - Set `workspace: { root: ".", project: "." }` when config lives in workspace
  - Resolve config search path from workspace in all commands (init, add, update, diff, remove)
  - Fix tsconfig paths template to use `./src/*` so components land in `<workspace>/src/ui/`
  - Add `platform: 'node'` to tsdown config for proper CJS/Node resolution

## 1.2.6

### Patch Changes

- 2b6e8d0: Resolve all biome lint warnings, improve type safety, and add test coverage across the monorepo.

## 1.2.5

### Patch Changes

- 288d274: fix: --yes flag now skips per-component overwrite prompts

  Previously only --force skipped overwrite prompts. Now --yes (non-interactive mode) also skips them, since the user explicitly opted out of interactive prompts.

- f45aa97: fix: show actual error output when dependency installation fails

  Previously stderr was suppressed with stdio:'ignore', making it impossible to diagnose install failures. Now the actual package manager error is included in the failure message.

## 1.2.4

### Patch Changes

- 9a3a651: test: add test cases for dependency deduplication, registry dep filtering, and overwrite prompt behavior
- 4fc4d25: fix: deduplicate dependencies and skip already-installed components

  - Filter initial registry dependencies against already-installed top-level components to avoid false "already exists" prompts on first install
  - Move dependency deduplication to right before the package manager install so all collected deps (including from registry dependencies) are properly deduplicated

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