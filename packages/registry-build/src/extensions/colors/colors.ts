import { runColorsPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'
import type { RegistryBuildColorsExtensionOptions } from './colors.types'

export function colorsExtension(options: RegistryBuildColorsExtensionOptions = {}): IRegistryBuildExtension {
  return {
    name: 'colors',
    run: (api) => runColorsPhase(api.context, options),
    stage: 'afterBuild',
  }
}
