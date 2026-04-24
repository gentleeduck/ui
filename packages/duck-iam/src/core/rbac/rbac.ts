import type { Condition, ConditionGroup, Policy, Role, Rule } from '../types'

/**
 * Flatten role inheritance, returning all permissions including inherited ones.
 * Handles cycles via visited set.
 */
function collectPermissions(
  roleId: string,
  rolesMap: Map<string, Role>,
  visited = new Set<string>(),
): Role['permissions'][number][] {
  if (visited.has(roleId)) return []
  visited.add(roleId)

  const role = rolesMap.get(roleId)
  if (!role) return []

  const inherited = (role.inherits ?? []).flatMap((parent) => collectPermissions(parent, rolesMap, visited))

  return [...inherited, ...role.permissions]
}

/**
 * Convert RBAC role definitions into an ABAC Policy.
 *
 * Each permission becomes a rule with a condition that checks
 * subject.roles contains the role ID. This lets RBAC and ABAC
 * coexist in the same evaluation pipeline.
 */
export function rolesToPolicy(roles: Role[]): Policy {
  const rolesMap = new Map(roles.map((r) => [r.id, r]))
  const rules: Rule[] = []

  for (const role of roles) {
    const allPerms = collectPermissions(role.id, rolesMap)

    for (const [i, perm] of allPerms.entries()) {
      const baseConditions: (Condition | ConditionGroup)[] = [
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
        id: `rbac.${role.id}.${perm.action}.${perm.resource}.${i}`,
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
 * Resolves a subject's effective roles by walking the inheritance tree.
 *
 * Starting from the assigned roles, recursively follows `inherits` chains
 * and returns all unique role IDs. Handles cycles via a visited set.
 *
 * @param assignedRoles - The role IDs directly assigned to the subject
 * @param allRoles      - All role definitions (needed for inheritance lookup)
 * @returns All effective role IDs (assigned + inherited)
 */
export function resolveEffectiveRoles(assignedRoles: string[], allRoles: Role[]): string[] {
  const rolesMap = new Map(allRoles.map((r) => [r.id, r]))
  const effective = new Set<string>()

  function walk(roleId: string) {
    if (effective.has(roleId)) return
    effective.add(roleId)
    const role = rolesMap.get(roleId)
    for (const parent of role?.inherits ?? []) {
      walk(parent)
    }
  }

  for (const r of assignedRoles) walk(r)
  return [...effective]
}
