import type { AccessRequest, Adapter, Attributes, Decision, Mode, Policy, Role } from '../types'

/**
 * Administrative interface for managing policies, roles, and subject data.
 *
 * Accessed via `engine.admin`. All mutation methods automatically invalidate
 * the relevant engine caches.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export interface EngineAdmin<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
> {
  /** Returns all stored policies. */
  listPolicies(): Promise<Policy<TAction, TResource, TRole>[]>
  /** Returns a single policy by ID, or `null` if not found. */
  getPolicy(id: string): Promise<Policy<TAction, TResource, TRole> | null>
  /** Creates or updates a policy. Invalidates the policy cache. */
  savePolicy(policy: Policy<TAction, TResource, TRole>): Promise<void>
  /** Deletes a policy by ID. Invalidates the policy cache. */
  deletePolicy(id: string): Promise<void>
  /** Returns all stored roles. */
  listRoles(): Promise<Role<TAction, TResource, TRole, TScope>[]>
  /** Returns a single role by ID, or `null` if not found. */
  getRole(id: string): Promise<Role<TAction, TResource, TRole, TScope> | null>
  /** Creates or updates a role. Invalidates role and subject caches. */
  saveRole(role: Role<TAction, TResource, TRole, TScope>): Promise<void>
  /** Deletes a role by ID. Invalidates role and subject caches. */
  deleteRole(id: string): Promise<void>
  /** Assigns a role to a subject. Invalidates that subject's cache entry. */
  assignRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  /** Revokes a role from a subject. Invalidates that subject's cache entry. */
  revokeRole(subjectId: string, roleId: TRole, scope?: TScope): Promise<void>
  /** Sets the attribute bag for a subject. Invalidates that subject's cache entry. */
  setAttributes(subjectId: string, attrs: Attributes): Promise<void>
  /** Returns the attribute bag for a subject. */
  getAttributes(subjectId: string): Promise<Attributes>
}

/**
 * Lifecycle hooks for the authorization engine.
 *
 * Hooks let you observe or transform requests and decisions without modifying
 * the engine's core evaluation logic. Common uses include audit logging,
 * metrics collection, request enrichment, and alerting on denials.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export interface EngineHooks<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /**
   * Called before policy evaluation. May return a modified request.
   * Use this to enrich the request with additional context (e.g. IP address,
   * feature flags) or to normalize fields.
   */
  beforeEvaluate?(
    request: AccessRequest<TAction, TResource, TScope>,
  ): AccessRequest<TAction, TResource, TScope> | Promise<AccessRequest<TAction, TResource, TScope>>
  /**
   * Called after every evaluation with the final decision.
   * Use this for audit logging or metrics collection.
   */
  afterEvaluate?(request: AccessRequest<TAction, TResource, TScope>, decision: Decision): void | Promise<void>
  /**
   * Called only when a request is denied.
   * Use this for alerting, rate limiting, or security monitoring.
   */
  onDeny?(request: AccessRequest<TAction, TResource, TScope>, decision: Decision): void | Promise<void>
  /**
   * Called when an error occurs during evaluation.
   * The engine returns a deny decision after calling this hook.
   */
  onError?(error: Error, request: AccessRequest<TAction, TResource, TScope>): void | Promise<void>
}

/**
 * Configuration for creating an {@link Engine} instance.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TRole     - Union of valid role strings
 * @template TScope    - Union of valid scope strings
 */
export interface EngineConfig<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
  TMode extends Mode = 'development',
> {
  /** The storage adapter that provides policies, roles, and subject data. */
  readonly adapter: Adapter<TAction, TResource, TRole, TScope>
  /** The default effect when no rule matches. Defaults to `'deny'`. */
  readonly defaultEffect?: 'allow' | 'deny'
  /** Cache time-to-live in seconds. Defaults to `60`. Set to `0` to disable caching. */
  readonly cacheTTL?: number
  /** Maximum number of entries in the subject cache. Defaults to `1000`. */
  readonly maxCacheSize?: number
  /** Lifecycle hooks for observing or transforming requests and decisions. */
  readonly hooks?: EngineHooks<TAction, TResource, TScope>
  /** Engine execution mode. `'development'` (default) returns rich Decision objects; `'production'` returns plain booleans. */
  readonly mode?: TMode
}
