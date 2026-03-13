import type { RegistryBuildSource, ResolvedRegistryBuildSource } from '../../config/types'
import type { RegistryBuildContext } from '../../pipeline/types'
import type {
  CreateUiRegistryCollectionOptions,
  UiRegistryCollection,
  UiRegistryCollectionMetadata,
} from './ui.collection.types'
import type { RegistryEntry, RegistryItemType, RegistryItemTypeMap } from './ui.registry.types'
import { registryEntryListSchema } from './ui.schema'

function deriveItemTypes<TType extends RegistryItemType>(
  entries: RegistryEntry<TType>[] | undefined,
  sources: RegistryItemTypeMap<RegistryBuildSource, TType> | undefined,
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
  options: CreateUiRegistryCollectionOptions<TType>,
): UiRegistryCollection<TType> {
  const entries = Array.isArray(options.entries) ? options.entries : undefined

  return {
    data: options.entries,
    metadata: {
      kind: 'ui-registry',
      itemTypes: deriveItemTypes(entries, options.sources, options.itemTypes),
      ...(options.metadata ?? {}),
    } satisfies UiRegistryCollectionMetadata<TType> & Record<string, unknown>,
    sources: options.sources,
  }
}

export interface LoadedUiRegistryCollection<TType extends RegistryItemType = RegistryItemType> {
  entries: RegistryEntry<TType>[]
  itemTypes: TType[]
  metadata: UiRegistryCollectionMetadata<TType> & Record<string, unknown>
  name: string
  sources: RegistryItemTypeMap<ResolvedRegistryBuildSource, TType>
}

/**
 * Resolve and validate a collection for the UI registry extensions.
 */
export function getUiRegistryCollection<TType extends RegistryItemType = RegistryItemType>(
  context: RegistryBuildContext,
  collectionName: string,
): LoadedUiRegistryCollection<TType> {
  const collection = context.config.collections[collectionName]

  if (!collection) {
    throw new Error(`Collection "${collectionName}" was not found in the registry build config.`)
  }

  const metadata = (collection.metadata ?? {}) as Partial<UiRegistryCollectionMetadata<TType>> & Record<string, unknown>
  if (metadata.kind !== 'ui-registry') {
    throw new Error(
      `Collection "${collectionName}" is not a UI registry collection. Expected metadata.kind to be "ui-registry".`,
    )
  }

  const entries = registryEntryListSchema.parse(collection.data ?? [])
  const itemTypes = deriveItemTypes(
    entries as RegistryEntry<TType>[],
    collection.sources as RegistryItemTypeMap<RegistryBuildSource, TType> | undefined,
    metadata.itemTypes as TType[] | undefined,
  )

  return {
    entries: entries as RegistryEntry<TType>[],
    itemTypes,
    metadata: {
      ...metadata,
      itemTypes,
      kind: 'ui-registry',
    } as UiRegistryCollectionMetadata<TType> & Record<string, unknown>,
    name: collectionName,
    sources: collection.sources as RegistryItemTypeMap<ResolvedRegistryBuildSource, TType>,
  }
}
