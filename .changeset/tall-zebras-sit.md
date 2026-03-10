---
"@gentleduck/registry-build": minor
---

Refactor `@gentleduck/registry-build` into a fully extension-driven build system.

- All processing (index build, components, validation, colors/themes, component index, banners) is now performed by explicit extensions — the core runner has no built-in phases.
- Added `indexBuildExtension()` and `componentsExtension()` as standalone extensions (also bundled by `uiRegistryPreset()`).
- Moved monorepo-specific presets out of the package to consumer-local config files.
- Added generic `collections` config surface for non-UI consumers.
- Added incremental file-hash cache with write-skipping, stale file cleanup, and `--changed-only` mode.
- Added config composition via `extends` (path-aware) and `mergeRegistryBuildConfigs()`.
- Consolidated over-split config files, removed dead code, added JSDoc to all public APIs.
- Added unit tests for config merge, defaults, change detection, and adapters.
