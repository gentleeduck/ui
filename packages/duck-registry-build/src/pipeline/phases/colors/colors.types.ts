import type {
  IRegistryBuildColorsConfig,
  IRegistryBuildCssTemplates,
  IRegistryBuildThemesConfig,
} from '../../../extensions/ui/ui.config.types'

export interface IRegistryBuildColorsPhaseOptions {
  colors?: IRegistryBuildColorsConfig
  cssTemplates?: IRegistryBuildCssTemplates
  themes?: IRegistryBuildThemesConfig
}

export interface IRegistryBuildColorsCacheState {
  outputFiles: string[]
  signature: string
}
