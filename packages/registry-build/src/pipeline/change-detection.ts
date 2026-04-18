import path from 'node:path'
import type { IRegistryItemFile, RegistryItemType } from '../extensions/ui/ui.registry.types'
import { normalizeSlashes } from '../lib/path'
import type { IRegistryBuildContext } from './types'

interface IRegistryBuildEntryLike {
  files?: Array<Pick<IRegistryItemFile, 'path'>>
  name: string
  root_folder: string
  type: RegistryItemType
}

/** Build a deterministic cache key for a registry entry based on its type, folder, and name. */
export function createRegistryEntryCacheKey(entry: IRegistryBuildEntryLike) {
  return `${entry.type}:${normalizeSlashes(entry.root_folder)}:${entry.name}`
}

function getRegistryEntryPaths(context: IRegistryBuildContext, entry: IRegistryBuildEntryLike) {
  const source = context.config.sources[entry.type]

  if (!source) {
    return []
  }

  if ((entry.files?.length ?? 0) > 0) {
    return entry.files?.map((file) => normalizeSlashes(path.join(source.path, file.path))) ?? []
  }

  return [normalizeSlashes(path.join(source.path, entry.root_folder))]
}

/**
 * Changed-only mode still falls back to rebuilding when the entry cannot be
 * mapped back to one or more source paths.
 */
export function isRegistryEntryAffectedByChangedPaths(context: IRegistryBuildContext, entry: IRegistryBuildEntryLike) {
  if (!context.changedOnly || context.changedPaths.length === 0) {
    return true
  }

  const entryPaths = getRegistryEntryPaths(context, entry)

  if (entryPaths.length === 0) {
    return true
  }

  return context.changedPaths.some((changedPath) => {
    return entryPaths.some((entryPath) => {
      return (
        changedPath === entryPath || changedPath.startsWith(`${entryPath}/`) || entryPath.startsWith(`${changedPath}/`)
      )
    })
  })
}
