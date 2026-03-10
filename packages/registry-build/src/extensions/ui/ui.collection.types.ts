import type { RegistryBuildCollection, RegistryBuildSource } from '../../config/types'
import type { RegistryEntry, RegistryItemType, RegistryItemTypeMap } from './ui.registry.types'

/**
 * Collection types that adapt the generic collections model to the UI registry
 * shape expected by the built-in extensions.
 */
export interface UiRegistryCollectionMetadata<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
  kind: 'ui-registry'
}

export interface CreateUiRegistryCollectionOptions<TType extends RegistryItemType = RegistryItemType> {
  entries: RegistryEntry<TType>[] | string
  itemTypes?: TType[]
  metadata?: Record<string, unknown>
  sources?: RegistryItemTypeMap<RegistryBuildSource, TType>
}

export interface UiRegistryCollection<TType extends RegistryItemType = RegistryItemType>
  extends Omit<RegistryBuildCollection, 'sources'> {
  data?: RegistryEntry<TType>[] | string
  metadata?: UiRegistryCollectionMetadata<TType> & Record<string, unknown>
  sources?: RegistryItemTypeMap<RegistryBuildSource, TType>
}
