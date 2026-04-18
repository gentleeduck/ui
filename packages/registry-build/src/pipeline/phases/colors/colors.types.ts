import type {
  IRegistryBuildColorsConfig,
  IRegistryBuildCssTemplates,
  IRegistryBuildThemesConfig,
} from '../../../extensions/ui/ui.config.types'

/**
 * Optional overrides accepted by the built-in colors extension.
 */
export interface IRegistryBuildColorsPhaseOptions {
  colors?: IRegistryBuildColorsConfig
  cssTemplates?: IRegistryBuildCssTemplates
  themes?: IRegistryBuildThemesConfig
}

/**
 * Cache state for the colors phase.
 */
export interface IRegistryBuildColorsCacheState {
  outputFiles: string[]
  signature: string
}
