import type { IRegistryBuildThemeEntry } from '../../extensions/ui/ui.config.types'
import type { RegistryItemType, RegistryItemTypeMap } from '../../extensions/ui/ui.registry.types'
import { DEFAULT_SOURCE_GLOB, DEFAULT_SOURCE_IGNORE, DEFAULT_SOURCE_INDEX_STRATEGY } from '../defaults'
import { resolveFrom } from '../loader/loader.path'
import type {
  IRegistryBuildCollection,
  IRegistryBuildConfig,
  IRegistryBuildSource,
  IResolvedRegistryBuildCollection,
  IResolvedRegistryBuildSource,
} from '../types'

// Union of item types declared anywhere in the config (sources, targetPaths,
// packageMappings, componentIndex.excludeTypes, schema.itemTypes).
export function deriveDeclaredItemTypes(config: IRegistryBuildConfig): RegistryItemType[] {
  return [
    ...new Set<RegistryItemType>([
      ...((config.schema?.itemTypes ?? []) as RegistryItemType[]),
      ...(Object.keys(config.sources ?? {}) as RegistryItemType[]),
      ...(Object.keys(config.targetPaths ?? {}) as RegistryItemType[]),
      ...(Object.keys(config.importMappings?.packageMappings ?? {}) as RegistryItemType[]),
      ...((config.componentIndex?.excludeTypes ?? []) as RegistryItemType[]),
    ]),
  ].sort()
}

/**
 * Materialize compatibility collections from the legacy top-level `registries`
 * field so newer collection-aware tooling can still inspect them.
 */
export function deriveLegacyCollections(config: IRegistryBuildConfig): Record<string, IRegistryBuildCollection> {
  return Object.fromEntries(
    Object.entries(config.registries ?? {}).map(([name, entries]) => {
      const itemTypes = [...new Set(entries.map((entry) => entry.type))].sort((left, right) =>
        left.localeCompare(right),
      )
      const sources = Object.fromEntries(
        itemTypes.flatMap((itemType) => {
          const source = config.sources?.[itemType]
          return source ? [[itemType, source]] : []
        }),
      )

      return [
        name,
        {
          data: entries,
          metadata: {
            compatibility: 'legacy-registries',
            kind: 'ui-registry',
            itemTypes,
          },
          sources,
        } satisfies IRegistryBuildCollection,
      ] as const
    }),
  )
}

export function deriveThemeCssVarKeys(themes: Record<string, IRegistryBuildThemeEntry>) {
  return [
    ...new Set(
      Object.values(themes).flatMap((entry) => [...Object.keys(entry.light ?? {}), ...Object.keys(entry.dark ?? {})]),
    ),
  ].sort()
}

export function resolveCollectionSources(configDir: string, collections: Record<string, IRegistryBuildCollection>) {
  return Object.fromEntries(
    Object.entries(collections).map(([name, collection]) => [
      name,
      {
        ...collection,
        data: typeof collection.data === 'string' ? undefined : collection.data,
        metadata: collection.metadata ?? {},
        sources: Object.fromEntries(
          Object.entries(collection.sources ?? {}).map(([sourceName, source]) => [
            sourceName,
            {
              ...source,
              glob: source.glob ?? DEFAULT_SOURCE_GLOB,
              ignore: [...new Set([...DEFAULT_SOURCE_IGNORE, ...(source.ignore ?? [])])],
              indexStrategy: source.indexStrategy ?? DEFAULT_SOURCE_INDEX_STRATEGY,
              path: resolveFrom(configDir, source.path),
            },
          ]),
        ),
      },
    ]),
  ) as Record<string, IResolvedRegistryBuildCollection>
}

export function resolveSources(configDir: string, sources: RegistryItemTypeMap<IRegistryBuildSource>) {
  const sourceEntries = Object.entries(sources).filter((entry): entry is [string, IRegistryBuildSource] => {
    return typeof entry[1] === 'object' && entry[1] !== null
  })

  return Object.fromEntries(
    sourceEntries.map(([type, source]) => [
      type,
      {
        ...source,
        glob: source.glob ?? DEFAULT_SOURCE_GLOB,
        ignore: [...new Set([...DEFAULT_SOURCE_IGNORE, ...(source.ignore ?? [])])],
        indexStrategy: source.indexStrategy ?? DEFAULT_SOURCE_INDEX_STRATEGY,
        path: resolveFrom(configDir, source.path),
      },
    ]),
  ) as RegistryItemTypeMap<IResolvedRegistryBuildSource>
}
