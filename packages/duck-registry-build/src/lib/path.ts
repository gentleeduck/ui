import path from 'node:path'

export function normalizeSlashes(value: string) {
  return value.replaceAll('\\', '/')
}

// Filters empty parts so callers can pass `joinPosix(maybeUndefined, name)` without a guard.
// Always emits POSIX separators so generated paths stay stable across Windows builds.
export function joinPosix(...parts: string[]) {
  const normalizedParts = parts.filter(Boolean).map((part) => normalizeSlashes(part))
  return path.posix.join(...normalizedParts)
}
