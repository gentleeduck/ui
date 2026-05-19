import { createHash } from 'node:crypto'

function toStableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => toStableValue(item))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, toStableValue(nestedValue)]),
    )
  }

  return value
}

function stableStringify(value: unknown) {
  return JSON.stringify(toStableValue(value))
}

/** Returns the SHA-256 hex digest of the given string. */
export function hashString(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

/** Computes a deterministic SHA-256 hash of an arbitrary value using stable serialization. */
export function hashValue(value: unknown) {
  return hashString(stableStringify(value))
}
