import path from 'node:path'

export function normalizeSlashes(value: string) {
  return value.replaceAll('\\', '/')
}

export function joinPosix(...parts: string[]) {
  const normalizedParts = parts.filter(Boolean).map((part) => normalizeSlashes(part))
  return path.posix.join(...normalizedParts)
}

