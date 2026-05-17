import type { AccessControl, Adapter, Primitives, Request } from '../types'
import type { EngineTypes } from './engine.types'

/**
 * Recursively freeze a policy's rules, condition groups, and condition leaves.
 *
 * The RBAC policy is shared across every evaluation, so any consumer that
 * mutates `policy.rules[0].actions` would silently corrupt subsequent
 * requests. Shallow `Object.freeze(rules)` only protects the array - not the
 * rule objects or their nested condition trees. This helper covers all
 * paths.
 *
 * @template TPolicy - Specific policy shape, preserved on return.
 *
 * @param policy - The policy to freeze in place.
 * @returns The same policy reference, frozen at every level.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function deepFreezePolicy<TPolicy extends AccessControl.IPolicy>(policy: TPolicy): TPolicy {
  for (const rule of policy.rules) {
    if (Array.isArray(rule.actions)) Object.freeze(rule.actions)
    if (Array.isArray(rule.resources)) Object.freeze(rule.resources)
    if (rule.conditions) freezeConditionGroup(rule.conditions)
    Object.freeze(rule)
  }
  Object.freeze(policy.rules)
  return Object.freeze(policy)
}

function freezeConditionGroup(group: AccessControl.IConditionGroup): void {
  const obj = group as Record<
    'all' | 'any' | 'none',
    ReadonlyArray<AccessControl.ICondition | AccessControl.IConditionGroup> | undefined
  >
  for (const key of ['all', 'any', 'none'] as const) {
    const arr = obj[key]
    if (!Array.isArray(arr)) continue
    for (const item of arr) {
      if ('field' in item) Object.freeze(item)
      else freezeConditionGroup(item)
    }
    Object.freeze(arr)
  }
  Object.freeze(group)
}
/**
 * Enrich a subject's roles with scoped role assignments matching the request scope.
 *
 * If a user has role `'editor'` scoped to `'org-1'` and the request scope is `'org-1'`,
 * `'editor'` is added to `subject.roles` for this evaluation. Returns the original
 * subject unchanged when no scoped roles match.
 *
 * @template TScope - Union of valid scope strings.
 *
 * @param subject - The resolved subject with potential scoped role assignments
 * @param scope   - The scope to match against scoped role assignments
 * @returns A new subject with merged roles, or the original subject if no matches
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function enrichSubjectWithScopedRoles<TScope extends string = string>(
  subject: Request.ISubject,
  scope: TScope | undefined,
): Request.ISubject {
  if (scope == null || !subject.scopedRoles?.length) return subject

  const extraRoles = subject.scopedRoles.filter((sr) => sr.scope === scope).map((sr) => sr.role)

  if (extraRoles.length === 0) return subject

  const mergedRoles = [...new Set([...subject.roles, ...extraRoles])]
  return { ...subject, roles: mergedRoles }
}

/**
 * Create an {@link EngineTypes.IAdmin} instance that delegates storage operations to the
 * given adapter and invalidates the engine's caches after mutations.
 *
 * @template TAction   - Union of valid action strings.
 * @template TResource - Union of valid resource strings.
 * @template TRole     - Union of valid role IDs.
 * @template TScope    - Union of valid scope strings.
 *
 * @param adapter - The storage adapter for policies, roles, and subject data
 * @param engine  - The engine instance whose caches should be invalidated on writes
 * @returns An {@link EngineTypes.IAdmin} object wired to the adapter and engine
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createAdmin<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  adapter: Adapter.IAdapter<TAction, TResource, TRole, TScope>,
  engine: {
    invalidatePolicies(): void
    invalidateRoles(roleId?: TRole): void
    invalidateSubject(subjectId: string): void
  },
): EngineTypes.IAdmin<TAction, TResource, TRole, TScope> {
  return {
    async listPolicies() {
      return adapter.listPolicies()
    },
    async getPolicy(id: string) {
      return adapter.getPolicy(id)
    },
    async savePolicy(policy: AccessControl.IPolicy<TAction, TResource, TRole>) {
      await adapter.savePolicy(policy)
      engine.invalidatePolicies()
    },
    async deletePolicy(id: string) {
      await adapter.deletePolicy(id)
      engine.invalidatePolicies()
    },
    async listRoles() {
      return adapter.listRoles()
    },
    async getRole(id: string) {
      return adapter.getRole(id)
    },
    async saveRole(role: AccessControl.IRole<TAction, TResource, TRole, TScope>) {
      await adapter.saveRole(role)
      engine.invalidateRoles(role.id)
    },
    async deleteRole(id: string) {
      await adapter.deleteRole(id)
      engine.invalidateRoles(id as TRole)
    },
    async assignRole(subjectId: string, roleId: TRole, scope?: TScope) {
      await adapter.assignRole(subjectId, roleId, scope)
      engine.invalidateSubject(subjectId)
    },
    async revokeRole(subjectId: string, roleId: TRole, scope?: TScope) {
      await adapter.revokeRole(subjectId, roleId, scope)
      engine.invalidateSubject(subjectId)
    },
    async setAttributes(subjectId: string, attrs: Primitives.Attributes) {
      await adapter.setSubjectAttributes(subjectId, attrs)
      engine.invalidateSubject(subjectId)
    },
    async getAttributes(subjectId: string) {
      return adapter.getSubjectAttributes(subjectId)
    },
    async export(): Promise<EngineTypes.ISnapshot<TAction, TResource, TRole, TScope>> {
      const [policies, roles] = await Promise.all([adapter.listPolicies(), adapter.listRoles()])
      return {
        schemaVersion: 1 as const,
        exportedAt: new Date().toISOString(),
        policies,
        roles,
      }
    },
    async import(
      snapshot: EngineTypes.ISnapshot<TAction, TResource, TRole, TScope>,
      options: EngineTypes.IImportOptions = {},
    ): Promise<EngineTypes.IImportResult> {
      if (snapshot?.schemaVersion !== 1) {
        throw new Error(
          `duck-iam: unsupported snapshot schemaVersion ${(snapshot as { schemaVersion?: unknown })?.schemaVersion}; expected 1`,
        )
      }
      const mode = options.mode ?? 'merge'
      let policiesDeleted = 0
      let rolesDeleted = 0
      if (mode === 'replace') {
        const [existingPolicies, existingRoles] = await Promise.all([adapter.listPolicies(), adapter.listRoles()])
        const incomingPolicyIds = new Set(snapshot.policies.map((p) => p.id))
        const incomingRoleIds = new Set(snapshot.roles.map((r) => r.id))
        for (const p of existingPolicies) {
          if (!incomingPolicyIds.has(p.id)) {
            await adapter.deletePolicy(p.id)
            policiesDeleted++
          }
        }
        for (const r of existingRoles) {
          if (!incomingRoleIds.has(r.id)) {
            await adapter.deleteRole(r.id)
            rolesDeleted++
          }
        }
      }
      for (const p of snapshot.policies) await adapter.savePolicy(p)
      for (const r of snapshot.roles) await adapter.saveRole(r)
      // Bulk write touched every cache; invalidate once instead of per-row.
      engine.invalidatePolicies()
      engine.invalidateRoles()
      return {
        policiesAdded: snapshot.policies.length,
        policiesDeleted,
        rolesAdded: snapshot.roles.length,
        rolesDeleted,
      }
    },
  }
}
