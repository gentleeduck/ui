import type { IRegistryBuildComponentIndex } from '../../../extensions/ui/ui.config.types'
import type { RegistryItemType, RegistryItemTypeMap } from '../../../extensions/ui/ui.registry.types'

export interface IRegistryBuildComponentIndexPhaseOptions<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildComponentIndex<TType> {
  packageMappings?: RegistryItemTypeMap<string, TType>
}

export interface IRegistryBuildComponentIndexCacheState {
  outputFiles: string[]
  signature: string
}
