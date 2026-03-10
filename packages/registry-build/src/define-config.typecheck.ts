import { defineConfig } from './define-config'

defineConfig({
  collections: {
    packages: {
      data: [
        {
          name: 'bash',
          repo: 'core',
        },
      ],
      metadata: {
        repoOrder: ['core'],
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
  pipeline: {
    components: false,
    index: false,
  },
})

defineConfig({
  output: {
    dir: './dist',
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
  sources: {
    'registry:ui': {
      path: './src/ui',
    },
  },
})

defineConfig({
  componentIndex: {
    excludeTypes: ['registry:page'],
  },
  output: {
    dir: './dist',
  },
  schema: {
    itemTypes: ['registry:page'],
  },
  targetPaths: {
    'registry:page': 'app',
  },
})

defineConfig({
  importMappings: {
    packageMappings: {
      'registry:ui': '@example/ui',
    },
  },
  output: {
    dir: './dist',
  },
})

// @ts-expect-error registry source keys must use the "registry:*" namespace.
defineConfig({
  output: {
    dir: './dist',
  },
  sources: {
    ui: {
      path: './src/ui',
    },
  },
})

defineConfig({
  output: {
    dir: './dist',
  },
  registries: {
    uis: [
      {
        name: 'button',
        root_folder: 'button',
        // @ts-expect-error registry entries must use the "registry:*" namespace.
        type: 'ui',
      },
    ],
  },
})

// @ts-expect-error package mappings are keyed by registry item type.
defineConfig({
  importMappings: {
    packageMappings: {
      ui: '@example/ui',
    },
  },
  output: {
    dir: './dist',
  },
})
