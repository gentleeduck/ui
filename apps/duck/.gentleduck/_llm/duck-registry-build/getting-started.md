}>
  One config file, one generated index. The consumer owns every static input up front.

## 1. Install the package

```bash
npm install @gentleduck/registry-build
```

`registry-build` ships as both a CLI and a typed API.

***

## 2. Create `registry-build.config.ts`

Place the config beside the app or package that should own the generated outputs.

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
  output: {
    dir: './dist',
  },
  extensions: [
    archRepositoryExtension({
      collection: 'packages',
    }),
  ],
})
```

}>
  For new non-UI builds, start with `collections`. If you are building a UI/docs registry, the older `sources`, `registries`, `targetPaths`, and related fields still work through the compatibility layer.

***

## 3. Run the build

```bash
registry-build build
```

Or from a package script:

```json
{
  "scripts": {
    "build:reg": "registry-build build"
  }
}
```

***

## 4. Inspect the outputs

For the example above, you will get something like:

```text
<output.dir>/
  .registry-build/
  arch/
    repos/
      core.db.json
      core.files.txt
      extra.db.json
      extra.files.txt
    search.json
```

If you use `...uiRegistryPreset()` or the individual UI extensions (`indexBuildExtension()`, `componentsExtension()`, `componentIndexExtension()`, `colorsExtension()`), you can also get outputs such as `public/r/index.json`, per-item JSON files, `__ui_registry__/index.tsx`, and theme/color artifacts.

***

## 5. Understand what just happened

The config loader discovered your `registry-build.config.ts`

Paths were resolved relative to the config file, not the current working directory.

The loader resolved collections and compatibility fields

`collections` data and collection source paths were resolved relative to the config file. If you had used legacy UI fields, they would have been normalized into collection artifacts as well.

The runner created the shared build context

The context now carries resolved collections, output paths, cache helpers, output registration, and extension APIs.

Extensions ran in order

In this example only the custom extension runs. For a UI registry build, spread `...uiRegistryPreset()` into your `extensions` array to include the standard index-build, components, colors, and component-index extensions.

Extensions added optional outputs

The Arch repository extension read the `packages` collection and emitted repo databases, file manifests, and a search index.

The cache was updated

The builder stored incremental state under `.registry-build/` so the next warm run can skip unchanged work.

***

## Where to go next

} className="[&_ul]:my-0">
  * Read [Configuration](/duck-registry-build/configuration) for the full schema.
  * Read [Extensions](/duck-registry-build/extensions) to understand the explicit plugin model.
  * Read [Course](/duck-registry-build/course) for the full Arch-style package index walkthrough.
  * Read [CLI](/duck-registry-build/cli) for scripting and CI usage.
  * Read [Performance](/duck-registry-build/performance) for cache and changed-only workflows.