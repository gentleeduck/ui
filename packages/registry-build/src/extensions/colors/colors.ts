import { runColorsPhase } from '../../pipeline/phases'
import type { RegistryBuildExtension } from '../extension'
import type { RegistryBuildColorsExtensionOptions } from './colors.types'

export function colorsExtension(options: RegistryBuildColorsExtensionOptions = {}): RegistryBuildExtension {
  return {
    name: 'colors',
    run: (api) => runColorsPhase(api.context, options),
    stage: 'afterBuild',
  }
}
