}>

The full config reference. For new non-UI consumers, start with `collections`. The
older UI-shaped fields still work, but they're a compatibility surface — not the
recommended starting point.

## Minimal generic shape

```ts

export default defineConfig({
  extends: ['./registry-build.base.ts'],
  collections: {},
  output: {
    dir: './dist',
  },
  performance: {},
  branding: {},
  extensions: [],
})
```

}>

For a UI/docs registry, `sources`, `registries`, `targetPaths`, `importMappings`,
`componentIndex`, `colors`, `themes`, and the related fields still work through the
compatibility layer.

---

## Generic-first reference

  
    collections
    

`collections` is the generic input surface for non-UI builds.

Each collection can provide:

| Field | Type | Purpose |
| --- | --- | --- |
| `data` | `unknown \| string` | Inline data or a file path to load |
| `metadata` | `Record<string, unknown>` | Arbitrary static metadata for extensions |
| `sources` | `Record<string, RegistryBuildSource>` | Named source trees related to the collection |

```ts
collections: {
  packages: {
    data: './data/packages.json',
    metadata: {
      repoOrder: ['core', 'extra', 'community'],
    },
    sources: {
      pkgbuilds: {
        glob: '**/PKGBUILD',
        path: './pkgbuilds',
        referencePath: '/pkgbuilds',
      },
    },
  },
}
```

Use `collections` when you're building a package index or repo catalog, when
extensions need arbitrary data without pretending it's a UI component registry, and
when you want a small generic config with minimal domain assumptions.

    
  

  
    output
    

`output.dir` is required after defaults and `extends` are resolved.

| Field | Default |
| --- | --- |
| `dir` | required |
| `registryDir` | `public/r` |
| `componentIndexDir` | `__ui_registry__` |
| `componentIndexFile` | `index.tsx` |
| `componentsDir` | `components` |
| `colorsDir` | `colors` |
| `themesDir` | `themes` |
| `themesCssFile` | `themes.css` |

```ts
output: {
  dir: './dist',
}
```

Even in a generic build, the cache still lives under `<output.dir>/.registry-build/` by default.

    
  

  
    performance
    

Performance settings control incremental behavior.

| Field | Default | Purpose |
| --- | --- | --- |
| `cacheDir` | `.registry-build` | Cache directory under `output.dir` |
| `incremental` | `true` | Enable file-hash cache and phase reuse |
| `parallelism` | `min(cpuCount, 8)` | Bound concurrent discovery and generation work |

```ts
performance: {
  cacheDir: '.registry-build',
  incremental: true,
  parallelism: 6,
}
```

    
  

  
    extensions
    

Extensions are the primary mechanism for adding behavior to the builder. The runner is entirely extension-driven  -  all processing (index-build, components, colors, component-index, validation, banners) is performed by extensions.

For UI registries, either use `uiRegistryPreset()` to bundle the standard extensions, or register them individually for full control:

```ts

  bannerExtension,
  colorsExtension,
  componentIndexExtension,
  componentsExtension,
  defineConfig,
  indexBuildExtension,
  validateExtension,
} from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [
    bannerExtension({ name: 'My Registry' }),
    validateExtension(),
    indexBuildExtension(),
    componentsExtension(),
    componentIndexExtension({ framework: 'nextjs' }),
    colorsExtension(),
  ],
  output: { dir: './dist' },
  // ...
})
```

For custom builds, register your own extensions:

```ts
extensions: [
  archRepositoryExtension({
    collection: 'packages',
  }),
]
```

The recommended pattern is to keep static data in config, let extensions read collections and existing artifacts, and let extensions register outputs explicitly.

    
  

  
    branding
    

`branding` is lightweight metadata for CLI- or extension-facing presentation.

| Field | Type | Default |
| --- | --- | --- |
| `name` | `string` | `'@gentleduck/registry-build'` |
| `font` | `string` | `'ANSI Shadow'` |

```ts
branding: {
  name: 'Acme Registry',
  font: 'ANSI Shadow',
}
```

Treat this as presentation metadata, not as core build logic.

    
  

  
    extends and mergeRegistryBuildConfigs
    

Use `extends` for file-based composition and `mergeRegistryBuildConfigs()` for code-driven composition.

`extends` is path-aware. Collection data files resolve relative to the file that declared them, collection source paths resolve relative to the file that declared them, source paths and external data files from compatibility fields follow the same rule, and maps and arrays are merged where appropriate.

```ts
export default defineConfig({
  extends: ['./registry-build.base.ts', './registry-build.arch.ts'],
  output: {
    dir: './dist',
  },
})
```

