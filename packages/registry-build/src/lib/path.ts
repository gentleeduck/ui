import path from 'node:path'

/** Replaces backslashes with forward slashes for cross-platform path consistency. */
export function normalizeSlashes(value: string) {
  return value.replaceAll('\\', '/')
}

/** Joins path segments using POSIX separators, normalizing backslashes and filtering empty parts. */
export function joinPosix(...parts: string[]) {
  const normalizedParts = parts.filter(Boolean).map((part) => normalizeSlashes(part))
  return path.posix.join(...normalizedParts)
}
