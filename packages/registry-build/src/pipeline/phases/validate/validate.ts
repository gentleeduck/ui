import path from 'node:path'
import type { IRegistryBuildSource } from '../../../config/types'
import type { RegistryItemType } from '../../../extensions/ui/ui.registry.types'
import { pathExists } from '../../../lib/fs'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'

/**
 * Validate the legacy UI-registry surface used by the built-in phases.
 */
export async function runValidatePhase(context: IRegistryBuildContext): Promise<IRegistryBuildPhaseResult> {
  const issues: string[] = []
  const itemTypes = context.config.schema.itemTypes
  const seenNames = new Map<string, string>()

  if (new Set(itemTypes).size !== itemTypes.length) {
    issues.push('`schema.itemTypes` contains duplicate values.')
  }

  for (const [type, source] of Object.entries(context.config.sources) as Array<
    [RegistryItemType, IRegistryBuildSource]
  >) {
    if (!(await pathExists(source.path))) {
      issues.push(`Source path does not exist for "${type}": ${source.path}`)
    }
  }

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

      const entryRoot = path.join(source.path, entry.root_folder)

      if (!(await pathExists(entryRoot))) {
        issues.push(`Entry "${entry.name}" points to a missing source folder: ${entryRoot}`)
      }
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
