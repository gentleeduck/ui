import type { IRegistryBuildCollection, IRegistryBuildSource } from '../../config/types'
import type { IRegistryEntry, RegistryItemType, RegistryItemTypeMap } from './ui.registry.types'

export interface IUiRegistryCollectionMetadata<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
  kind: 'ui-registry'
}

export interface ICreateUiRegistryCollectionOptions<TType extends RegistryItemType = RegistryItemType> {
  entries: IRegistryEntry<TType>[] | string
  itemTypes?: TType[]
  metadata?: Record<string, unknown>
  sources?: RegistryItemTypeMap<IRegistryBuildSource, TType>
}

export interface IUiRegistryCollection<TType extends RegistryItemType = RegistryItemType>
  extends Omit<IRegistryBuildCollection, 'sources'> {
  data?: IRegistryEntry<TType>[] | string
  metadata?: IUiRegistryCollectionMetadata<TType> & Record<string, unknown>
  sources?: RegistryItemTypeMap<IRegistryBuildSource, TType>
}
