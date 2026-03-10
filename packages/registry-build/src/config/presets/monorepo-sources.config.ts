import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '../../define-config'

const presetDir = path.dirname(fileURLToPath(import.meta.url))

export interface MonorepoSourcesPresetOptions {
  packagesDir: string
}

function resolvePackagesDir(packagesDir: string) {
  return path.resolve(packagesDir)
}

export function createMonorepoSourcesPreset(options: MonorepoSourcesPresetOptions) {
  const packagesDir = resolvePackagesDir(options.packagesDir)

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

export const monorepoSourcesPreset = createMonorepoSourcesPreset({
  packagesDir: path.resolve(presetDir, '../../../..'),
})

export default monorepoSourcesPreset
