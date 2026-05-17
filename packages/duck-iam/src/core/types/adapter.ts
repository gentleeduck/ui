import type { AccessControl, Primitives, Request } from '.'
export namespace Adapter {
  /**
   * Optional read-time cancellation token. The engine creates a controller per
   * adapter call and triggers `abort()` on its timeout. Adapters that can honor
   * cancellation (HttpAdapter via `fetch(url, {signal})`, Redis via `RESET`,
   * etc.) should plumb this through; adapters that can't (in-memory, file)
   * may ignore it - the engine still releases the request thread on timeout.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IReadOptions {
    readonly signal?: AbortSignal
  }

  /**
   * Storage interface for ABAC policies.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TRole     - Union of valid role IDs (target roles).
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPolicyStore<
    TAction extends string = string,
    TResource extends string = string,
    TRole extends string = string,
  > {
    /** Returns all stored policies. Called by the engine on cache miss. */
    listPolicies(opts?: IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole>[]>
    /** Returns a single policy by ID, or `null` if not found. */
    getPolicy(id: string, opts?: IReadOptions): Promise<AccessControl.IPolicy<TAction, TResource, TRole> | null>
    /** Engine invalidates its policy cache after this call. */
    savePolicy(policy: AccessControl.IPolicy<TAction, TResource, TRole>): Promise<void>
    /** Engine invalidates its policy cache after this call. */
    deletePolicy(id: string): Promise<void>
  }

  /**
   * Storage interface for RBAC roles.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TRole     - Union of valid role IDs.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IRoleStore<
    TAction extends string = string,
    TResource extends string = string,
    TRole extends string = string,
    TScope extends string = string,
  > {
    /** Returns all stored roles. Called by the engine on cache miss. */
    listRoles(opts?: IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope>[]>
    /** Returns a single role by ID, or `null` if not found. */
    getRole(id: string, opts?: IReadOptions): Promise<AccessControl.IRole<TAction, TResource, TRole, TScope> | null>
    /** Engine invalidates its role cache after this call. */
    saveRole(role: AccessControl.IRole<TAction, TResource, TRole, TScope>): Promise<void>
    /** Engine invalidates its role cache after this call. */
    deleteRole(id: string): Promise<void>
  }

  /**
   * Storage interface for subject (user) data: role assignments and attributes.
   *
   * @template TRole  - Union of valid role IDs.
   * @template TScope - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ISubjectStore<TRole extends string = string, TScope extends string = string> {
    /** Returns the flat list of role IDs assigned to a subject. */
    getSubjectRoles(subjectId: string, opts?: IReadOptions): Promise<TRole[]>
    /** Scoped role assignments. Optional - only when multi-tenant scoped roles are in use. */
    getSubjectScopedRoles?(subjectId: string, opts?: IReadOptions): Promise<Request.IScopedRole<TRole, TScope>[]>
    /** Assigns a role to a subject, optionally within a scope. */
    assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
    /** Revokes a role from a subject, optionally within a scope. */
    revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
    /** Returns the attribute bag for a subject. */
    getSubjectAttributes(subjectId: string, opts?: IReadOptions): Promise<Primitives.Attributes>
    /**
     * Merges `attrs` into the subject's existing attribute bag (shallow per-key
     * overwrite). Set a key to `null` to clear it. Implementations must not drop
     * keys absent from `attrs`.
     */
    setSubjectAttributes(subjectId: string, attrs: Primitives.Attributes): Promise<void>
  }

  /**
   * Combined storage interface: policies + roles + subjects.
   * Expected by the {@link Engine} constructor via `EngineTypes.IConfig.adapter`.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TRole     - Union of valid role IDs.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAdapter<
    TAction extends string = string,
    TResource extends string = string,
    TRole extends string = string,
    TScope extends string = string,
  > extends IPolicyStore<TAction, TResource, TRole>,
      IRoleStore<TAction, TResource, TRole, TScope>,
      ISubjectStore<TRole, TScope> {}
}
