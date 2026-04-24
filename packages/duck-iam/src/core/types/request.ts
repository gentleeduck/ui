import type { Attributes, AttributeValue } from './primitives'

/**
 * A role assignment scoped to a specific tenant, organization, or workspace.
 *
 * Used in multi-tenant applications where a user may hold different roles
 * in different scopes (e.g. `'editor'` in `'org-acme'` but `'viewer'` in `'org-globex'`).
 *
 * @template TRole  - Union of valid role strings
 * @template TScope - Union of valid scope strings
 */
export interface ScopedRole<TRole extends string = string, TScope extends string = string> {
  /** The role ID. */
  readonly role: TRole
  /** The scope this role assignment is restricted to. */
  readonly scope?: TScope
}

/**
 * The authenticated user or service making the access request.
 *
 * The engine resolves a subject from its adapter using `resolveSubject(subjectId)`,
 * which loads role assignments, resolves inheritance, and fetches attributes.
 *
 * @template TRole  - Union of valid role strings
 * @template TScope - Union of valid scope strings
 */
export interface Subject<TRole extends string = string, TScope extends string = string> {
  /** Unique identifier for the subject (e.g. user ID, service account ID). */
  readonly id: string
  /** Flat list of effective roles (after inheritance resolution). */
  readonly roles: readonly TRole[]
  /** Scoped role assignments for multi-tenant authorization. */
  readonly scopedRoles?: readonly ScopedRole<TRole, TScope>[]
  /** Subject attributes available to conditions (e.g. `{ department: 'engineering', status: 'active' }`). */
  readonly attributes: Readonly<Attributes>
}

/**
 * The target resource being accessed.
 *
 * @template TResource - Union of valid resource type strings
 */
export interface Resource<TResource extends string = string> {
  /** The resource type (e.g. `'post'`, `'comment'`, `'dashboard'`). */
  readonly type: TResource
  /** Optional specific resource instance ID (e.g. `'post-123'`). */
  readonly id?: string
  /** Resource attributes available to conditions (e.g. `{ ownerId: 'user-1', status: 'published' }`). */
  readonly attributes: Readonly<Attributes>
}

/**
 * Contextual environment data available to conditions.
 *
 * Contains request-level context that is not specific to the subject or resource,
 * such as the client IP, user agent, or current time. Custom properties can be
 * added via the string index signature.
 */
export interface Environment {
  /** Client IP address. */
  readonly ip?: string
  /** Client user agent string. */
  readonly userAgent?: string
  /** Request timestamp in milliseconds since epoch. */
  readonly timestamp?: number
  /** Additional environment properties accessible to conditions. */
  readonly [key: string]: AttributeValue | undefined
}

/**
 * A complete authorization request passed to the engine for evaluation.
 *
 * Combines the subject, action, resource, optional scope, and optional
 * environment into a single object that the engine evaluates against
 * all policies and roles.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export interface AccessRequest<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /** The authenticated subject making the request. */
  readonly subject: Subject
  /** The action being performed (e.g. `'read'`, `'update'`, `'delete'`). */
  readonly action: TAction
  /** The target resource being accessed. */
  readonly resource: Resource<TResource>
  /** Optional scope for multi-tenant authorization (e.g. `'org-acme'`). */
  readonly scope?: TScope
  /** Optional environment context (IP, time, feature flags, etc.). */
  readonly environment?: Environment
}
