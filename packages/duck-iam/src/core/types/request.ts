import type { Primitives } from './primitives'

export namespace Request {
  /**
   * A role assignment scoped to a tenant, organization, or workspace. Used in
   * multi-tenant applications where a user holds different roles in different
   * scopes (e.g. `editor` in `org-acme`, `viewer` in `org-globex`).
   *
   * @template TRole  - Union of valid role IDs.
   * @template TScope - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IScopedRole<TRole extends string = string, TScope extends string = string> {
    readonly role: TRole
    /** The scope this role assignment is restricted to. */
    readonly scope?: TScope
  }

  /**
   * Authenticated user or service making the access request. Engine resolves a
   * subject from its adapter via `resolveSubject(subjectId)` - loads role
   * assignments, resolves inheritance, fetches attributes.
   *
   * @template TRole  - Union of valid role IDs.
   * @template TScope - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ISubject<TRole extends string = string, TScope extends string = string> {
    /** Unique identifier (user ID, service account ID). */
    readonly id: string
    /** Effective roles after inheritance resolution. */
    readonly roles: readonly TRole[]
    /** Scoped role assignments for multi-tenant authorization. */
    readonly scopedRoles?: readonly IScopedRole<TRole, TScope>[]
    /** Subject attributes available to conditions. */
    readonly attributes: Readonly<Primitives.Attributes>
  }

  /**
   * Target resource being accessed.
   *
   * @template TResource - Union of valid resource type strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IResource<TResource extends string = string> {
    /** Resource type (e.g. `'post'`, `'comment'`, `'dashboard'`). */
    readonly type: TResource
    /** Specific instance ID (e.g. `'post-123'`). */
    readonly id?: string
    /** Resource attributes available to conditions. */
    readonly attributes: Readonly<Primitives.Attributes>
  }

  /**
   * Request-level context not specific to subject or resource - client IP,
   * user agent, timestamp, feature flags, etc. Custom keys allowed via the
   * string index signature.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IEnvironment {
    readonly ip?: string
    readonly userAgent?: string
    /** Request timestamp in milliseconds since epoch. */
    readonly timestamp?: number
    readonly [key: string]: Primitives.AttributeValue | undefined
  }

  /**
   * Complete authorization request passed to the engine for evaluation.
   * Combines subject, action, resource, optional scope, and optional
   * environment into a single object.
   *
   * @template TAction   - Union of valid action strings.
   * @template TResource - Union of valid resource strings.
   * @template TScope    - Union of valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAccessRequest<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > {
    readonly subject: ISubject
    /** Action being performed (e.g. `'read'`, `'update'`, `'delete'`). */
    readonly action: TAction
    readonly resource: IResource<TResource>
    /** Multi-tenant scope (e.g. `'org-acme'`). */
    readonly scope?: TScope
    readonly environment?: IEnvironment
  }
}
