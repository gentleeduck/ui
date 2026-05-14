import path from 'node:path'

export function isNodeModulesFile(filePath: string): boolean {
  return filePath.includes(`${path.sep}node_modules${path.sep}`)
}

/** Matches `dist/`, `generated/`, and `.turbo/` so scanner skips build output and turbo cache. */
export function isGeneratedOutputPath(filePath: string): boolean {
  return (
    filePath.includes(`${path.sep}dist${path.sep}`) ||
    filePath.includes(`${path.sep}generated${path.sep}`) ||
    filePath.includes(`${path.sep}.turbo${path.sep}`)
  )
}

export function isTsLibFile(filePath: string): boolean {
  return /[\\/]typescript[\\/]lib[\\/].*\.d\.ts$/.test(filePath)
}

export function relImport(fromFile: string, toFile: string): string {
  const rel = path
    .relative(path.dirname(fromFile), toFile)
    .replace(/\\/g, '/')
    .replace(/\.(d\.ts|ts|tsx)$/, '')
  return rel.startsWith('.') ? rel : `./${rel}`
}

/** Emits a bare identifier when possible, falling back to a single-quoted, escape-aware string literal. */
export function formatPropKey(key: string): string {
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return key
  return `'${key.replace(/'/g, "\\'")}'`
}

export function sortMap<T>(m: Map<string, Set<T>>) {
  return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}

/** Strips `import("…").` qualifiers that TypeScript's type printer injects into emitted text. */
export function sanitizeTypeText(text: string): string {
  return text.replace(/import\("[^"]*"\)\./g, '')
}

/** Builds a compact JSDoc block prefixed with the duck marker so generated types are easy to spot. */
export function doc(lines: string[]): string {
  return ['/** 🦆', ...lines.map((l) => ` * 🦆 ${l}`), ' */', ''].join('\n')
}
