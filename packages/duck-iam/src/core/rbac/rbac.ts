import type { AccessControl } from '../types'
/**
 * Maximum depth of the inheritance chain walked by {@link collectPermissions}
 * and {@link resolveEffectiveRoles}. Cycles are cut by the `visited` set, but
 * a linear N-deep chain (or a malformed import) would still blow the stack  -
 * the bound makes traversal cost predictable.
 *
 * Roles past this depth are silently dropped from the resolved set. Override
 * is intentionally not exposed: a single hard limit keeps every adapter and
 * validator in agreement. Bump here if your role graph legitimately exceeds 32.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const MAX_INHERITANCE_DEPTH = 32

/**
 * Flatten role inheritance, returning permissions in parent-first order.
 * Cycles short-circuit via `visited`; depth is bounded by {@link MAX_INHERITANCE_DEPTH}.
 */
function collectPermissions(
  roleId: string,
  rolesMap: Map<string, AccessControl.IRole>,
  visited = new Set<string>(),
  depth = 0,
): AccessControl.IRole['permissions'][number][] {
  if (depth > MAX_INHERITANCE_DEPTH) return []
  if (visited.has(roleId)) return []
  visited.add(roleId)

  const role = rolesMap.get(roleId)
  if (!role) return []

  const inherited = (role.inherits ?? []).flatMap((parent) => collectPermissions(parent, rolesMap, visited, depth + 1))

  return [...inherited, ...role.permissions]
}

/**
 * Convert RBAC role definitions into an ABAC policy.
 *
 * Each permission becomes a rule with a condition that checks
 * `subject.roles` contains the role ID. This lets RBAC and ABAC
 * coexist in the same evaluation pipeline.
 *
 * @param roles - Every role definition (resolved separately of subject assignment).
 * @returns A synthetic {@link AccessControl.IPolicy} with one allow rule per permission.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function rolesToPolicy(roles: AccessControl.IRole[]): AccessControl.IPolicy {
  const rolesMap = new Map(roles.map((r) => [r.id, r]))
  const rules: AccessControl.IRule[] = []
  // Monotonic counter for rule ids: stable + unique regardless of role / action
  // / resource names. Previous `rbac.${role}.${action}.${resource}.${i}` format
  // produced ambiguous ids when any segment contained a `.`.
  let ruleSeq = 0

  for (const role of roles) {
    const allPerms = collectPermissions(role.id, rolesMap)

    for (const [_i, perm] of allPerms.entries()) {
      const baseConditions: (AccessControl.ICondition | AccessControl.IConditionGroup)[] = [
        { field: 'subject.roles', operator: 'contains' as const, value: role.id },
      ]

      // Add scope condition if permission or role has a scope
      const effectiveScope = perm.scope ?? role.scope
      if (effectiveScope && effectiveScope !== '*') {
        baseConditions.push({ field: 'scope', operator: 'eq' as const, value: effectiveScope })
      }

      const conditions = perm.conditions
        ? {
            all: [
              ...baseConditions,
              ...('all' in perm.conditions
                ? perm.conditions.all
                : 'any' in perm.conditions
                  ? [perm.conditions]
                  : 'none' in perm.conditions
                    ? [perm.conditions]
                    : []),
            ],
          }
        : { all: baseConditions }

      rules.push({
        id: `__rbac__#${ruleSeq++}`,
        effect: 'allow',
        description: `${role.name}: ${perm.action} on ${perm.resource}`,
        priority: 10,
        actions: [perm.action],
        resources: [perm.resource],
        conditions,
      })
    }
  }

  return {
    id: '__rbac__',
    name: 'RBAC Policies',
    description: 'Auto-generated from role definitions',
    algorithm: 'allow-overrides',
    rules,
  }
}

/**
 * Walks `inherits` chains from each assigned role and returns the closed set
 * of effective role IDs. Cycles are cut by the `effective` set; depth is
 * bounded by {@link MAX_INHERITANCE_DEPTH} so a runaway chain can't recurse
 * past the JS stack.
 *
 * @param assignedRoles Role IDs directly assigned to the subject.
 * @param allRoles      Every role definition, used to resolve `inherits`.
 * @returns Closed set of effective role IDs (assigned + inherited).
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function resolveEffectiveRoles(assignedRoles: string[], allRoles: AccessControl.IRole[]): string[] {
  const rolesMap = new Map(allRoles.map((r) => [r.id, r]))
  const effective = new Set<string>()

  function walk(roleId: string, depth: number) {
    if (depth > MAX_INHERITANCE_DEPTH) return
    if (effective.has(roleId)) return
    effective.add(roleId)
    const role = rolesMap.get(roleId)
    for (const parent of role?.inherits ?? []) walk(parent, depth + 1)
  }

  for (const r of assignedRoles) walk(r, 0)
  return [...effective]
}
