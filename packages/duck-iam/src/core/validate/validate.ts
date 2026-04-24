import type { Role } from '../types'
import { VALID_ALGORITHMS, validateRuleShape } from './validate.libs'
import type { ValidationIssue, ValidationResult } from './validate.types'

// ------------------------------------------------------------
// Role validation
// ------------------------------------------------------------

/**
 * Validate role definitions for common configuration mistakes.
 *
 * Checks for:
 * - Duplicate role IDs
 * - Dangling `inherits` references (role inherits from non-existent role)
 * - Circular inheritance chains (detected and reported as warnings since they're handled at runtime)
 * - Roles with no permissions and no inheritance
 */
export function validateRoles(roles: readonly Role[]): ValidationResult {
  const issues: ValidationIssue[] = []
  const roleIds = new Set<string>()

  // Check for duplicate IDs
  for (const role of roles) {
    if (roleIds.has(role.id)) {
      issues.push({
        type: 'error',
        code: 'DUPLICATE_ROLE_ID',
        message: `Duplicate role ID "${role.id}"`,
        roleId: role.id,
      })
    }
    roleIds.add(role.id)
  }

  // Check for dangling inherits references
  for (const role of roles) {
    for (const parentId of role.inherits ?? []) {
      if (!roleIds.has(parentId)) {
        issues.push({
          type: 'error',
          code: 'DANGLING_INHERIT',
          message: `Role "${role.id}" inherits from "${parentId}" which does not exist`,
          roleId: role.id,
        })
      }
    }
  }

  // Check for circular inheritance
  const rolesMap = new Map(roles.map((r) => [r.id, r]))

  for (const role of roles) {
    if (!role.inherits?.length) continue

    const visited = new Set<string>()
    const stack = [role.id]

    while (stack.length > 0) {
      const current = stack.pop() as string
      if (visited.has(current)) {
        issues.push({
          type: 'warning',
          code: 'CIRCULAR_INHERIT',
          message: `Circular inheritance detected involving role "${role.id}" (cycle includes "${current}")`,
          roleId: role.id,
        })
        break
      }
      visited.add(current)

      const r = rolesMap.get(current)
      if (r?.inherits) {
        for (const parentId of r.inherits) {
          if (roleIds.has(parentId)) stack.push(parentId)
        }
      }
    }
  }

  // Check for empty roles (no permissions, no inheritance)
  for (const role of roles) {
    if (role.permissions.length === 0 && (!role.inherits || role.inherits.length === 0)) {
      issues.push({
        type: 'warning',
        code: 'EMPTY_ROLE',
        message: `Role "${role.id}" has no permissions and no inheritance`,
        roleId: role.id,
      })
    }
  }

  return {
    valid: issues.every((i) => i.type !== 'error'),
    issues,
  }
}

// ------------------------------------------------------------
// Policy validation (runtime validation for dynamic/untrusted policies)
// ------------------------------------------------------------

/**
 * Validate a policy object from an untrusted source (database, API, admin dashboard).
 *
 * Deeply validates the entire policy structure including:
 * - Required fields: id, name, algorithm, rules
 * - Valid combining algorithm
 * - Each rule: id, effect, priority, actions, resources, conditions
 * - Valid operators in conditions
 * - Correct condition group structure (all/any/none with arrays)
 *
 * Use this before feeding dynamic policies to the engine:
 *
 *   const result = validatePolicy(jsonFromDatabase);
 *   if (!result.valid) throw new Error(result.issues.map(i => i.message).join(', '));
 *   engine.admin.savePolicy(jsonFromDatabase as Policy);
 */
export function validatePolicy(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = []

  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    issues.push({ type: 'error', code: 'INVALID_TYPE', message: 'Policy must be a non-null object', path: '' })
    return { valid: false, issues }
  }

  const p = input as Record<string, unknown>

  if (typeof p.id !== 'string' || !p.id) {
    issues.push({
      type: 'error',
      code: 'MISSING_FIELD',
      message: 'Policy must have a non-empty string "id"',
      path: 'id',
    })
  }

  if (typeof p.name !== 'string' || !p.name) {
    issues.push({
      type: 'error',
      code: 'MISSING_FIELD',
      message: 'Policy must have a non-empty string "name"',
      path: 'name',
    })
  }

  if (!VALID_ALGORITHMS.has(p.algorithm as string)) {
    issues.push({
      type: 'error',
      code: 'INVALID_ALGORITHM',
      message: `Invalid algorithm "${String(p.algorithm)}". Must be one of: ${[...VALID_ALGORITHMS].join(', ')}`,
      path: 'algorithm',
    })
  }

  if (p.version !== undefined && typeof p.version !== 'number') {
    issues.push({
      type: 'error',
      code: 'INVALID_TYPE',
      message: '"version" must be a number if provided',
      path: 'version',
    })
  }

  if (!Array.isArray(p.rules)) {
    issues.push({ type: 'error', code: 'MISSING_FIELD', message: 'Policy must have a "rules" array', path: 'rules' })
  } else {
    for (const [i, rule] of (p.rules as unknown[]).entries()) {
      validateRuleShape(rule, `rules[${i}]`, issues)
    }

    // Check for duplicate rule IDs
    const ruleIds = new Set<string>()
    for (const rule of p.rules as Array<Record<string, unknown>>) {
      if (typeof rule?.id === 'string') {
        if (ruleIds.has(rule.id)) {
          issues.push({
            type: 'warning',
            code: 'DUPLICATE_RULE_ID',
            message: `Duplicate rule ID "${rule.id}"`,
            path: 'rules',
          })
        }
        ruleIds.add(rule.id)
      }
    }
  }

  if (p.targets !== undefined && p.targets !== null) {
    if (typeof p.targets !== 'object' || Array.isArray(p.targets)) {
      issues.push({
        type: 'error',
        code: 'INVALID_TYPE',
        message: '"targets" must be an object if provided',
        path: 'targets',
      })
    } else {
      const targets = p.targets as Record<string, unknown>
      for (const key of ['actions', 'resources', 'roles'] as const) {
        if (targets[key] !== undefined && !Array.isArray(targets[key])) {
          issues.push({
            type: 'error',
            code: 'INVALID_TYPE',
            message: `targets.${key} must be an array`,
            path: `targets.${key}`,
          })
        }
      }
    }
  }

  return { valid: issues.every((i) => i.type !== 'error'), issues }
}
