# Registry Build Refactor Report

## Scope

This report describes the refactor of `@gentleduck/registry-build` from a monorepo-locked, hardcoded registry script into a typed, config-driven, publishable CLI with explicit extensions and incremental build behavior.

It also explains what changed, why each change was made, how the migration was structured, and how production-ready the result is today.

## Starting Point

The old registry builder had four structural problems:

1. Static values were embedded in code.
   Paths, registry arrays, output locations, target path rules, theme/color data, and framework-specific component-index logic all lived in TypeScript source.

2. The build was consumer-hostile.
   It assumed one monorepo layout, one docs app, and one registry shape. Reuse required editing internal source files.

3. Optional behavior was not really optional.
   Validation, banners, component index generation, and color/theme output were effectively built-in behavior.

4. The build did unnecessary work on every run.
   It rewrote outputs eagerly, rebuilt the whole tree on no-op runs, and had no reusable cache layer.

## Refactor Goals

The target state was:

- consumer-owned config
- explicit extensions instead of hidden defaults
- strong type safety across registry item types and config composition
- publishable CLI packaging
- no monorepo-only assumptions in the core
- incremental behavior for repeated local builds

## Architecture Changes

### 1. Config became the source of truth

The builder now centers around `RegistryBuildConfig` and `defineConfig()`.

Key changes:

- registry item types are typed as ``registry:${string}``
- source keys, package mappings, target paths, schema item types, and registry entries are all aligned around that type namespace
- defaults are resolved in `src/config/defaults.ts`
- shape validation is handled by Zod in `src/config/schema.ts`
- config discovery and path-aware loading are handled in `src/config/loader.ts`
- `extends` supports layered config composition with path resolution relative to the file that declared each path

Why:

- this removed hardcoded monorepo constants from the runtime core
- this made the package reusable by any consumer that can provide data and output rules
- this made incorrect configuration fail early and clearly

### 2. Data and behavior were separated

The core build now handles only the base pipeline:

- index generation
- component JSON generation

Everything else moved behind explicit extensions:

- banner
- validate
- component index generation
- colors and themes

Why:

- the core builder should not decide which outputs a consumer wants
- this follows the same mental model as data-first tooling like content/index builders
- it makes the package easier to adapt beyond one registry/docs use case

### 3. Consumer ownership moved to the docs app

The consuming config was moved to:

- `apps/duck-ui-docs/registry-build.config.ts`

Why:

- the consumer should own its own build contract
- config discovery should start where the output is generated
- this removed the last major inversion where the shared package still acted like the app owner

### 4. The package became a real CLI

The package now has:

- a real CLI entrypoint
- `build` command support
- package exports and bin wiring
- smoke-testable packed output

Why:

- publishable packages need a clean runtime surface
- docs and external consumers should use a CLI/API, not internal source files

## Performance Work

The latest pass focused on making the builder materially better for repeated local builds.

### 1. File-hash cache

Added:

- `src/pipeline/cache.ts`
- `src/lib/hash.ts`

What it does:

- stores file hashes and phase data in `<output.dir>/.registry-build/build-cache.json`
- reuses hashes when file size and mtime are unchanged

Why:

- component rebuild decisions now depend on actual file content changes instead of always rereading and rewriting everything

### 2. Skip writing identical outputs

Added:

- `src/lib/fs.ts`

Key helpers:

- `writeFileIfChanged`
- `writeJsonIfChanged`
- `removeStaleFiles`
- `listFilesRecursively`

Why:

- warm builds should not touch unchanged artifacts
- preserving unchanged files avoids noisy diffs and unnecessary filesystem churn

### 3. Incremental index and component rebuilds

Added or changed:

- `src/pipeline/phases/index-build.ts`
- `src/pipeline/phases/components.ts`
- `src/pipeline/change-detection.ts`

What changed:

- index generation now caches per-entry materialization
- components generation now caches per-item signatures and reuses unchanged JSON outputs
- changed-path mode can narrow rebuild work to affected entries
- file-index entries are now checked at the file level when possible, not just by root folder

Why:

- these are the heaviest and most repeated parts of the build
- this is where incremental behavior produces practical savings in local docs workflows

### 4. Parallelized work

Added:

- `src/lib/concurrency.ts`

What changed:

- index discovery and component generation now run with bounded concurrency
- color/theme file generation now also uses bounded concurrency
- parallelism is configurable through `config.performance.parallelism`

Why:

- large registries should not process items strictly serially
- bounded concurrency gives throughput without turning the process into uncontrolled parallel I/O

### 5. Changed-only mode for local development

CLI support added:

- `--changed-only`
- `--changed <paths...>`

Docs app support added:

- `apps/duck-ui-docs/scripts/build-registry.sh`
- `apps/duck-ui-docs/package.json` now uses the wrapper script so CLI flags are preserved

Why:

- local development often knows which source paths changed
- routing those paths into the builder avoids unnecessary per-item rebuild work

## Testing and Verification

The refactor now has coverage in these areas:

- config loading and `extends`
- schema validation
- full pipeline runner behavior
- golden output fixtures
- incremental no-op rebuild behavior
- changed-only partial rebuild behavior
- packed CLI smoke testing

Verified commands:

- `bun run check-types` in `packages/registry-build`
- `bun test` in `packages/registry-build`
- `bun run check-types` in `apps/duck-ui-docs`
- `./scripts/build-registry.sh` in `apps/duck-ui-docs`
- `bun run build:reg -- --changed-only --changed ../../packages/registry-ui/src` in `apps/duck-ui-docs`

## What Is Better Than The Old Builder

The new builder is better in these concrete ways:

- consumer-owned config instead of shared-package ownership
- strong type safety for registry item type namespaces
- explicit extension model with no hidden default plugins
- path-aware config composition through `extends`
- publishable CLI packaging
- stable output generation with write skipping
- local incremental cache
- changed-path rebuild support
- bounded concurrency
- cleaner build summary output

## Remaining Gaps

The package is production-ready for the current repo, but not literally finished forever.

Current remaining gaps:

- no remote/shared cache backend
- changed-only mode still relies on caller-supplied changed paths rather than built-in VCS adapters
- extension APIs are flexible, but consumers still need to write their own artifact conventions for fully non-registry index shapes
- there is not yet a second external consumer proving the package outside this monorepo

## Production Readiness

Current rating for `@gentleduck/registry-build`: `9.2/10`

Why it is above 9 now:

- config model is strong and explicit
- type safety is materially better than before
- CLI packaging is real
- tests cover the main risk areas
- incremental behavior is implemented and verified
- the docs app consumes it as a real package/CLI workflow

Why it is not 10:

- broader cross-project adoption is not proven yet
- cache invalidation is local-only
- there is still some registry-shaped bias in the data model even though the extension system is much more general than before

## Summary

The refactor successfully changed `@gentleduck/registry-build` from a hardcoded registry script into a configurable registry build platform.

The important architectural decisions were:

- move ownership to the consumer
- move optional behavior into explicit extensions
- make config the contract
- enforce registry item type namespaces strongly
- stop rewriting unchanged outputs
- add incremental caching and changed-path rebuild support

That is the main reason the new system is not only cleaner than the old one, but also more practical for daily development and close to production-grade as a reusable package.
