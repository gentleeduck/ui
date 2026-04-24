import type { Policy, Role } from './access-control'
import type { Attributes } from './primitives'
import type { ScopedRole } from './request'

/**
 * Storage interface for ABAC policies.
 *
 * Implement this to persist policies in your database, key-value store,
 * or any other backend. The engine calls these methods to load and
 * manage policies at runtime.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 */
export interface PolicyStore<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
> {
  /** Returns all stored policies. Called by the engine on cache miss. */
  listPolicies(): Promise<Policy<TAction, TResource, TRole>[]>
  /** Returns a single policy by ID, or `null` if not found. */
  getPolicy(id: string): Promise<Policy<TAction, TResource, TRole> | null>
  /** Creates or updates a policy. The engine invalidates its policy cache after this call. */
  savePolicy(policy: Policy<TAction, TResource, TRole>): Promise<void>
  /** Deletes a policy by ID. The engine invalidates its policy cache after this call. */
  deletePolicy(id: string): Promise<void>
}

/**
 * Storage interface for RBAC roles.
 *
 * Implement this to persist role definitions. The engine loads roles to
 * resolve inheritance chains and convert them into ABAC rules via `rolesToPolicy()`.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export interface RoleStore<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> {
  /** Returns all stored roles. Called by the engine on cache miss. */
  listRoles(): Promise<Role<TAction, TResource, TRole, TScope>[]>
  /** Returns a single role by ID, or `null` if not found. */
  getRole(id: string): Promise<Role<TAction, TResource, TRole, TScope> | null>
  /** Creates or updates a role. The engine invalidates its role cache after this call. */
  saveRole(role: Role<TAction, TResource, TRole, TScope>): Promise<void>
  /** Deletes a role by ID. The engine invalidates its role cache after this call. */
  deleteRole(id: string): Promise<void>
}

/**
 * Storage interface for subject (user) data: role assignments and attributes.
 *
 * Implement this to connect duck-iam to your user database. The engine calls
 * `getSubjectRoles` and `getSubjectAttributes` when resolving a subject for
 * authorization checks.
 *
 * @template TRole  - Union of valid role strings
 * @template TScope - Union of valid scope strings
 */
export interface SubjectStore<TRole extends string = string, TScope extends string = string> {
  /** Returns the flat list of role IDs assigned to a subject. */
  getSubjectRoles(subjectId: string): Promise<TRole[]>
  /**
   * Returns scoped role assignments for a subject.
   * Optional -- only needed if your app uses multi-tenant scoped roles.
   */
  getSubjectScopedRoles?(subjectId: string): Promise<ScopedRole<TRole, TScope>[]>
  /** Assigns a role to a subject, optionally within a scope. */
  assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  /** Revokes a role from a subject, optionally within a scope. */
  revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  /** Returns the attribute bag for a subject. */
  getSubjectAttributes(subjectId: string): Promise<Attributes>
  /** Replaces the attribute bag for a subject. */
  setSubjectAttributes(subjectId: string, attrs: Attributes): Promise<void>
}

/**
 * Combined storage interface that provides all three stores: policies, roles, and subjects.
 *
 * This is the interface the {@link Engine} constructor expects via `EngineConfig.adapter`.
 * The built-in `MemoryAdapter` implements this interface. For production, implement
 * each store method backed by your database.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export interface Adapter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> extends PolicyStore<TAction, TResource, TRole>,
    RoleStore<TAction, TResource, TRole, TScope>,
    SubjectStore<TRole, TScope> {}
