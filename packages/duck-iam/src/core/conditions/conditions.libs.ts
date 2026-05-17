import { resolve } from '../resolve'
import type { AccessControl, Primitives, Request } from '../types'

/**
 * @deprecated Use {@link AccessControl.OpFn}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type OpFn = AccessControl.OpFn

/**
 * Max allowed regex pattern length to mitigate ReDoS.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const MAX_REGEX_LENGTH = 512

/**
 * LRU cache capacity for compiled regex patterns.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const REGEX_CACHE_MAX = 256

/**
 * LRU cache for compiled regex patterns to avoid recompilation on every evaluation.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const regexCache = new Map<string, RegExp>()

/**
 * Retrieve a cached compiled regex, or compile and cache it.
 * Returns `null` if the pattern is invalid.
 *
 * On a cache hit the entry is re-inserted so iteration order becomes recency
 * order; eviction then drops the *least recently used* pattern instead of
 * the oldest-inserted one. Without this, a hot pattern compiled early gets
 * evicted as soon as REGEX_CACHE_MAX cold patterns roll through.
 *
 * @param pattern - Regex source string.
 * @returns The compiled `RegExp`, or `null` when the pattern fails to compile.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function getCachedRegex(pattern: string): RegExp | null {
  const cached = regexCache.get(pattern)
  if (cached) {
    regexCache.delete(pattern)
    regexCache.set(pattern, cached)
    return cached
  }
  try {
    const re = new RegExp(pattern)
    if (regexCache.size >= REGEX_CACHE_MAX) {
      const first = regexCache.keys().next().value
      if (first !== undefined) regexCache.delete(first)
    }
    regexCache.set(pattern, re)
    return re
  } catch {
    return null
  }
}

/**
 * Record mapping every supported operator to its implementation function.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const ops: Record<AccessControl.Operator, AccessControl.OpFn> = {
  eq: (f, v) => f === v,
  neq: (f, v) => f !== v,

  gt: (f, v) => typeof f === 'number' && typeof v === 'number' && f > v,
  gte: (f, v) => typeof f === 'number' && typeof v === 'number' && f >= v,
  lt: (f, v) => typeof f === 'number' && typeof v === 'number' && f < v,
  lte: (f, v) => typeof f === 'number' && typeof v === 'number' && f <= v,

  in: (f, v) => {
    if (!Array.isArray(v)) return false
    if (Array.isArray(f)) return f.some((i) => v.includes(i))
    return v.includes(f as Primitives.Scalar)
  },
  nin: (f, v) => {
    if (!Array.isArray(v)) return true
    if (Array.isArray(f)) return !f.some((i) => v.includes(i))
    return !v.includes(f as Primitives.Scalar)
  },

  contains: (f, v) => {
    if (Array.isArray(f)) return f.includes(v as Primitives.Scalar)
    if (typeof f === 'string' && typeof v === 'string') return f.includes(v)
    return false
  },
  not_contains: (f, v) => {
    if (Array.isArray(f)) return !f.includes(v as Primitives.Scalar)
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

/**
 * Maximum nesting depth for condition groups to prevent stack overflow.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const MAX_CONDITION_DEPTH = 10

/**
 * Type guard that distinguishes a flat {@link AccessControl.ICondition} from a nested {@link AccessControl.IConditionGroup}.
 *
 * @param item - Either a leaf condition or a group node.
 * @returns `true` when `item` is a leaf `ICondition`.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function isCondition(
  item: AccessControl.ICondition | AccessControl.IConditionGroup,
): item is AccessControl.ICondition {
  return 'field' in item
}

/**
 * Resolve a condition value, handling `$`-prefixed variable references.
 * e.g. `$subject.id` resolves to the request's subject.id at eval time.
 *
 * @param req   - The access request providing resolution roots.
 * @param value - Raw condition value (possibly `$`-prefixed reference).
 * @returns The resolved value, or `value` unchanged when no `$` prefix is present.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function resolveValue(req: Request.IAccessRequest, value: Primitives.AttributeValue): Primitives.AttributeValue {
  if (typeof value === 'string' && value.startsWith('$')) {
    return resolve(req, value.slice(1))
  }
  return value
}

/**
 * The `matches` operator compiles the value into a regex. Allowing a
 * `$`-prefixed value to resolve from request attributes would let any
 * attacker who controls a subject/resource/env attribute pin in a
 * catastrophic regex (ReDoS). We refuse `$`-resolved patterns for
 * `matches` regardless of where the attribute came from.
 *
 * @param value - Candidate operand value to inspect.
 * @returns `true` when the value is a `$`-prefixed string reference.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function isUserSourcedValue(value: Primitives.AttributeValue): boolean {
  return typeof value === 'string' && value.startsWith('$')
}

/**
 * Evaluate a single flat condition against an access request.
 *
 * @param req  - The access request providing field values.
 * @param cond - The condition to test.
 * @returns `true` when the operator predicate holds against the resolved field.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function evalCondition(req: Request.IAccessRequest, cond: AccessControl.ICondition): boolean {
  if (cond.operator === 'matches' && isUserSourcedValue(cond.value ?? null)) return false
  const fieldVal = resolve(req, cond.field)
  const condVal = resolveValue(req, cond.value ?? null)
  return ops[cond.operator](fieldVal, condVal)
}
