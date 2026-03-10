import path from 'node:path'
import type { RegistryBuildConfig, RegistryEntry, RegistryItemFile } from '../types'
import { joinPosix } from './path'

export function getRegistryFileTarget(
  file: RegistryItemFile,
  item: RegistryEntry,
  config: Pick<RegistryBuildConfig, 'targetPaths'>,
) {
  if (file.target?.trim()) {
    return file.target
  }

  const baseDir = config.targetPaths?.[item.type] ?? 'components'
  const fileName = path.posix.basename(file.path.replaceAll('\\', '/'))

  return joinPosix(baseDir, fileName)
}
