# @gentleduck/registry-build

Config-driven registry and index builder.

The core build only handles registry indexing and component JSON generation. Extra behavior such as banners, validation, component-index generation, and colors/themes output is attached explicitly through `extensions` in the consuming config.

## Usage

Create a `registry-build.config.ts` beside the app or package that consumes the generated registry:

```ts
import { defineConfig, validateExtension } from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [validateExtension()],
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

## Extensions

Attach optional behavior explicitly:

```ts
import {
  bannerExtension,
  colorsExtension,
  componentIndexExtension,
  defineConfig,
  validateExtension,
} from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [
    bannerExtension({ name: 'My Registry' }),
    validateExtension(),
    componentIndexExtension(),
    colorsExtension(),
  ],
  output: {
    dir: '.',
  },
})
```

## Presets

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
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createMonorepoSourcesPreset,
  defineConfig,
  mergeRegistryBuildConfigs,
  monorepoRegistryPreset,
} from '@gentleduck/registry-build'

const packagesDir = fileURLToPath(new URL('../../packages', import.meta.url))
const preset = mergeRegistryBuildConfigs(
  monorepoRegistryPreset,
  createMonorepoSourcesPreset({
    packagesDir: path.resolve(packagesDir),
  }),
)

export default defineConfig(mergeRegistryBuildConfigs(preset, {
  output: {
    dir: '.',
  },
}))
```

## Output

The builder writes:

```text
<output.dir>/
  __ui_registry__/index.tsx
  public/r/
    colors/
    components/
    themes/
    index.json
    themes.css
```
