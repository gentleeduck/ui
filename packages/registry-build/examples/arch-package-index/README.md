# Arch Package Index Example

This example shows how to use `@gentleduck/registry-build` as a generic build core for a package repository instead of a UI component registry.

It intentionally does **not** use:

- `sources`
- `registries`
- `componentIndex`
- `colors`
- `themes`

Instead it uses:

- `collections.packages`
- a custom `archRepositoryExtension()`
- `pipeline.index = false`
- `pipeline.components = false`

## What it emits

Running this config produces:

- `dist/arch/repos/core.db.json`
- `dist/arch/repos/extra.db.json`
- `dist/arch/repos/core.files.txt`
- `dist/arch/repos/extra.files.txt`
- `dist/arch/search.json`

## Why this example exists

The goal is to prove that `registry-build` can act as:

- a config loader
- an extension runtime
- a cache/incremental build engine
- an output registration system

without assuming the domain is UI components.
