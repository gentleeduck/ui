import fs from 'node:fs'
import path from 'node:path'

/**
 * Resolves an untrusted, registry-supplied relative path against a trusted base directory,
 * guaranteeing the result stays inside `baseDir`.
 *
 * Rejects absolute paths and any `..` traversal segment, then asserts the resolved path is
 * contained within `baseDir`. The base is canonicalised with realpath when it exists so a
 * pre-existing in-tree symlink cannot redirect the write outside the project. Throws a
 * clear error on any violation.
 */
export function resolveWithinBase(baseDir: string, untrustedRelative: string): string {
  if (typeof untrustedRelative !== 'string' || untrustedRelative.length === 0) {
    throw new Error('Refusing to write: empty or invalid path supplied by registry.')
  }

  if (path.isAbsolute(untrustedRelative)) {
    throw new Error(`Refusing to write outside the project: absolute path "${untrustedRelative}" is not allowed.`)
  }

  const normalized = path.normalize(untrustedRelative)
  const segments = normalized.split(/[\\/]+/)
  if (segments.some((s) => s === '..')) {
    throw new Error(`Refusing to write outside the project: path "${untrustedRelative}" contains ".." traversal.`)
  }

  let base = path.resolve(baseDir)
  try {
    base = fs.realpathSync(base)
  } catch {
    // Base does not exist yet — fall back to the resolved (non-canonical) path.
  }
  const resolved = path.resolve(base, normalized)

  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error(`Refusing to write outside the project: path "${untrustedRelative}" escapes "${base}".`)
  }

  return resolved
}
