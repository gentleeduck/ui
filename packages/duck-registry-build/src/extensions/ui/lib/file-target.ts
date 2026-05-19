import path from 'node:path'
import { joinPosix } from '../../../lib/path'
import type { IRegistryEntry, IRegistryItemFile, RegistryItemTypeMap } from '../ui.registry.types'

export function getRegistryFileTarget(
  file: IRegistryItemFile,
  item: IRegistryEntry,
  targetPaths: RegistryItemTypeMap<string>,
) {
  if (file.target?.trim()) {
    return file.target
  }

  const baseDir = targetPaths?.[item.type] ?? 'components'
  const fileName = path.posix.basename(file.path.replaceAll('\\', '/'))

  return joinPosix(baseDir, fileName)
}
