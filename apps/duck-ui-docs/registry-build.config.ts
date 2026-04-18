import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registryColors, themeRegistry } from '@gentleduck/registers'
import {
  bannerExtension,
  colorsExtension,
  componentIndexExtension,
  componentsExtension,
  defineConfig,
  indexBuildExtension,
  mergeRegistryBuildConfigs,
  validateExtension,
} from '@gentleduck/registry-build'
import {
  createMonorepoSourcesPreset,
  MONOREPO_THEME_CSS_VAR_KEYS,
  MONOREPO_THEME_NAMES,
  monorepoRegistryPreset,
} from './registry-build.presets'

const packagesDir = fileURLToPath(new URL('../../packages', import.meta.url))
const monorepoPreset = mergeRegistryBuildConfigs(
  monorepoRegistryPreset,
  createMonorepoSourcesPreset({
    packagesDir: path.resolve(packagesDir),
  }),
)

export default defineConfig(
  mergeRegistryBuildConfigs(monorepoPreset, {
    extensions: [
      bannerExtension({
        name: 'Duck UI',
      }),
      validateExtension(),
      indexBuildExtension(),
      componentsExtension(),
      componentIndexExtension({
        excludeTypes: ['registry:ui', 'registry:lib', 'registry:hook'],
      }),
      colorsExtension({
        colors: {
          data: registryColors,
        },
        themes: {
          cssVarKeys: [...MONOREPO_THEME_CSS_VAR_KEYS],
          data: themeRegistry,
          names: [...MONOREPO_THEME_NAMES],
        },
      }),
    ],
    output: {
      dir: '.',
    },
  }),
)
