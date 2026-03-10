import { runValidatePhase } from '../pipeline/phases'
import type { RegistryBuildExtension } from './types'

export function validateExtension(): RegistryBuildExtension {
  return {
    name: 'validate',
    run: (api) => runValidatePhase(api.context),
    stage: 'beforeBuild',
  }
}
