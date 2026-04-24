import type { ValidationIssue } from './validate.types'

/** Set of valid combining algorithm names accepted by the policy engine. */
export const VALID_ALGORITHMS = new Set(['deny-overrides', 'allow-overrides', 'first-match', 'highest-priority'])

/** Set of valid rule effect values (`'allow'` or `'deny'`). */
export const VALID_EFFECTS = new Set(['allow', 'deny'])

/** Set of valid condition operator names supported by the condition evaluator. */
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
 * @param input - The condition item to validate.
 * @param path - Dot-path prefix used in reported issues.
 * @param issues - Array to push validation issues into.
 */
export function validateConditionItem(input: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof input !== 'object' || input === null) {
    issues.push({ type: 'error', code: 'INVALID_CONDITION', message: 'Condition must be an object', path })
    return
  }

  const obj = input as Record<string, unknown>

  if ('field' in obj) {
    // Leaf condition
    if (typeof obj.field !== 'string' || !obj.field) {
      issues.push({
        type: 'error',
        code: 'MISSING_FIELD',
        message: 'Condition must have a non-empty string "field"',
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
  } else {
    // Group condition
    validateConditionGroup(input, path, issues)
  }
}

/**
 * Validate a condition group (`all`, `any`, or `none`).
 *
 * The group must be an object containing exactly one of the keys `all`, `any`,
 * or `none`, whose value must be an array of condition items.
 *
 * @param input - The condition group to validate.
 * @param path - Dot-path prefix used in reported issues.
 * @param issues - Array to push validation issues into.
 */
export function validateConditionGroup(input: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof input !== 'object' || input === null) {
    issues.push({ type: 'error', code: 'INVALID_CONDITION', message: 'Condition group must be an object', path })
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
    validateConditionItem(item, `${path}.${groupKey}[${i}]`, issues)
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
 */
export function validateRuleShape(input: unknown, path: string, issues: ValidationIssue[]): void {
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

  if (typeof rule.priority !== 'number') {
    issues.push({
      type: 'error',
      code: 'INVALID_TYPE',
      message: 'Rule "priority" must be a number',
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

  if (rule.conditions !== undefined) {
    validateConditionGroup(rule.conditions, `${path}.conditions`, issues)
  }
}
