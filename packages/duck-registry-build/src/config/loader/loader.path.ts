import path from 'node:path'

export function resolveFrom(baseDir: string, targetPath: string) {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(baseDir, targetPath)
}
