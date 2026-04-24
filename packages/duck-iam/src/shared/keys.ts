/**
 * Build a permission map key from action, resource, optional resourceId, and optional scope.
 *
 * Format:
 *   - "action:resource"
 *   - "action:resource:resourceId"
 *   - "scope:action:resource"
 *   - "scope:action:resource:resourceId"
 */
export function buildPermissionKey(action: string, resource: string, resourceId?: string, scope?: string): string {
  if (scope) {
    return resourceId ? `${scope}:${action}:${resource}:${resourceId}` : `${scope}:${action}:${resource}`
  }
  return resourceId ? `${action}:${resource}:${resourceId}` : `${action}:${resource}`
}
