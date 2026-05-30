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

export function hashString(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

// Stable JSON keys before hashing so cache keys stay deterministic across JS
// engines whose `Object.keys` order isn't guaranteed for non-integer keys.
export function hashValue(value: unknown) {
  return hashString(stableStringify(value))
}
