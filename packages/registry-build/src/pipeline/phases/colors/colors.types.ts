import type {
  RegistryBuildColorsConfig,
  RegistryBuildCssTemplates,
  RegistryBuildThemesConfig,
} from '../../../extensions/ui/ui.config.types'

/**
 * Optional overrides accepted by the built-in colors extension.
 */
export interface RegistryBuildColorsPhaseOptions {
  colors?: RegistryBuildColorsConfig
  cssTemplates?: RegistryBuildCssTemplates
  themes?: RegistryBuildThemesConfig
}

/**
 * Cache state for the colors phase.
 */
export interface RegistryBuildColorsCacheState {
  outputFiles: string[]
  signature: string
}
