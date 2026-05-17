import type { Engine } from '..'
import { MAX_CONDITION_DEPTH } from '../conditions/conditions.libs'
import { ALLOWED_ROOTS } from '../resolve/resolve'
import type { Validate } from './validate.types'

/**
 * Field paths longer than this are refused. The runtime DotPath resolver
 * splits on dots, so an enormous field string would cost O(length) work
 * per evaluation with no upside.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const MAX_FIELD_LENGTH = 256
/**
 * Valid combining algorithm names.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const VALID_ALGORITHMS = new Set(['deny-overrides', 'allow-overrides', 'first-match', 'highest-priority'])

/**
 * Valid rule effect values.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const VALID_EFFECTS = new Set(['allow', 'deny'])

/**
 * Validate-time policy size caps.
 *
 * `indexPolicy()` builds an `actions x resources` cartesian per rule, so an
 * unbounded policy can stall the event loop. Limits also cap memory growth
 * in {@link Engine}'s LRU caches.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const POLICY_LIMITS = {
  rulesPerPolicy: 1_000,
  actionsPerRule: 100,
  resourcesPerRule: 100,
  /** Worst-case cartesian product per rule. */
  cartesianPerRule: 1_000,
} as const

/** Whole-path shorthands accepted alongside the dotted roots. */
const RESOLVABLE_SHORTHANDS = new Set(['action', 'scope'])

