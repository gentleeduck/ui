import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registry_colors, themeRegistry } from '@gentleduck/registers'
import {
  MONOREPO_THEME_CSS_VAR_KEYS,
  MONOREPO_THEME_NAMES,
  bannerExtension,
  colorsExtension,
  componentIndexExtension,
  createMonorepoSourcesPreset,
  defineConfig,
  mergeRegistryBuildConfigs,
  monorepoRegistryPreset,
  validateExtension,
} from '@gentleduck/registry-build'

const packagesDir = fileURLToPath(new URL('../../packages', import.meta.url))
const monorepoPreset = mergeRegistryBuildConfigs(
  monorepoRegistryPreset,
  createMonorepoSourcesPreset({
    packagesDir: path.resolve(packagesDir),
  }),
)

export default defineConfig(mergeRegistryBuildConfigs(monorepoPreset, {
  extensions: [
    bannerExtension({
      name: 'Duck UI',
    }),
    validateExtension(),
    componentIndexExtension({
      excludeTypes: ['registry:ui', 'registry:lib', 'registry:hook'],
    }),
    colorsExtension({
      colors: {
        data: registry_colors,
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
}))
