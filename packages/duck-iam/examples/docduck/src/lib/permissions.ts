import { buildPermissionKey } from '@gentleduck/iam'
import { type AppAction, type AppResource, engine } from './access'

/**
 * Generates a permission map for a user within a specific workspace.
 * The returned keys are simple (e.g. "create:document") without scope prefix,
 * so <Can> and useAccess().can() work without passing scope each time.
 */
export async function getScopedPermissions(userId: string, workspaceId: string) {
  const checks: Array<{ action: AppAction; resource: AppResource }> = [
    { action: 'create', resource: 'document' },
    { action: 'read', resource: 'document' },
    { action: 'update', resource: 'document' },
    { action: 'delete', resource: 'document' },
    { action: 'share', resource: 'document' },
    { action: 'read', resource: 'workspace' },
    { action: 'update', resource: 'workspace' },
    { action: 'delete', resource: 'workspace' },
    { action: 'manage', resource: 'member' },
    { action: 'read', resource: 'member' },
  ]

  const map: Record<string, boolean> = {}

  for (const { action, resource } of checks) {
    const allowed = await engine.can(userId, action, { type: resource, attributes: {} }, undefined, workspaceId)
    const key = buildPermissionKey(action, resource)
    map[key] = allowed
  }

  return map
}