/**
 * True when `path` would resolve to a real attribute at evaluation time.
 * Shares {@link ALLOWED_ROOTS} with the resolver so the two stay in lock-step.
 *
 * @param path - Dot-path string to check.
 * @returns `true` when the path's root is a known resolvable root.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function isResolvablePath(path: string): boolean {
  if (RESOLVABLE_SHORTHANDS.has(path)) return true
  const root = path.split('.', 1)[0]
  return !!root && ALLOWED_ROOTS.has(root)
}

/**
 * Set of valid condition operator names supported by the condition evaluator.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const VALID_OPERATORS = new Set([
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'matches',
  'exists',
  'not_exists',
  'subset_of',
  'superset_of',
])

/**
 * Validate a single condition item (leaf or group).
 *
 * A leaf condition must have a non-empty `field` string and a valid `operator`.
 * If the item does not contain a `field` key it is treated as a condition group
 * and delegated to {@link validateConditionGroup}.
 *
 * @param input  - The condition item to validate.
 * @param path   - Dot-path prefix used in reported issues.
 * @param issues - Array to push validation issues into.
 * @param depth  - Current nesting depth (defaults to `0`; bounded by `MAX_CONDITION_DEPTH`).
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateConditionItem(input: unknown, path: string, issues: Validate.IIssue[], depth = 0): void {
  if (typeof input !== 'object' || input === null) {
    issues.push({
      type: 'error',
      code: 'INVALID_CONDITION',
      message: 'Condition must be an object',
      path,
    })
    return
  }

  const obj = input as Record<string, unknown>

  if ('field' in obj) {
    if (typeof obj.field !== 'string' || !obj.field) {
      issues.push({
        type: 'error',
        code: 'MISSING_FIELD',
        message: 'Condition must have a non-empty string "field"',
        path: `${path}.field`,
      })
    } else if (obj.field.length > MAX_FIELD_LENGTH) {
      issues.push({
        type: 'error',
        code: 'LIMIT_EXCEEDED',
        message: `Condition field is ${obj.field.length} chars; limit is ${MAX_FIELD_LENGTH}`,
        path: `${path}.field`,
      })
    } else if (!isResolvablePath(obj.field)) {
      issues.push({
        type: 'warning',
        code: 'UNRESOLVABLE_FIELD',
        message: `Condition field "${obj.field}" has no resolvable root (expected subject/resource/environment, or shorthand action/scope)`,
        path: `${path}.field`,
      })
    }
    if (!VALID_OPERATORS.has(obj.operator as string)) {
      issues.push({
        type: 'error',
        code: 'INVALID_OPERATOR',
        message: `Invalid operator "${String(obj.operator)}"`,
        path: `${path}.operator`,
      })
    }
    if (typeof obj.value === 'string' && obj.value.startsWith('$') && !isResolvablePath(obj.value.slice(1))) {
      issues.push({
        type: 'warning',
        code: 'UNRESOLVABLE_VALUE',
        message: `Condition value "${obj.value}" references an unresolvable path`,
        path: `${path}.value`,
      })
    }
  } else {
    validateConditionGroup(input, path, issues, depth)
  }
}

/**
 * Validate a condition group (`all`, `any`, or `none`).
 *
 * The group must be an object containing exactly one of the keys `all`, `any`,
 * or `none`, whose value must be an array of condition items.
 *
 * @param input  - The condition group to validate.
 * @param path   - Dot-path prefix used in reported issues.
 * @param issues - Array to push validation issues into.
 * @param depth  - Current nesting depth (defaults to `0`; bounded by `MAX_CONDITION_DEPTH`).
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateConditionGroup(input: unknown, path: string, issues: Validate.IIssue[], depth = 0): void {
  if (depth > MAX_CONDITION_DEPTH) {
    issues.push({
      type: 'error',
      code: 'LIMIT_EXCEEDED',
      message: `Condition nesting exceeds MAX_CONDITION_DEPTH (${MAX_CONDITION_DEPTH})`,
      path,
    })
    return
  }
  if (typeof input !== 'object' || input === null) {
    issues.push({
      type: 'error',
      code: 'INVALID_CONDITION',
      message: 'Condition group must be an object',
      path,
    })
    return
  }

  const obj = input as Record<string, unknown>
  const groupKey = ['all', 'any', 'none'].find((k) => k in obj)

  if (!groupKey) {
    issues.push({
      type: 'error',
      code: 'INVALID_CONDITION',
      message: 'Condition group must have "all", "any", or "none" key',
      path,
    })
    return
  }

  const items = obj[groupKey]
  if (!Array.isArray(items)) {
    issues.push({
      type: 'error',
      code: 'INVALID_CONDITION',
      message: `"${groupKey}" must be an array`,
      path: `${path}.${groupKey}`,
    })
    return
  }

  for (const [i, item] of items.entries()) {
    validateConditionItem(item, `${path}.${groupKey}[${i}]`, issues, depth + 1)
  }
}

/**
 * Validate the shape of a single rule object.
 *
 * Checks that all required fields (`id`, `effect`, `priority`, `actions`,
 * `resources`) are present and have the correct types. Optionally validates
 * nested `conditions` via {@link validateConditionGroup}.
 *
 * @param input - The rule object to validate.
 * @param path - Dot-path prefix used in reported issues.
 * @param issues - Array to push validation issues into.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateRuleShape(input: unknown, path: string, issues: Validate.IIssue[]): void {
  if (typeof input !== 'object' || input === null) {
    issues.push({ type: 'error', code: 'INVALID_RULE', message: 'Rule must be an object', path })
    return
  }

  const rule = input as Record<string, unknown>

  if (typeof rule.id !== 'string' || !rule.id) {
    issues.push({
      type: 'error',
      code: 'MISSING_FIELD',
      message: 'Rule must have a non-empty string "id"',
      path: `${path}.id`,
    })
  }

  if (!VALID_EFFECTS.has(rule.effect as string)) {
    issues.push({
      type: 'error',
      code: 'INVALID_EFFECT',
      message: `Invalid effect "${String(rule.effect)}". Must be "allow" or "deny"`,
      path: `${path}.effect`,
    })
  }

  if (typeof rule.priority !== 'number' || !Number.isFinite(rule.priority)) {
    issues.push({
      type: 'error',
      code: 'INVALID_TYPE',
      message: 'Rule "priority" must be a finite number (NaN/Infinity break highest-priority ranking)',
      path: `${path}.priority`,
    })
  }

  if (!Array.isArray(rule.actions) || rule.actions.length === 0) {
    issues.push({
      type: 'error',
      code: 'MISSING_FIELD',
      message: 'Rule must have a non-empty "actions" array',
      path: `${path}.actions`,
    })
  } else {
    if (rule.actions.length > POLICY_LIMITS.actionsPerRule) {
      issues.push({
        type: 'error',
        code: 'LIMIT_EXCEEDED',
        message: `Rule has ${rule.actions.length} actions; limit is ${POLICY_LIMITS.actionsPerRule}`,
        path: `${path}.actions`,
      })
    }
    for (const [i, action] of (rule.actions as unknown[]).entries()) {
      if (typeof action !== 'string') {
        issues.push({
          type: 'error',
          code: 'INVALID_TYPE',
          message: 'Action must be a string',
          path: `${path}.actions[${i}]`,
        })
      }
    }
  }

  if (!Array.isArray(rule.resources) || rule.resources.length === 0) {
    issues.push({
      type: 'error',
      code: 'MISSING_FIELD',
      message: 'Rule must have a non-empty "resources" array',
      path: `${path}.resources`,
    })
  } else {
    if (rule.resources.length > POLICY_LIMITS.resourcesPerRule) {
      issues.push({
        type: 'error',
        code: 'LIMIT_EXCEEDED',
        message: `Rule has ${rule.resources.length} resources; limit is ${POLICY_LIMITS.resourcesPerRule}`,
        path: `${path}.resources`,
      })
    }
    for (const [i, resource] of (rule.resources as unknown[]).entries()) {
      if (typeof resource !== 'string') {
        issues.push({
          type: 'error',
          code: 'INVALID_TYPE',
          message: 'Resource must be a string',
          path: `${path}.resources[${i}]`,
        })
      }
    }
  }

  // Broad-allow warning: `effect: 'allow'` + `actions: ['*']` + `resources: ['*']`
  // + zero conditions grants every operation to every subject the policy applies to.
  // Intent is ambiguous from the policy alone (super-admin vs. mistake) - surface
  // for review so the operator confirms once.
  if (rule.effect === 'allow' && Array.isArray(rule.actions) && Array.isArray(rule.resources)) {
    const allActions = rule.actions.length === 1 && rule.actions[0] === '*'
    const allResources = rule.resources.length === 1 && rule.resources[0] === '*'
    const cond = rule.conditions as { all?: unknown[]; any?: unknown[]; none?: unknown[] } | undefined
    const hasConditions =
      !!cond && ((cond.all?.length ?? 0) > 0 || (cond.any?.length ?? 0) > 0 || (cond.none?.length ?? 0) > 0)
    if (allActions && allResources && !hasConditions) {
      issues.push({
        type: 'warning',
        code: 'BROAD_ALLOW',
        message:
          'Rule allows every action on every resource with no conditions. This is the broadest possible grant - confirm it is intentional.',
        path,
      })
    }
  }

  // Indexer cost is actions x resources per rule. Bound the cartesian even when
  // each list passes its own cap, so a 99x99 rule doesn't slip through.
  if (Array.isArray(rule.actions) && Array.isArray(rule.resources)) {
    const cartesian = rule.actions.length * rule.resources.length
    if (cartesian > POLICY_LIMITS.cartesianPerRule) {
      issues.push({
        type: 'error',
        code: 'LIMIT_EXCEEDED',
        message: `Rule actionxresource cartesian is ${cartesian}; limit is ${POLICY_LIMITS.cartesianPerRule}`,
        path,
      })
    }
  }

  if (rule.conditions !== undefined) {
    validateConditionGroup(rule.conditions, `${path}.conditions`, issues)
  }
}
