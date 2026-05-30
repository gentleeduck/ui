import fs from 'node:fs'
import path from 'node:path'

// Path component charset for user-supplied identifiers (entry/theme names).
// Letters, digits, dot, underscore, hyphen. Excludes slash, backslash, shell metacharacters, control chars.
const SAFE_NAME_PATTERN = /^[a-zA-Z0-9._-]+$/

// Relative path charset: same as names plus forward slash. Backslashes are normalized upstream.
const SAFE_RELATIVE_PATH_PATTERN = /^[a-zA-Z0-9._/-]+$/

// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional — detecting control chars in untrusted paths is the point
const CONTROL_CHARS_PATTERN = /[\x00-\x1f\x7f]/

/**
 * Reject identifiers (entry name, theme name) that would escape a parent dir or
 * inject characters into generated paths or CSS selectors. Throws on violation.
 */
export function assertSafeName(value: string, label = 'name'): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid ${label}: must be a non-empty string.`)
  }

  if (CONTROL_CHARS_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: contains control characters.`)
  }

  if (!SAFE_NAME_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: "${value}" — only letters, digits, dot, underscore, and hyphen are allowed.`)
  }

  if (value === '.' || value === '..') {
    throw new Error(`Invalid ${label}: "${value}" is a traversal segment.`)
  }

  return value
}

/**
 * Reject relative paths supplied by the registry that would escape their base
 * dir at build time. Throws on absolute path, `..` segment, control char, or
 * any character outside the allowlist.
 */
export function assertSafeRelativePath(value: string, label = 'path'): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid ${label}: must be a non-empty string.`)
  }

  if (CONTROL_CHARS_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: contains control characters.`)
  }

  if (path.isAbsolute(value)) {
    throw new Error(`Invalid ${label}: "${value}" is absolute; expected a path relative to the source root.`)
  }

  const normalized = value.replaceAll('\\', '/')

  if (!SAFE_RELATIVE_PATH_PATTERN.test(normalized)) {
    throw new Error(
      `Invalid ${label}: "${value}" — only letters, digits, dot, underscore, hyphen, and forward slash are allowed.`,
    )
  }

  const segments = normalized.split('/')
  if (segments.some((segment) => segment === '..')) {
    throw new Error(`Invalid ${label}: "${value}" contains a ".." traversal segment.`)
  }

  return value
}

/**
 * Resolve an untrusted relative path against a trusted base dir, guaranteeing
 * the result stays inside `baseDir`. Canonicalises base with realpath when it
 * exists so an in-tree symlink cannot redirect the resolved path outside the
 * project. Throws on absolute paths, `..` traversal, or any containment escape.
 */
export function resolveWithinBase(baseDir: string, untrustedRelative: string, label = 'path'): string {
  assertSafeRelativePath(untrustedRelative, label)

  let base = path.resolve(baseDir)
  try {
    base = fs.realpathSync(base)
  } catch {
    // Base does not exist yet — fall back to the resolved (non-canonical) path.
  }

  const resolved = path.resolve(base, untrustedRelative)

  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error(`Refusing ${label} "${untrustedRelative}": escapes "${base}".`)
  }

  return resolved
}

/**
 * Returns true when `candidate` resolves to a location inside one of `baseDirs`.
 * Used to gate destructive fs operations (e.g. `fs.rm`) on absolute paths that
 * came from an untrusted source (a cached `build-cache.json` an attacker may
 * have edited). Canonicalises bases via realpath when they exist so an in-tree
 * symlink can't redirect the check.
 */
export function isPathWithinBases(candidate: string, baseDirs: readonly string[]): boolean {
  if (typeof candidate !== 'string' || candidate.length === 0) {
    return false
  }

  // Canonicalise the candidate via its existing ancestor so an in-tree symlink
  // (or the macOS /var -> /private/var alias) does not flip the containment
  // check to a false negative. Walk up until an ancestor exists; the
  // canonical-base + non-canonical-tail comparison is still sound because the
  // tail is the same character sequence in both names.
  const resolvedCandidate = canonicalisePath(path.resolve(candidate))

  for (const baseDir of baseDirs) {
    let base = path.resolve(baseDir)
    try {
      base = fs.realpathSync(base)
    } catch {
      // Base does not exist yet - fall back to the resolved (non-canonical) path.
    }

    if (resolvedCandidate === base || resolvedCandidate.startsWith(base + path.sep)) {
      return true
    }
  }

  return false
}

function canonicalisePath(target: string): string {
  // Walk up until we find an ancestor that exists, realpath it, then re-append
  // the non-existent tail. Returns the input unchanged if no ancestor exists.
  let current = target
  const tail: string[] = []
  while (true) {
    try {
      const real = fs.realpathSync(current)
      return tail.length === 0 ? real : path.join(real, ...tail.reverse())
    } catch {
      const parent = path.dirname(current)
      if (parent === current) return target
      tail.push(path.basename(current))
      current = parent
    }
  }
}

// Convenience re-export for callers that only need the patterns (schema regex).
export const SAFE_NAME_REGEX = SAFE_NAME_PATTERN
export const SAFE_RELATIVE_PATH_REGEX = SAFE_RELATIVE_PATH_PATTERN
