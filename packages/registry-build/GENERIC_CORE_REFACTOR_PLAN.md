# Generic Core Refactor Plan

`@gentleduck/registry-build` started as a UI registry builder. The next refactor turns it into a generic index-building core that can power UI registries, Arch-style package repositories, npm-like package catalogs, and custom search/manifests through extensions.

## Problem

The current public config still exposes too many UI-shaped concepts:

- `componentIndex`
- `colors`
- `themes`
- `cssTemplates`
- `stripVariables`
- `targetPaths`
- `importMappings`
- component-shaped `registries`

That makes the package feel like "the ui-docs builder, but configurable" instead of "a generic build core with optional UI extensions."

## Target Architecture

Split the package into:

1. A generic core
2. Domain extensions
3. Compatibility adapters for the old UI surface

The generic core should only care about:

- config loading and composition
- collections of input data
- build context and artifacts
- caching and incremental rebuilds
- extension execution
- generic output registration

Everything domain-specific should move into extensions or extension packs.

## Core Config Target

The long-term core config should look more like this:

```ts
import { defineConfig } from '@gentleduck/registry-build'
import { archRepositoryExtension } from './extensions/arch-repository'

export default defineConfig({
  extends: ['./registry-build.base.ts'],
  collections: {
    packages: {
      data: './data/packages.json',
      sources: {
        pkgbuilds: {
          path: './pkgbuilds',
          glob: '**/PKGBUILD',
        },
      },
      metadata: {
        repoOrder: ['core', 'extra', 'community'],
      },
    },
  },
  output: {
    dir: './dist',
  },
  performance: {
    incremental: true,
  },
  extensions: [
    archRepositoryExtension({
      collection: 'packages',
    }),
  ],
})
```

## Phases

### Phase 1: Generic Config Surface

- Add `collections` as a first-class config field.
- Allow file-backed collection data through `collection.data`.
- Resolve collection source paths relative to the config file.
- Expose resolved collections in the build context as a generic artifact.
- Keep legacy `sources` and `registries` working.

Status: in progress

### Phase 2: Compatibility Layer

- Translate legacy UI config into generic collection artifacts.
- Mark UI-shaped top-level config fields as compatibility fields in docs.
- Keep `duck-ui-docs` working without immediate migration.

Status: planned

### Phase 3: Data-First Extension APIs

- Give extensions a stable way to read named collections.
- Add helpers for emitting generic JSON, text, and tree outputs.
- Reduce extension coupling to legacy phase names like `components`.

Status: planned

### Phase 4: Domain Packs

- Move UI-specific behavior into a dedicated extension pack.
- Add an Arch-style repository example and extension pack.
- Add a generic package-catalog example.

Status: planned

### Phase 5: Pipeline Renaming

Move from UI-shaped phases:

- `index`
- `components`

Toward generic lifecycle stages:

- discover
- load
- normalize
- transform
- emit

Status: planned

### Phase 6: Remove UI Bias From Core Types

- Replace component-centric assumptions in core public types.
- Keep legacy `RegistryEntry` only as a compatibility type.
- Introduce domain-neutral record and collection terminology in docs and helpers.

Status: planned

### Phase 7: Major-Version Cleanup

- Deprecate old UI-first top-level config fields.
- Publish migration guide from legacy config to collection-plus-extension config.
- Remove compatibility shims in the next major release.

Status: planned

## Success Criteria

The refactor is complete when all of the following are true:

- A non-UI consumer can build useful outputs without seeing UI-specific config fields.
- A package-index consumer can start from `collections` plus extensions only.
- `duck-ui-docs` behavior is implemented as an extension pack, not as the core identity.
- The public API examples for UI, Arch-style repos, and generic package catalogs all feel natural.
- Incremental build, cache, and output registration remain first-class across all domains.
