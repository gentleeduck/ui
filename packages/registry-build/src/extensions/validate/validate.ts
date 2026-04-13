import { runValidatePhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'

/** Extension that validates source paths and registry entries before the build. */
export function validateExtension(): IRegistryBuildExtension {
  return {
    name: 'validate',
    run: (api) => runValidatePhase(api.context),
    stage: 'beforeBuild',
  }
}
