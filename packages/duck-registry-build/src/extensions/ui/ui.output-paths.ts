import path from 'node:path'
import type { IRegistryBuildContext } from '../../pipeline/types'

export function resolveOutputPath(context: IRegistryBuildContext, relativePath: string) {
  return path.join(context.outputPaths.baseDir, relativePath)
}
