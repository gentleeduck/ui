import type { Adapter, Attributes, Policy, Role, Subject } from '../types'
import type { EngineAdmin } from './engine.types'

/**
 * Enrich a subject's roles with scoped role assignments matching the request scope.
 *
 * If a user has role `'editor'` scoped to `'org-1'` and the request scope is `'org-1'`,
 * `'editor'` is added to `subject.roles` for this evaluation. Returns the original
 * subject unchanged when no scoped roles match.
 *
 * @param subject - The resolved subject with potential scoped role assignments
 * @param scope   - The scope to match against scoped role assignments
 * @returns A new subject with merged roles, or the original subject if no matches
 */
export function enrichSubjectWithScopedRoles<TScope extends string = string>(
  subject: Subject,
  scope: TScope | undefined,
): Subject {
  if (scope == null || !subject.scopedRoles?.length) return subject

  const extraRoles = subject.scopedRoles.filter((sr) => sr.scope === scope).map((sr) => sr.role)

  if (extraRoles.length === 0) return subject

  const mergedRoles = [...new Set([...subject.roles, ...extraRoles])]
  return { ...subject, roles: mergedRoles }
}

/**
 * Create an {@link EngineAdmin} instance that delegates storage operations to the
 * given adapter and invalidates the engine's caches after mutations.
 *
 * @param adapter - The storage adapter for policies, roles, and subject data
 * @param engine  - The engine instance whose caches should be invalidated on writes
 * @returns An {@link EngineAdmin} object wired to the adapter and engine
 */
export function createAdmin<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  adapter: Adapter<TAction, TResource, TRole, TScope>,
  engine: {
    invalidatePolicies(): void
    invalidateRoles(): void
    invalidateSubject(subjectId: string): void
  },
): EngineAdmin<TAction, TResource, TRole, TScope> {
  return {
    async listPolicies() {
      return adapter.listPolicies()
    },
    async getPolicy(id: string) {
      return adapter.getPolicy(id)
    },
    async savePolicy(policy: Policy<TAction, TResource, TRole>) {
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
    async saveRole(role: Role<TAction, TResource, TRole, TScope>) {
      await adapter.saveRole(role)
      engine.invalidateRoles()
    },
    async deleteRole(id: string) {
      await adapter.deleteRole(id)
      engine.invalidateRoles()
    },
    async assignRole(subjectId: string, roleId: TRole, scope?: TScope) {
      await adapter.assignRole(subjectId, roleId, scope)
      engine.invalidateSubject(subjectId)
    },
    async revokeRole(subjectId: string, roleId: TRole, scope?: TScope) {
      await adapter.revokeRole(subjectId, roleId, scope)
      engine.invalidateSubject(subjectId)
    },
    async setAttributes(subjectId: string, attrs: Attributes) {
      await adapter.setSubjectAttributes(subjectId, attrs)
      engine.invalidateSubject(subjectId)
    },
    async getAttributes(subjectId: string) {
      return adapter.getSubjectAttributes(subjectId)
    },
  }
}
