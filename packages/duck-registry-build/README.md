<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/registry-build" width="120"/>
</p>

<h1 align="center">@gentleduck/registry-build</h1>

<p align="center">
  Config-driven registry and index builder CLI.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/registry-build"><img src="https://img.shields.io/npm/v/@gentleduck/registry-build.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/registry-build"><img src="https://img.shields.io/npm/dm/@gentleduck/registry-build.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/registry-build.svg" alt="MIT"/></a>
</p>

---

A generic, extension-driven build system for component registries.

The runner is entirely extension-driven: users define their config with `defineConfig()`, register extensions (custom or built-in), and the builder runs them in order. The package provides built-in extensions for UI registries via `uiRegistryPreset()`, or users can create their own extensions for any domain.

## Source Layout

The `src` folder is split by responsibility so the runtime flow is easy to trace:

- `src/config` resolves config files through folder modules such as `loader/`, `merge/`, and `resolution/`, each with its own `index.ts` and local support files.
- `src/pipeline` owns the build context, cache, and folder-based phases where each larger phase keeps its `*.types.ts` and `*.lib.ts` beside the runner.
- `src/extensions` contains folder-based extension modules such as `banner/`, `colors/`, `component-index/`, `extension/`, and `validate/`, with UI-specific helpers isolated under `src/extensions/ui`.
- `src/extensions/ui` now splits ownership by concern: `ui.registry.types.ts` for registry items, `ui.config.types.ts` for UI config contracts, `ui.collection.types.ts` for collection adapters, and `ui.schema.ts` or `ui.collection.ts` for behavior.
- `src/commands/build` and `src/adapters/component-index` follow the same module-folder pattern, keeping command or adapter types beside their implementation files.
- `src/config/types.ts` owns the config contract, `src/config/loader/loader.types.ts` owns loader-specific contracts, and `src/extensions/extension/extension.types.ts` owns the extension runtime contract.
- `src/lib` contains shared filesystem, hashing, path, and transformation utilities.

## Usage

Create a `registry-build.config.ts` beside the app or package that consumes the generated registry:

```ts
import { defineConfig, uiRegistryPreset } from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [...uiRegistryPreset()],
  output: {
    dir: '.',
  },
  sources: {
    'registry:ui': {
      path: '../../packages/registry-ui/src',
      packageName: '@example/registry-ui',
      referencePath: '/registry-ui/src',
    },
  },
  registries: {
    uis: [
      {
        name: 'button',
        root_folder: 'button',
        type: 'registry:ui',
      },
    ],
  },
})
```

Every registry item type is validated as ``registry:${string}``, and `defineConfig()` enforces the same namespace across source keys, package mappings, target paths, schema item types, and inline registry entries.

Run the builder from that consumer directory:

```bash
registry-build build
```

In a workspace app, the local installed binary works the same way:

```bash
./node_modules/.bin/registry-build build
```

## Generic Collections

For non-UI consumers, start with `collections` plus extensions:

```ts
import { defineConfig } from '@gentleduck/registry-build'
import { archRepositoryExtension } from './arch-repository.extension'

export default defineConfig({
  collections: {
    packages: {
      data: './data/packages.json',
      metadata: {
        repoOrder: ['core', 'extra'],
      },
      sources: {
        pkgbuilds: {
          glob: '**/PKGBUILD',
          path: './pkgbuilds',
        },
      },
    },
  },
  extensions: [
    archRepositoryExtension({
      collection: 'packages',
    }),
  ],
  output: {
    dir: './dist',
  },
})
```

See the runnable example in [`examples/arch-package-index`](./examples/arch-package-index).

## Incremental Builds

The builder keeps a local cache under `<output.dir>/.registry-build/` by default.

Useful CLI flags:

```bash
registry-build build --changed-only
registry-build build --changed-only --changed ../../packages/registry-ui/src/button/button.tsx
```

- `--changed-only` keeps the incremental cache on and reuses unchanged outputs aggressively
- `--changed <paths...>` narrows rebuild work to entries affected by those paths

The build summary table now reports actual rewritten files per phase, so a warm no-op build should usually show `Files` as `-`.

## Extensions

Attach optional behavior explicitly:

```ts
import { defineConfig, uiRegistryPreset } from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [
    ...uiRegistryPreset({
      banner: { name: 'My Registry' },
      colors: { /* colors/themes config */ },
      componentIndex: { /* component-index config */ },
    }),
  ],
  output: {
    dir: '.',
  },
})
```

## Config Composition

Configs can extend one or more preset files:

```ts
import { defineConfig } from '@gentleduck/registry-build'

export default defineConfig({
  extends: ['./presets/theme-preset.ts', './presets/source-preset.ts'],
  output: {
    dir: './apps/docs',
  },
})
```

`extends` is path-aware:
- source paths are resolved relative to the file that declared them
- theme/color data files are resolved relative to the preset that declared them
- sources, registries, target paths, package mappings, and theme maps are merged

For code-driven composition, import preset objects and merge them through the public API:

```ts
import { defineConfig, mergeRegistryBuildConfigs } from '@gentleduck/registry-build'
import { baseConfig } from './presets/base'
import { themeConfig } from './presets/theme'

export default defineConfig(mergeRegistryBuildConfigs(baseConfig, themeConfig, {
  output: {
    dir: '.',
  },
}))
```

Consumer-specific presets (e.g., monorepo source layouts, project-specific theme maps) should live beside the consumer config, not inside this package.

## Output

The builder writes:

```text
<output.dir>/
  .registry-build/
  __ui_registry__/index.tsx
  public/r/
    colors/
    components/
    themes/
    index.json
    themes.css
```
