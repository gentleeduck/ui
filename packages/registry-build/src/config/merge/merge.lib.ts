import type { IRegistryBuildCollection, IRegistryBuildSource } from '../types'

/** Merge two optional string arrays, deduplicating entries. */
export function mergeUniqueStrings<T extends string = string>(left?: T[], right?: T[]) {
  return [...new Set([...(left ?? []), ...(right ?? [])])] as T[]
}

/** Shallow-merge two values that may be records or strings, with string values taking precedence. */
export function mergeRecordOrString<T extends Record<string, unknown> = Record<string, unknown>>(
  baseData?: T | string,
  nextData?: T | string,
): T | string | undefined {
  if (typeof nextData === 'string') return nextData
  if (typeof baseData === 'string') return nextData ?? baseData
  if (baseData || nextData) return { ...(baseData ?? {}), ...(nextData ?? {}) } as T
  return undefined
}

/** Deep-merge two source maps, combining ignore patterns with deduplication. */
export function mergeSources(
  baseSources?: Record<string, IRegistryBuildSource | undefined>,
  nextSources?: Record<string, IRegistryBuildSource | undefined>,
) {
  const keys = new Set<string>([...Object.keys(baseSources ?? {}), ...Object.keys(nextSources ?? {})])
  const result: Record<string, IRegistryBuildSource> = {}

  for (const key of keys) {
    const base = baseSources?.[key]
    const next = nextSources?.[key]

    if (!base && next) {
      result[key] = {
        ...next,
        ignore: next.ignore ? [...next.ignore] : undefined,
      }
      continue
    }

    if (base && !next) {
      result[key] = {
        ...base,
        ignore: base.ignore ? [...base.ignore] : undefined,
      }
      continue
    }

    if (!base || !next) {
      continue
    }

    result[key] = {
      ...base,
      ...next,
      ignore: mergeUniqueStrings(base.ignore, next.ignore),
    }
  }

  return result
}

/** Merge collection data values, treating strings as opaque references and objects as shallow-mergeable. */
export function mergeCollectionData(baseData?: unknown | string, nextData?: unknown | string) {
  if (typeof nextData === 'string') {
    return nextData
  }

  if (typeof baseData === 'string') {
    return nextData ?? baseData
  }

  if (baseData && nextData && !Array.isArray(baseData) && !Array.isArray(nextData)) {
    return {
      ...(baseData as Record<string, unknown>),
      ...(nextData as Record<string, unknown>),
    }
  }

  return nextData ?? baseData
}

/** Deep-merge two collection maps, combining their sources, metadata, and data. */
export function mergeCollections(
  baseCollections?: Record<string, IRegistryBuildCollection>,
  nextCollections?: Record<string, IRegistryBuildCollection>,
) {
  const keys = new Set([...Object.keys(baseCollections ?? {}), ...Object.keys(nextCollections ?? {})])
  const result: Record<string, IRegistryBuildCollection> = {}

  for (const key of keys) {
    const base = baseCollections?.[key]
    const next = nextCollections?.[key]

    if (!base && next) {
      result[key] = {
        ...next,
        metadata: next.metadata ? { ...next.metadata } : undefined,
        sources: next.sources ? mergeSources(undefined, next.sources) : undefined,
      }
      continue
    }

    if (base && !next) {
      result[key] = {
        ...base,
        metadata: base.metadata ? { ...base.metadata } : undefined,
        sources: base.sources ? mergeSources(base.sources, undefined) : undefined,
      }
      continue
    }

    if (!base || !next) {
      continue
    }

    result[key] = {
      ...base,
      ...next,
      data: mergeCollectionData(base.data, next.data),
      metadata: {
        ...(base.metadata ?? {}),
        ...(next.metadata ?? {}),
      },
      sources: mergeSources(base.sources, next.sources),
    }
  }

  return result
}
