/**
 * Builds a permission map key from action, resource, optional resourceId, and optional scope.
 *
 * Format:
 *   - "action:resource"
 *   - "action:resource:resourceId"
 *   - "scope:action:resource"
 *   - "scope:action:resource:resourceId"
 *
 * Escapes inputs containing `:` or `\` (`:` -> `\:`, `\` -> `\\`) so the
 * resulting key stays unambiguous. Passes inputs without those characters
 * through unchanged for readability.
 *
 * @param action - Identifies the action (for example `'read'`).
 * @param resource - Identifies the resource (for example `'document'`).
 * @param resourceId - Optionally pins the key to a concrete resource instance.
 * @param scope - Optionally prefixes a scope for tenant or namespace partitioning.
 * @returns Composed colon-delimited key with hostile segments escaped.
 * @example
 * ```ts
 * buildPermissionKey('read', 'document')              // 'read:document'
 * buildPermissionKey('write', 'doc', 'doc_42')        // 'write:doc:doc_42'
 * buildPermissionKey('read', 'doc', 'doc_1', 'tenant_a')
 * // 'tenant_a:read:doc:doc_1'
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function buildPermissionKey(action: string, resource: string, resourceId?: string, scope?: string): string {
  const e = escapeSegment
  if (scope) {
    return resourceId
      ? `${e(scope)}:${e(action)}:${e(resource)}:${e(resourceId)}`
      : `${e(scope)}:${e(action)}:${e(resource)}`
  }
  return resourceId ? `${e(action)}:${e(resource)}:${e(resourceId)}` : `${e(action)}:${e(resource)}`
}

function escapeSegment(s: string): string {
  if (!s.includes(':') && !s.includes('\\')) return s
  return s.replace(/\\/g, '\\\\').replace(/:/g, '\\:')
}
