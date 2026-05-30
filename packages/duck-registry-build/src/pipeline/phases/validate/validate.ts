import path from 'node:path'
import type { IRegistryBuildSource } from '../../../config/types'
import type { RegistryItemType } from '../../../extensions/ui/ui.registry.types'
import { pathExists } from '../../../lib/fs'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'

export async function runValidatePhase(context: IRegistryBuildContext): Promise<IRegistryBuildPhaseResult> {
  const issues: string[] = []
  const itemTypes = context.config.schema.itemTypes
  const seenNames = new Map<string, string>()

  if (new Set(itemTypes).size !== itemTypes.length) {
    issues.push('`schema.itemTypes` contains duplicate values.')
  }

  // Parallelize all source-path existence checks (N sources → 1 stat batch instead of N serial stats).
  const sourceEntries = Object.entries(context.config.sources) as Array<[RegistryItemType, IRegistryBuildSource]>
  const sourceExistence = await Promise.all(sourceEntries.map(([, source]) => pathExists(source.path)))
  for (let i = 0; i < sourceEntries.length; i += 1) {
    if (!sourceExistence[i]) {
      const [type, source] = sourceEntries[i] as [RegistryItemType, IRegistryBuildSource]
      issues.push(`Source path does not exist for "${type}": ${source.path}`)
    }
  }

  // Walk every registry entry once, collecting non-IO checks inline and the IO-bound
  // root-folder existence checks into a single batch we resolve in parallel below.
  interface IRootFolderCheck {
    entryRoot: string
    entryName: string
  }
  const rootFolderChecks: IRootFolderCheck[] = []
  let totalItems = 0

  for (const [category, entries] of Object.entries(context.config.registries)) {
    for (const entry of entries) {
      totalItems += 1

      if (!itemTypes.includes(entry.type)) {
        issues.push(`Entry "${entry.name}" in "${category}" uses unknown item type "${entry.type}".`)
      }

      const previousOwner = seenNames.get(entry.name)
      if (previousOwner) {
        issues.push(`Duplicate registry entry name "${entry.name}" found in "${previousOwner}" and "${category}".`)
      } else {
        seenNames.set(entry.name, category)
      }

      const source = context.config.sources[entry.type]
      const hasInlineFiles = (entry.files?.length ?? 0) > 0

      if (!source && !hasInlineFiles) {
        issues.push(`Entry "${entry.name}" requires a source for type "${entry.type}" because no files were provided.`)
        continue
      }

      if (!source || hasInlineFiles) {
        continue
      }

      rootFolderChecks.push({
        entryName: entry.name,
        entryRoot: path.join(source.path, entry.root_folder),
      })
    }
  }

  const rootFolderExistence = await Promise.all(rootFolderChecks.map((check) => pathExists(check.entryRoot)))
  for (let i = 0; i < rootFolderChecks.length; i += 1) {
    if (!rootFolderExistence[i]) {
      const check = rootFolderChecks[i] as IRootFolderCheck
      issues.push(`Entry "${check.entryName}" points to a missing source folder: ${check.entryRoot}`)
    }
  }

  if (issues.length > 0) {
    throw new Error(`Registry build validation failed:\n- ${issues.join('\n- ')}`)
  }

  return {
    itemCount: totalItems,
    name: 'validate',
  }
}
