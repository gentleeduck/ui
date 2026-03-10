import { runValidatePhase } from '../../pipeline/phases'
import type { RegistryBuildExtension } from '../extension'

/** Extension that validates source paths and registry entries before the build. */
export function validateExtension(): RegistryBuildExtension {
  return {
    name: 'validate',
    run: (api) => runValidatePhase(api.context),
    stage: 'beforeBuild',
  }
}
