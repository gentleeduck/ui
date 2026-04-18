import path from 'node:path'
import { registry } from '@gentleduck/registers'
import { defineConfig } from '@gentleduck/registry-build'

export const MONOREPO_THEME_CSS_VAR_KEYS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'warning',
  'warning-foreground',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

export const MONOREPO_THEME_NAMES = [
  'zinc',
  'slate',
  'stone',
  'gray',
  'neutral',
  'red',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
  'amber',
  'purple',
  'teal',
] as const

export interface IMonorepoSourcesPresetOptions {
  packagesDir: string
}

export function createMonorepoSourcesPreset(options: IMonorepoSourcesPresetOptions) {
  const packagesDir = path.resolve(options.packagesDir)

  return defineConfig({
    importMappings: {
      packageMappings: {
        'registry:block': '@gentleduck/registry-blocks',
        'registry:example': '@gentleduck/registry-examples',
        'registry:internal': '@gentleduck/registry-internals',
        'registry:ui': '@gentleduck/registry-ui',
      },
    },
    schema: {
      itemTypes: [
        'registry:block',
        'registry:example',
        'registry:hook',
        'registry:internal',
        'registry:lib',
        'registry:page',
        'registry:ui',
      ],
    },
    sources: {
      'registry:block': {
        indexStrategy: 'item',
        packageName: '@gentleduck/registry-blocks',
        path: path.join(packagesDir, 'registry-blocks', 'src'),
        referencePath: '/registry-blocks/src',
      },
      'registry:example': {
        indexStrategy: 'file',
        packageName: '@gentleduck/registry-examples',
        path: path.join(packagesDir, 'registry-examples', 'src'),
        referencePath: '/registry-examples/src',
      },
      'registry:internal': {
        indexStrategy: 'file',
        packageName: '@gentleduck/registry-internals',
        path: path.join(packagesDir, 'registry-internals', 'src'),
        referencePath: '/registry-internals/src',
      },
      'registry:ui': {
        indexStrategy: 'item',
        packageName: '@gentleduck/registry-ui',
        path: path.join(packagesDir, 'registry-ui', 'src'),
        referencePath: '/registry-ui/src',
      },
    },
    stripVariables: ['iframeHeight', 'containerClassName', 'description'],
    targetPaths: {
      'registry:block': 'components',
      'registry:example': 'components',
      'registry:hook': 'hooks',
      'registry:internal': 'components',
      'registry:lib': 'lib',
      'registry:page': 'components',
      'registry:ui': 'components/ui',
    },
  })
}

export const monorepoRegistryPreset = defineConfig({
  registries: {
    blocks: registry.blocks,
    examples: registry.examples,
    internal: registry.internal,
    uis: registry.uis,
  },
  registrySource: 'inline',
})
