/**
 * A compound string key that uniquely identifies a permission check result.
 *
 * Used as keys in {@link PermissionMap}. The format varies based on whether
 * a scope and/or resource ID are present:
 *
 * - `action:resource` (e.g. `'read:post'`)
 * - `action:resource:resourceId` (e.g. `'update:post:post-123'`)
 * - `scope:action:resource` (e.g. `'org-acme:read:post'`)
 * - `scope:action:resource:resourceId` (e.g. `'org-acme:update:post:post-123'`)
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export type PermissionKey<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> =
  | `${TAction}:${TResource}`
  | `${TAction}:${TResource}:${string}`
  | `${TScope}:${TAction}:${TResource}`
  | `${TScope}:${TAction}:${TResource}:${string}`

/**
 * A map from {@link PermissionKey} strings to boolean results.
 *
 * Returned by `engine.permissions()` after batch-checking multiple permissions
 * for a single subject.
 *
 * @example
 * ```ts
 * const perms = await engine.permissions('user-1', checks)
 * // { 'read:post': true, 'update:post:post-1': false, ... }
 * ```
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export type PermissionMap<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> = Record<PermissionKey<TAction, TResource, TScope>, boolean>

/**
 * A single permission check descriptor for batch evaluation.
 *
 * Pass an array of these to `engine.permissions()` or `access.checks()` to
 * evaluate multiple permissions in a single call. Each check specifies the
 * action, resource, and optionally a resource ID and scope.
 *
 * @example
 * ```ts
 * const checks: PermissionCheck[] = [
 *   { action: 'read', resource: 'post' },
 *   { action: 'update', resource: 'post', resourceId: 'post-123' },
 *   { action: 'manage', resource: 'dashboard', scope: 'org-acme' },
 * ]
 * ```
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export interface PermissionCheck<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /** The action to check. */
  readonly action: TAction
  /** The resource type to check. */
  readonly resource: TResource
  /** Optional specific resource instance ID. */
  readonly resourceId?: string
  /** Optional scope for multi-tenant checks. */
  readonly scope?: TScope
}
