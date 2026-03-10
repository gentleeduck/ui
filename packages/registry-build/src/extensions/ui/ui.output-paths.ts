import path from 'node:path'
import type { RegistryBuildContext } from '../../pipeline/types'

/**
 * Resolve an extension-owned output path relative to the build output root.
 */
export function resolveOutputPath(context: RegistryBuildContext, relativePath: string) {
  return path.join(context.outputPaths.baseDir, relativePath)
}
