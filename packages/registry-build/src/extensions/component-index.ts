import type { RegistryBuildComponentIndexPhaseOptions } from '../pipeline/phases'
import { runComponentIndexPhase } from '../pipeline/phases'
import type { RegistryBuildComponentIndex, RegistryItemType, RegistryItemTypeMap } from '../types'
import type { RegistryBuildExtension } from './types'

export interface RegistryBuildComponentIndexExtensionOptions<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildComponentIndex<TType> {
  packageMappings?: RegistryItemTypeMap<string, TType>
}

export function componentIndexExtension<TType extends RegistryItemType = RegistryItemType>(
  options: RegistryBuildComponentIndexExtensionOptions<TType> = {},
): RegistryBuildExtension {
  return {
    name: 'componentIndex',
    run: (api) => runComponentIndexPhase(api.context, options as RegistryBuildComponentIndexPhaseOptions),
    stage: 'afterBuild',
  }
}
