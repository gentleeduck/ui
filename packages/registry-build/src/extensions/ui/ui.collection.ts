import type { IRegistryBuildSource, IResolvedRegistryBuildSource } from '../../config/types'
import type { IRegistryBuildContext } from '../../pipeline/types'
import type {
  ICreateUiRegistryCollectionOptions,
  IUiRegistryCollection,
  IUiRegistryCollectionMetadata,
} from './ui.collection.types'
import type { IRegistryEntry, RegistryItemType, RegistryItemTypeMap } from './ui.registry.types'
import { registryEntryListSchema } from './ui.schema'

function deriveItemTypes<TType extends RegistryItemType>(
  entries: IRegistryEntry<TType>[] | undefined,
  sources: RegistryItemTypeMap<IRegistryBuildSource, TType> | undefined,
  itemTypes: TType[] | undefined,
) {
  return [
    ...new Set<TType>([
      ...(itemTypes ?? []),
      ...((entries?.map((entry) => entry.type) ?? []) as TType[]),
      ...(Object.keys(sources ?? {}) as TType[]),
    ]),
  ].sort((left, right) => left.localeCompare(right))
}

/**
 * Build a collection definition for the UI registry extensions.
 */
export function createUiRegistryCollection<TType extends RegistryItemType = RegistryItemType>(
  options: ICreateUiRegistryCollectionOptions<TType>,
): IUiRegistryCollection<TType> {
  const entries = Array.isArray(options.entries) ? options.entries : undefined

  return {
    data: options.entries,
    metadata: {
      kind: 'ui-registry',
      itemTypes: deriveItemTypes(entries, options.sources, options.itemTypes),
      ...(options.metadata ?? {}),
    } satisfies IUiRegistryCollectionMetadata<TType> & Record<string, unknown>,
    sources: options.sources,
  }
}

export interface ILoadedUiRegistryCollection<TType extends RegistryItemType = RegistryItemType> {
  entries: IRegistryEntry<TType>[]
  itemTypes: TType[]
  metadata: IUiRegistryCollectionMetadata<TType> & Record<string, unknown>
  name: string
  sources: RegistryItemTypeMap<IResolvedRegistryBuildSource, TType>
}

/**
 * Resolve and validate a collection for the UI registry extensions.
 */
export function getUiRegistryCollection<TType extends RegistryItemType = RegistryItemType>(
  context: IRegistryBuildContext,
  collectionName: string,
): ILoadedUiRegistryCollection<TType> {
  const collection = context.config.collections[collectionName]

  if (!collection) {
    throw new Error(`Collection "${collectionName}" was not found in the registry build config.`)
  }

  const metadata = (collection.metadata ?? {}) as Partial<IUiRegistryCollectionMetadata<TType>> & Record<string, unknown>
  if (metadata.kind !== 'ui-registry') {
    throw new Error(
      `Collection "${collectionName}" is not a UI registry collection. Expected metadata.kind to be "ui-registry".`,
    )
  }

  const entries = registryEntryListSchema.parse(collection.data ?? [])
  const itemTypes = deriveItemTypes(
    entries as IRegistryEntry<TType>[],
    collection.sources as RegistryItemTypeMap<IRegistryBuildSource, TType> | undefined,
    metadata.itemTypes as TType[] | undefined,
  )

  return {
    entries: entries as IRegistryEntry<TType>[],
    itemTypes,
    metadata: {
      ...metadata,
      itemTypes,
      kind: 'ui-registry',
    } as IUiRegistryCollectionMetadata<TType> & Record<string, unknown>,
    name: collectionName,
    sources: collection.sources as RegistryItemTypeMap<IResolvedRegistryBuildSource, TType>,
  }
}
