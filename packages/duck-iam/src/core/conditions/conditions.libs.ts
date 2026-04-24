import { resolve } from '../resolve'
import type { AccessRequest, AttributeValue, Condition, ConditionGroup, Operator, Scalar } from '../types'
import type { OpFn } from './conditions.types'

/** Max allowed regex pattern length to mitigate ReDoS */
export const MAX_REGEX_LENGTH = 512

/** LRU cache capacity for compiled regex patterns */
export const REGEX_CACHE_MAX = 256

/** LRU cache for compiled regex patterns to avoid recompilation on every evaluation */
export const regexCache = new Map<string, RegExp>()

/**
 * Retrieve a cached compiled regex, or compile and cache it.
 * Returns `null` if the pattern is invalid.
 */
export function getCachedRegex(pattern: string): RegExp | null {
  const cached = regexCache.get(pattern)
  if (cached) return cached
  try {
    const re = new RegExp(pattern)
    if (regexCache.size >= REGEX_CACHE_MAX) {
      // Evict oldest entry
      const first = regexCache.keys().next().value
      if (first !== undefined) regexCache.delete(first)
    }
    regexCache.set(pattern, re)
    return re
  } catch {
    return null
  }
}

/** Record mapping every supported operator to its implementation function. */
export const ops: Record<Operator, OpFn> = {
  eq: (f, v) => f === v,
  neq: (f, v) => f !== v,

  gt: (f, v) => typeof f === 'number' && typeof v === 'number' && f > v,
  gte: (f, v) => typeof f === 'number' && typeof v === 'number' && f >= v,
  lt: (f, v) => typeof f === 'number' && typeof v === 'number' && f < v,
  lte: (f, v) => typeof f === 'number' && typeof v === 'number' && f <= v,

  in: (f, v) => {
    if (!Array.isArray(v)) return false
    if (Array.isArray(f)) return f.some((i) => v.includes(i))
    return v.includes(f as Scalar)
  },
  nin: (f, v) => {
    if (!Array.isArray(v)) return true
    if (Array.isArray(f)) return !f.some((i) => v.includes(i))
    return !v.includes(f as Scalar)
  },

  contains: (f, v) => {
    if (Array.isArray(f)) return f.includes(v as Scalar)
    if (typeof f === 'string' && typeof v === 'string') return f.includes(v)
    return false
  },
  not_contains: (f, v) => {
    if (Array.isArray(f)) return !f.includes(v as Scalar)
    if (typeof f === 'string' && typeof v === 'string') return !f.includes(v)
    return true
  },

  starts_with: (f, v) => typeof f === 'string' && typeof v === 'string' && f.startsWith(v),
  ends_with: (f, v) => typeof f === 'string' && typeof v === 'string' && f.endsWith(v),

  matches: (f, v) => {
    if (typeof f !== 'string' || typeof v !== 'string') return false
    if (v.length > MAX_REGEX_LENGTH) return false
    const re = getCachedRegex(v)
    return re ? re.test(f) : false
  },

  exists: (f) => f !== null && f !== undefined,
  not_exists: (f) => f === null || f === undefined,

  subset_of: (f, v) => {
    if (!Array.isArray(f) || !Array.isArray(v)) return false
    return f.every((i) => v.includes(i))
  },
  superset_of: (f, v) => {
    if (!Array.isArray(f) || !Array.isArray(v)) return false
    return v.every((i) => f.includes(i))
  },
}

/** Maximum nesting depth for condition groups to prevent stack overflow */
export const MAX_CONDITION_DEPTH = 10

/** Type guard that distinguishes a flat `Condition` from a nested `ConditionGroup`. */
export function isCondition(item: Condition | ConditionGroup): item is Condition {
  return 'field' in item
}

/**
 * Resolve a condition value, handling `$`-prefixed variable references.
 * e.g. `$subject.id` resolves to the request's subject.id at eval time.
 */
export function resolveValue(req: AccessRequest, value: AttributeValue): AttributeValue {
  if (typeof value === 'string' && value.startsWith('$')) {
    return resolve(req, value.slice(1))
  }
  return value
}

/** Evaluate a single flat condition against an access request. */
export function evalCondition(req: AccessRequest, cond: Condition): boolean {
  const fieldVal = resolve(req, cond.field)
  const condVal = resolveValue(req, cond.value ?? null)
  return ops[cond.operator](fieldVal, condVal)
}
