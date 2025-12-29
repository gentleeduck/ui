import path from 'node:path'

// 🦆 Common path helpers shared by duck-gen extensions.
export function isNodeModulesFile(filePath: string): boolean {
  return filePath.includes(`${path.sep}node_modules${path.sep}`)
}

export function isTsLibFile(filePath: string): boolean {
  return /[\\\/]typescript[\\\/]lib[\\\/].*\.d\.ts$/.test(filePath)
}

export function relImport(fromFile: string, toFile: string): string {
  const rel = path
    .relative(path.dirname(fromFile), toFile)
    .replace(/\\/g, '/')
    .replace(/\.(ts|tsx|d\.ts)$/, '')
  return rel.startsWith('.') ? rel : './' + rel
}

export function formatPropKey(key: string): string {
  // 🦆 allow identifier form when possible, otherwise quote it
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return key
  return `'${key.replace(/'/g, "\\'")}'`
}