```ts

export default defineConfig(mergeRegistryBuildConfigs(baseConfig, archConfig))
```

    
  

---

## UI compatibility reference

}>

These fields are still important for docs-style UI registries. They are supported today, but they should be understood as a compatibility layer on top of the emerging generic core.

  
    sources
    

`sources` maps each UI registry item type to a source directory definition.

| Field | Type | Purpose |
| --- | --- | --- |
| `path` | `string` | Filesystem path relative to the config file |
| `packageName` | `string` | Package base used for generated import paths |
| `glob` | `string` | Discovery pattern, default `**/*.{ts,tsx}` |
| `ignore` | `string[]` | Ignore globs for discovery, default `['**/__test__/**', '**/*.test.*', '**/*.spec.*']` |
| `indexStrategy` | `'item' \| 'file'` | Emit one index record per registry item or per discovered file |
| `referencePath` | `string` | Stable logical path stored in generated metadata |

```ts
sources: {
  'registry:ui': {
    path: '../../packages/registry-ui/src',
    packageName: '@example/registry-ui',
    referencePath: '/registry-ui/src',
  },
  'registry:example': {
    path: '../../packages/registry-examples/src',
    indexStrategy: 'file',
    referencePath: '/registry-examples/src',
  },
}
```

UI item types are validated as ``registry:${string}``.

    
  

  
    registries and registrySource
    

`registries` is the structured metadata that describes UI registry items. Categories are consumer-defined keys such as `uis`, `examples`, or `blocks`.

`registrySource` controls where those entries come from. Use `'inline'` to read the `registries` object directly, or use a file path to load external JSON or TS data and merge it with inline entries.

```ts
registrySource: 'inline',
registries: {
  uis: [
    {
      name: 'button',
      root_folder: 'button',
      type: 'registry:ui',
    },
  ],
}
```

Each entry can include metadata such as `dependencies`, `registryDependencies`, `files`, `description`, `categories`, `tailwind`, and `cssVars`.

    
  

  
    importMappings and targetPaths
    

Use `contentRewrites` when copied source files need import rewriting. Use `packageMappings` when generated component indexes should import from a package path that differs from the source declaration.

Use `targetPaths` to tell generated item files where they should land in consumer projects.

```ts
importMappings: {
  contentRewrites: [
    {
      pattern: '@old/pkg',
      replacement: '@new/pkg',
    },
  ],
  packageMappings: {
    'registry:ui': '@example/registry-ui',
    'registry:example': '@example/registry-examples',
  },
},
targetPaths: {
  'registry:ui': 'components/ui',
  'registry:example': 'components',
}
```

    
  

  
    componentIndex
    

This config shapes the generated component import index used by `componentIndexExtension()`.

| Field | Purpose |
| --- | --- |
| `framework` | Select built-in adapter: `nextjs`, `vite`, or `custom` |
| `header` | Override generated file header |
| `excludeTypes` | Skip registry item types from the component index |
| `ssr` | Framework-specific SSR hint |
| `generator` | Full custom generator function |

```ts
componentIndex: {
  framework: 'nextjs',
  excludeTypes: ['registry:ui', 'registry:hook'],
  ssr: false,
}
```

If `generator` is set, it takes over file generation entirely.

    
  

  
    colors, themes, and cssTemplates
    

These fields feed the colors/themes extension layer.

`colors.data` and `themes.data` can be inline objects or file paths when they are declared at the root config level.

`themes` also controls `cssVarKeys`, `names`, and `defaultRadius`.

`cssTemplates` lets consumers override the generated base CSS strings.

```ts
colors: {
  data: './data/colors.json',
},
themes: {
  data: './data/themes.json',
  names: ['zinc', 'stone'],
  cssVarKeys: ['background', 'foreground'],
  defaultRadius: '0.5rem',
},
cssTemplates: {
  baseStyles: '@tailwind base;\\n@tailwind components;\\n@tailwind utilities;',
  baseLayerRules: '@layer base { ... }',
}
```

    
  

  
    schema and stripVariables
    

`schema.itemTypes` declares the UI registry item type namespace you expect.

`stripVariables` removes named variables from copied source files before they are emitted into generated JSON payloads.

```ts
schema: {
  itemTypes: ['registry:ui', 'registry:example', 'registry:block'],
},
stripVariables: ['iframeHeight', 'description'],
```

    
  

---

## Rule of thumb

} className="[&_ul]:my-0">

- Start new package or repository indexes from `collections`.
- Use compatibility fields only when you are deliberately building the UI/docs registry shape.
- Put static values in config and computed behavior in extensions.
- Keep extension output names explicit so the build summary stays readable.