import type { Adapter, Attributes, Policy, Role, ScopedRole } from '../../core/types'

/**
 * Initialization options for the {@link MemoryAdapter}.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export interface MemoryAdapterInit<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> {
  /** Initial policies to seed the adapter with. */
  policies?: Policy<TAction, TResource, TRole>[]
  /** Initial roles to seed the adapter with. */
  roles?: Role<TAction, TResource, TRole, TScope>[]
  /** Initial role assignments, keyed by subject ID. */
  assignments?: Record<string, TRole[]>
  /** Initial subject attributes, keyed by subject ID. */
  attributes?: Record<string, Attributes>
}

/**
 * In-memory implementation of the {@link Adapter} interface.
 *
 * Stores all data in `Map` objects. Useful for testing, prototyping, and
 * applications that do not need persistent storage. For production, implement
 * a database-backed adapter instead.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export class MemoryAdapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> implements Adapter<TAction, TResource, TRole, TScope>
{
  private policies = new Map<string, Policy<TAction, TResource, TRole>>()
  private roles = new Map<string, Role<TAction, TResource, TRole, TScope>>()
  private assignments = new Map<string, Array<{ role: TRole; scope?: TScope }>>()
  private attributes = new Map<string, Attributes>()

  /** Creates a new in-memory adapter, optionally seeded with initial data. */
  constructor(init?: MemoryAdapterInit<TAction, TResource, TRole, TScope>) {
    for (const p of init?.policies ?? []) this.policies.set(p.id, p)
    for (const r of init?.roles ?? []) this.roles.set(r.id, r)
    for (const [uid, roles] of Object.entries(init?.assignments ?? {})) {
      this.assignments.set(
        uid,
        (roles as TRole[]).map((r) => ({ role: r })),
      )
    }
    for (const [uid, attrs] of Object.entries(init?.attributes ?? {})) {
      this.attributes.set(uid, attrs)
    }
  }

  /** Returns all stored policies. */
  async listPolicies(): Promise<Policy<TAction, TResource, TRole>[]> {
    return [...this.policies.values()]
  }

  /** Returns a policy by ID, or `null` if not found. */
  async getPolicy(id: string): Promise<Policy<TAction, TResource, TRole> | null> {
    return this.policies.get(id) ?? null
  }

  /** Creates or overwrites a policy. */
  async savePolicy(p: Policy<TAction, TResource, TRole>): Promise<void> {
    this.policies.set(p.id, p)
  }

  /** Deletes a policy by ID. */
  async deletePolicy(id: string): Promise<void> {
    this.policies.delete(id)
  }

  /** Returns all stored roles. */
  async listRoles(): Promise<Role<TAction, TResource, TRole, TScope>[]> {
    return [...this.roles.values()]
  }

  /** Returns a role by ID, or `null` if not found. */
  async getRole(id: string): Promise<Role<TAction, TResource, TRole, TScope> | null> {
    return this.roles.get(id) ?? null
  }

  /** Creates or overwrites a role. */
  async saveRole(r: Role<TAction, TResource, TRole, TScope>): Promise<void> {
    this.roles.set(r.id, r)
  }

  /** Deletes a role by ID. */
  async deleteRole(id: string): Promise<void> {
    this.roles.delete(id)
  }

  /** Returns the unscoped (global) roles assigned to a subject. */
  async getSubjectRoles(id: string): Promise<TRole[]> {
    const entries = this.assignments.get(id) ?? []
    // Only return unscoped (global) role assignments
    return [...new Set(entries.filter((e) => e.scope == null).map((e) => e.role))]
  }

  /** Returns the scoped role assignments for a subject. */
  async getSubjectScopedRoles(id: string): Promise<ScopedRole<TRole, TScope>[]> {
    return (this.assignments.get(id) ?? [])
      .filter((e) => e.scope != null)
      .map((e) => ({ role: e.role, scope: e.scope as TScope }))
  }

  /** Assigns a role to a subject, optionally within a scope. Duplicate assignments are ignored. */
  async assignRole(id: string, roleId: TRole, scope?: TScope): Promise<void> {
    if (!this.assignments.has(id)) this.assignments.set(id, [])
    const entries = this.assignments.get(id) as Array<{ role: TRole; scope?: TScope }>
    // Prevent duplicate assignments
    if (!entries.some((e) => e.role === roleId && e.scope === scope)) {
      entries.push({ role: roleId, scope })
    }
  }

  /** Revokes a role from a subject, optionally within a specific scope. */
  async revokeRole(id: string, roleId: TRole, scope?: TScope): Promise<void> {
    const entries = this.assignments.get(id)
    if (!entries) return
    const filtered = entries.filter((e) => !(e.role === roleId && e.scope === scope))
    this.assignments.set(id, filtered)
  }

  /** Returns the attributes map for a subject, or an empty object if none exist. */
  async getSubjectAttributes(id: string): Promise<Attributes> {
    return this.attributes.get(id) ?? {}
  }

  /** Merges the given attributes into the subject's existing attributes. */
  async setSubjectAttributes(id: string, attrs: Attributes): Promise<void> {
    this.attributes.set(id, { ...(this.attributes.get(id) ?? {}), ...attrs })
  }
}
