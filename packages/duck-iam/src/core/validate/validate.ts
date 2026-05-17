import { MAX_INHERITANCE_DEPTH } from '../rbac'
import type { AccessControl } from '../types'
import { POLICY_LIMITS, VALID_ALGORITHMS, validateRuleShape } from './validate.libs'
import type { Validate } from './validate.types'
/**
 * Validate role definitions for common configuration mistakes.
 *
 * Checks for:
 * - Duplicate role IDs
 * - Dangling `inherits` references (role inherits from non-existent role)
 * - Circular inheritance chains (detected and reported as warnings since they're handled at runtime)
 * - Roles with no permissions and no inheritance
 *
 * @param roles - The role definitions to validate.
 * @returns A {@link Validate.IResult} listing any issues found.
 * @example
 * ```ts
 * const result = validateRoles(roles)
 * if (!result.valid) console.error(result.issues)
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validateRoles(roles: readonly AccessControl.IRole[]): Validate.IResult {
  const issues: Validate.IIssue[] = []
  const roleIds = new Set<string>()

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

  // Cycles are runtime-safe (handled by visited-set in inheritance walk), so emit as warnings.
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

  // Depth bound: chains deeper than MAX_INHERITANCE_DEPTH silently truncate at
  // runtime, dropping permissions invisibly. Surface as error so the operator
  // catches it before deploy instead of debugging missing permissions later.
  for (const role of roles) {
    const depth = longestInheritanceDepth(role.id, rolesMap)
    if (depth > MAX_INHERITANCE_DEPTH) {
      issues.push({
        type: 'error',
        code: 'INHERITANCE_TOO_DEEP',
        message: `Role "${role.id}" has an inheritance chain ${depth} deep; the runtime caps at ${MAX_INHERITANCE_DEPTH} and silently drops anything past it`,
        roleId: role.id,
      })
    }
  }

  return {
    valid: issues.every((i) => i.type !== 'error'),
    issues,
  }
}

/**
 * Longest path from `roleId` up through `inherits`. Single mutable `seen` set
 * with pop-on-return - O(nodes) allocations instead of O(nodes^2) for the
 * naive copy-the-set approach. Cycles are cut by `seen`; depth is capped at
 * `MAX_INHERITANCE_DEPTH + 1` to keep validation cheap on hostile input.
 */
function longestInheritanceDepth(roleId: string, rolesMap: Map<string, AccessControl.IRole>): number {
  const seen = new Set<string>()
  function walk(id: string, depth: number): number {
    if (seen.has(id)) return depth
    if (depth > MAX_INHERITANCE_DEPTH + 1) return depth
    const role = rolesMap.get(id)
    if (!role?.inherits?.length) return depth
    seen.add(id)
    let max = depth
    for (const parent of role.inherits) {
      const d = walk(parent, depth + 1)
      if (d > max) max = d
    }
    seen.delete(id)
    return max
  }
  return walk(roleId, 0)
}

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
 *   engine.admin.savePolicy(jsonFromDatabase as AccessControl.IPolicy);
 *
 * @param input - The candidate policy object (typically parsed JSON or an admin form payload).
 * @returns A {@link Validate.IResult} with `valid: false` when any error issue was emitted.
 * @example
 * ```ts
 * const result = validatePolicy(jsonFromDatabase)
 * if (!result.valid) throw new Error(result.issues.map(i => i.message).join(', '))
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function validatePolicy(input: unknown): Validate.IResult {
  const issues: Validate.IIssue[] = []

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
    if (p.rules.length > POLICY_LIMITS.rulesPerPolicy) {
      issues.push({
        type: 'error',
        code: 'LIMIT_EXCEEDED',
        message: `Policy has ${p.rules.length} rules; limit is ${POLICY_LIMITS.rulesPerPolicy}`,
        path: 'rules',
      })
    }
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
