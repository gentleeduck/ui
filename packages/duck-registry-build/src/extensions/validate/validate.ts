import { runValidatePhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'

export function validateExtension(): IRegistryBuildExtension {
  return {
    name: 'validate',
    run: (api) => runValidatePhase(api.context),
    stage: 'beforeBuild',
  }
}
