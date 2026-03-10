import path from 'node:path'
import type { RegistryItemFile, RegistryItemType } from '../types'
import { normalizeSlashes } from '../lib/path'
import type { RegistryBuildContext } from './types'

interface RegistryBuildEntryLike {
  files?: Array<Pick<RegistryItemFile, 'path'>>
  name: string
  root_folder: string
  type: RegistryItemType
}

export function createRegistryEntryCacheKey(entry: RegistryBuildEntryLike) {
  return `${entry.type}:${normalizeSlashes(entry.root_folder)}:${entry.name}`
}

function getRegistryEntryPaths(context: RegistryBuildContext, entry: RegistryBuildEntryLike) {
  const source = context.config.sources[entry.type]

  if (!source) {
    return []
  }

  if ((entry.files?.length ?? 0) > 0) {
    return entry.files!.map((file) => normalizeSlashes(path.join(source.path, file.path)))
  }

  return [normalizeSlashes(path.join(source.path, entry.root_folder))]
}

export function isRegistryEntryAffectedByChangedPaths(context: RegistryBuildContext, entry: RegistryBuildEntryLike) {
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
        changedPath === entryPath ||
        changedPath.startsWith(`${entryPath}/`) ||
        entryPath.startsWith(`${changedPath}/`)
      )
    })
  })
}
