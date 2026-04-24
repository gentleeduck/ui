/**
 * Framework-agnostic client-side access control.
 *
 * Use when you don't use React/Vue, or for Web Components,
 * Svelte, Solid, Angular, or vanilla JS.
 *
 * Usage:
 *
 *   import { AccessClient } from "duck-iam/client/vanilla";
 *
 *   // Initialize from server-provided permissions
 *   const access = new AccessClient(permissionsFromServer);
 *
 *   // Check
 *   access.can("delete", "post");                    // boolean
 *   access.can("manage", "user", undefined, "admin"); // scoped check
 *   access.cannot("manage", "billing");               // boolean
 *
 *   // With change listener (for reactive frameworks)
 *   access.subscribe((perms) => { rerender(); });
 *   access.update(newPermissions);
 *
 *   // Or fetch from server
 *   const access = await AccessClient.fromServer("/api/permissions", {
 *     headers: { Authorization: "Bearer ..." },
 *   });
 */

import type { PermissionMap } from '../../core/types'
import { buildPermissionKey } from '../../shared/keys'

/** Callback invoked when permissions are updated via {@link AccessClient.update} or {@link AccessClient.merge}. */
type Listener<TAction extends string = string, TResource extends string = string, TScope extends string = string> = (
  permissions: PermissionMap<TAction, TResource, TScope>,
) => void

/**
 * Framework-agnostic client-side access control.
 *
 * Wraps a {@link PermissionMap} (typically fetched from the server) and provides
 * simple `.can()` / `.cannot()` checks. Supports reactive updates via `.subscribe()`.
 *
 * @template TAction   - Union of valid action strings
 * @template TResource - Union of valid resource strings
 * @template TScope    - Union of valid scope strings
 */
export class AccessClient<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  private _permissions: PermissionMap<TAction, TResource, TScope>
  private _listeners = new Set<Listener<TAction, TResource, TScope>>()

  /** @param permissions - Initial permission map (optional, can be set later via `.update()`). */
  constructor(permissions?: PermissionMap<TAction, TResource, TScope>) {
    this._permissions = permissions ?? ({} as PermissionMap<TAction, TResource, TScope>)
  }

  /** Fetch permissions from a server endpoint */
  static async fromServer<TA extends string = string, TR extends string = string, TS extends string = string>(
    url: string,
    init?: RequestInit,
  ): Promise<AccessClient<TA, TR, TS>> {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    })
    if (!res.ok) throw new Error(`Failed to fetch permissions: ${res.status}`)
    const perms: PermissionMap<TA, TR, TS> = await res.json()
    return new AccessClient<TA, TR, TS>(perms)
  }

  /** Returns a readonly view of the current permission map. */
  get permissions(): Readonly<PermissionMap<TAction, TResource, TScope>> {
    return this._permissions
  }

  /** Returns `true` if the permission map grants the specified action on the resource. */
  can(action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean {
    const key = buildPermissionKey(action, resource, resourceId, scope)
    return (this._permissions as Record<string, boolean>)[key] ?? false
  }

  /** Returns `true` if the permission map does NOT grant the specified action on the resource. */
  cannot(action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean {
    return !this.can(action, resource, resourceId, scope)
  }

  /** Update permissions and notify listeners */
  update(permissions: PermissionMap<TAction, TResource, TScope>): void {
    this._permissions = permissions
    for (const fn of this._listeners) {
      try {
        fn(permissions)
      } catch {
        // Listener errors must not prevent other listeners from being notified
      }
    }
  }

  /** Merge new permissions into existing */
  merge(permissions: PermissionMap<TAction, TResource, TScope>): void {
    this.update({ ...this._permissions, ...permissions })
  }

  /** Subscribe to permission changes. Returns unsubscribe function. */
  subscribe(fn: Listener<TAction, TResource, TScope>): () => void {
    this._listeners.add(fn)
    return () => this._listeners.delete(fn)
  }

  /**
   * Get all allowed actions for a resource type.
   *
   * Handles all key formats:
   *   - "action:resource" (2 parts)
   *   - "action:resource:resourceId" (3 parts)
   *   - "scope:action:resource" (3 parts)
   *   - "scope:action:resource:resourceId" (4 parts)
   */
  allowedActions(resource: TResource): TAction[] {
    const actions: TAction[] = []
    for (const [key, allowed] of Object.entries(this._permissions)) {
      if (!allowed) continue
      const action = extractAction(key, resource)
      if (action) actions.push(action as TAction)
    }
    return [...new Set(actions)]
  }

  /** Check if the user has any permission on a resource */
  hasAnyOn(resource: TResource): boolean {
    return Object.entries(this._permissions).some(([key, allowed]) => {
      if (!allowed) return false
      return extractAction(key, resource) !== null
    })
  }
}

/**
 * Extract the action from a permission key for a given resource.
 *
 * Key formats (from buildPermissionKey):
 *   "action:resource"
 *   "action:resource:resourceId"
 *   "scope:action:resource"
 *   "scope:action:resource:resourceId"
 *
 * Rather than guessing the format from part count (ambiguous for 3 parts),
 * we check if the resource appears at the expected position for each format.
 */
function extractAction(key: string, resource: string): string | null {
  const parts = key.split(':')

  switch (parts.length) {
    case 2:
      // action:resource
      if (parts[1] === resource) return parts[0] as string
      return null
    case 3:
      // Could be action:resource:resourceId OR scope:action:resource
      // Check both: resource at index 1 (unscoped) or index 2 (scoped)
      if (parts[1] === resource) return parts[0] as string
      if (parts[2] === resource) return parts[1] as string
      return null
    case 4:
      // scope:action:resource:resourceId
      if (parts[2] === resource) return parts[1] as string
      return null
    default:
      return null
  }
}
