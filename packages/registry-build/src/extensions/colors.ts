import { runColorsPhase } from '../pipeline/phases'
import type { RegistryBuildColorsConfig, RegistryBuildCssTemplates, RegistryBuildThemesConfig } from '../types'
import type { RegistryBuildExtension } from './types'

export interface RegistryBuildColorsExtensionOptions {
  colors?: RegistryBuildColorsConfig
  cssTemplates?: RegistryBuildCssTemplates
  themes?: RegistryBuildThemesConfig
}

export function colorsExtension(options: RegistryBuildColorsExtensionOptions = {}): RegistryBuildExtension {
  return {
    name: 'colors',
    run: (api) => runColorsPhase(api.context, options),
    stage: 'afterBuild',
  }
}
