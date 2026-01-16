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
    .replace(/\.(d\.ts|ts|tsx)$/, '')
  return rel.startsWith('.') ? rel : './' + rel
}

export function formatPropKey(key: string): string {
  // 🦆 allow identifier form when possible, otherwise quote it
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return key
  return `'${key.replace(/'/g, "\\'")}'`
}

export function sortMap<T>(m: Map<string, Set<T>>) {
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}

/** 🦆
 * 🦆 Builds a compact JSDoc block (kept short on purpose).
 * 🦆 Use this for hover docs without spamming repetitive examples.
 */
export function doc(lines: string[]): string {
  return ['/** 🦆', ...lines.map((l) => ` * 🦆 ${l}`), ' */', ''].join('\n')
}
