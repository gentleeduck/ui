import type { RegistryBuildComponentIndex } from '../../../extensions/ui/ui.config.types'
import type { RegistryItemType, RegistryItemTypeMap } from '../../../extensions/ui/ui.registry.types'

export interface RegistryBuildComponentIndexPhaseOptions<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildComponentIndex<TType> {
  packageMappings?: RegistryItemTypeMap<string, TType>
}

export interface RegistryBuildComponentIndexCacheState {
  outputFiles: string[]
  signature: string
}
