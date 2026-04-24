import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import type { Policy, Role } from '../../types'
import { Engine } from '../engine'

// -- Test setup --

type Action = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'manage'
type ResourceType = 'post' | 'comment' | 'user' | 'dashboard' | 'dashboard.users'
type RoleId = 'viewer' | 'editor' | 'admin' | 'super-admin' | 'org-editor'
type Scope = 'org-1' | 'org-2'

const viewerRole: Role<Action, ResourceType, RoleId, Scope> = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'read', resource: 'comment' },
  ],
}

const editorRole: Role<Action, ResourceType, RoleId, Scope> = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
    { action: 'delete', resource: 'post' },
  ],
}

const adminRole: Role<Action, ResourceType, RoleId, Scope> = {
  id: 'admin',
  name: 'Admin',
  inherits: ['editor'],
  permissions: [{ action: 'manage', resource: '*' as ResourceType }],
}

const superAdminRole: Role<Action, ResourceType, RoleId, Scope> = {
  id: 'super-admin',
  name: 'Super Admin',
  inherits: ['admin'],
  permissions: [{ action: '*' as Action, resource: '*' as ResourceType }],
}

const orgEditorRole: Role<Action, ResourceType, RoleId, Scope> = {
  id: 'org-editor',
  name: 'Org Editor',
  scope: 'org-1',
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
  ],
}

function createEngine(overrides?: { roles?: Role[]; assignments?: Record<string, RoleId[]> }) {
  const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
    roles: (overrides?.roles ?? [viewerRole, editorRole, adminRole, superAdminRole, orgEditorRole]) as Role<
      Action,
      ResourceType,
      RoleId,
      Scope
    >[],
    assignments: overrides?.assignments ?? {
      'user-viewer': ['viewer'] as RoleId[],
      'user-editor': ['editor'] as RoleId[],
      'user-admin': ['admin'] as RoleId[],
      'user-super': ['super-admin'] as RoleId[],
      'user-org-editor': ['org-editor'] as RoleId[],
    },
  })
  return new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
}

describe('Engine.can() - basic RBAC', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = createEngine()
  })

  it('viewer can read posts', async () => {
    expect(await engine.can('user-viewer', 'read', { type: 'post', attributes: {} })).toBe(true)
  })

  it('viewer cannot create posts', async () => {
    expect(await engine.can('user-viewer', 'create', { type: 'post', attributes: {} })).toBe(false)
  })

  it('editor can create, update, delete posts', async () => {
    expect(await engine.can('user-editor', 'create', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-editor', 'update', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-editor', 'delete', { type: 'post', attributes: {} })).toBe(true)
  })

  it('editor inherits viewer permissions (can read)', async () => {
    expect(await engine.can('user-editor', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-editor', 'read', { type: 'comment', attributes: {} })).toBe(true)
  })

  it('editor cannot manage', async () => {
    expect(await engine.can('user-editor', 'manage', { type: 'post', attributes: {} })).toBe(false)
  })

  it('admin inherits editor + viewer permissions', async () => {
    expect(await engine.can('user-admin', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-admin', 'create', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-admin', 'manage', { type: 'post', attributes: {} })).toBe(true)
  })

  it('super-admin wildcard matches any action+resource', async () => {
    expect(await engine.can('user-super', 'publish', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-super', 'delete', { type: 'user', attributes: {} })).toBe(true)
  })

  it('unknown user is denied', async () => {
    expect(await engine.can('user-nobody', 'read', { type: 'post', attributes: {} })).toBe(false)
  })
})

describe('Engine.can() - scoped RBAC', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = createEngine()
  })

  it('org-editor can create posts in their scope', async () => {
    expect(await engine.can('user-org-editor', 'create', { type: 'post', attributes: {} }, undefined, 'org-1')).toBe(
      true,
    )
  })

  it('org-editor cannot create posts in a different scope', async () => {
    expect(await engine.can('user-org-editor', 'create', { type: 'post', attributes: {} }, undefined, 'org-2')).toBe(
      false,
    )
  })

  it('org-editor cannot create posts without a scope', async () => {
    expect(await engine.can('user-org-editor', 'create', { type: 'post', attributes: {} })).toBe(false)
  })
})

describe('Engine.can() - scoped role assignments via assignRole', () => {
  it('user with scoped role assignment can act in that scope', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    // Assign editor role scoped to org-1
    await adapter.assignRole('user-scoped', 'editor', 'org-1')

    // With scope org-1: should have editor permissions
    expect(await engine.can('user-scoped', 'create', { type: 'post', attributes: {} }, undefined, 'org-1')).toBe(true)
    expect(await engine.can('user-scoped', 'read', { type: 'post', attributes: {} }, undefined, 'org-1')).toBe(true)
  })

  it('user with scoped role assignment cannot act in a different scope', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    await adapter.assignRole('user-scoped', 'editor', 'org-1')

    // With scope org-2: should NOT have editor permissions
    expect(await engine.can('user-scoped', 'create', { type: 'post', attributes: {} }, undefined, 'org-2')).toBe(false)
  })

  it('user with scoped role assignment cannot act without a scope', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    await adapter.assignRole('user-scoped', 'editor', 'org-1')

    // Without scope: should NOT have editor permissions
    expect(await engine.can('user-scoped', 'create', { type: 'post', attributes: {} })).toBe(false)
  })

  it('global + scoped roles combine correctly', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    // Global viewer + scoped editor
    await adapter.assignRole('user-mixed', 'viewer')
    await adapter.assignRole('user-mixed', 'editor', 'org-1')

    // Global read works without scope
    expect(await engine.can('user-mixed', 'read', { type: 'post', attributes: {} })).toBe(true)
    // Create requires editor, only works in org-1 scope
    expect(await engine.can('user-mixed', 'create', { type: 'post', attributes: {} }, undefined, 'org-1')).toBe(true)
    expect(await engine.can('user-mixed', 'create', { type: 'post', attributes: {} })).toBe(false)
  })
})

describe('Engine.can() - isOwner conditions with $subject.id', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    const ownerEditorRole: Role<Action, ResourceType, RoleId, Scope> = {
      id: 'editor',
      name: 'Editor',
      inherits: ['viewer'],
      permissions: [
        {
          action: 'update',
          resource: 'post',
          conditions: {
            all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
          },
        },
        {
          action: 'delete',
          resource: 'post',
          conditions: {
            all: [{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }],
          },
        },
      ],
    }

    engine = createEngine({
      roles: [viewerRole, ownerEditorRole],
      assignments: { 'user-editor': ['editor'] as RoleId[] },
    })
  })

  it('owner can update their own post', async () => {
    expect(
      await engine.can('user-editor', 'update', {
        type: 'post',
        id: 'post-1',
        attributes: { ownerId: 'user-editor' },
      }),
    ).toBe(true)
  })

  it("non-owner cannot update someone else's post", async () => {
    expect(
      await engine.can('user-editor', 'update', {
        type: 'post',
        id: 'post-1',
        attributes: { ownerId: 'user-other' },
      }),
    ).toBe(false)
  })

  it('owner can delete their own post', async () => {
    expect(
      await engine.can('user-editor', 'delete', {
        type: 'post',
        id: 'post-1',
        attributes: { ownerId: 'user-editor' },
      }),
    ).toBe(true)
  })
})

describe('Engine.permissions() - batch check', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = createEngine()
  })

  it('returns a PermissionMap with correct boolean values', async () => {
    const map = await engine.permissions('user-editor', [
      { action: 'read', resource: 'post' },
      { action: 'create', resource: 'post' },
      { action: 'manage', resource: 'post' },
      { action: 'publish', resource: 'post' },
    ])

    expect(map['read:post']).toBe(true)
    expect(map['create:post']).toBe(true)
    expect(map['manage:post']).toBe(false)
    expect(map['publish:post']).toBe(false)
  })
})

describe('Engine.check() - detailed decision', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = createEngine()
  })

  it('returns a full Decision object', async () => {
    const decision = await engine.check('user-viewer', 'read', { type: 'post', attributes: {} })
    expect(decision.allowed).toBe(true)
    expect(decision.effect).toBe('allow')
    expect(typeof decision.reason).toBe('string')
    expect(decision.reason.length).toBeGreaterThan(0)
    expect(decision.duration).toBeGreaterThanOrEqual(0)
    expect(decision.timestamp).toBeGreaterThan(0)
  })
})

describe('Engine.admin - CRUD operations', () => {
  it('saveRole / listRoles', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>()
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    await engine.admin.saveRole(viewerRole)
    const roles = await engine.admin.listRoles()
    expect(roles).toHaveLength(1)
    expect(roles[0]).toEqual(viewerRole)
  })

  it('assignRole / revokeRole', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    await engine.admin.assignRole('user-new', 'viewer')
    expect(await engine.can('user-new', 'read', { type: 'post', attributes: {} })).toBe(true)

    await engine.admin.revokeRole('user-new', 'viewer')
    engine.invalidate()
    expect(await engine.can('user-new', 'read', { type: 'post', attributes: {} })).toBe(false)
  })

  it('savePolicy / deletePolicy', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>()
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    const policy: Policy<Action, ResourceType, RoleId> = {
      id: 'test-policy',
      name: 'Test',
      algorithm: 'deny-overrides',
      rules: [],
    }
    await engine.admin.savePolicy(policy)
    const policies = await engine.admin.listPolicies()
    expect(policies).toHaveLength(1)
    expect(policies[0]).toEqual(policy)

    await engine.admin.deletePolicy('test-policy')
    expect(await engine.admin.listPolicies()).toEqual([])
  })

  it('setAttributes / getAttributes', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>()
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })

    await engine.admin.setAttributes('user-1', { department: 'engineering', level: 5 })
    const attrs = await engine.admin.getAttributes('user-1')
    expect(attrs).toEqual({ department: 'engineering', level: 5 })
  })
})

describe('Engine - ABAC policies', () => {
  it('explicit deny policy blocks access', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [editorRole, viewerRole],
      assignments: { 'user-editor': ['editor'] as RoleId[] },
      policies: [
        {
          id: 'deny-weekends',
          name: 'Deny on weekends',
          algorithm: 'deny-overrides',
          rules: [
            {
              id: 'r-deny-all',
              effect: 'deny',
              priority: 100,
              actions: ['*'] as (Action | '*')[],
              resources: ['*'] as (ResourceType | '*')[],
              conditions: { all: [] }, // always matches
            },
          ],
        },
      ],
    })

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
    expect(await engine.can('user-editor', 'read', { type: 'post', attributes: {} })).toBe(false)
  })
})

describe('Engine - per-policy combining algorithm', () => {
  it('allow-overrides policy allows even when deny rule also matches', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
      policies: [
        {
          id: 'allow-overrides-policy',
          name: 'Allow Overrides',
          algorithm: 'allow-overrides',
          rules: [
            {
              id: 'r-deny',
              effect: 'deny',
              priority: 10,
              actions: ['read'] as Action[],
              resources: ['post'] as ResourceType[],
              conditions: { all: [] },
            },
            {
              id: 'r-allow',
              effect: 'allow',
              priority: 10,
              actions: ['read'] as Action[],
              resources: ['post'] as ResourceType[],
              conditions: { all: [] },
            },
          ],
        },
      ],
    })

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
    // With allow-overrides, the allow rule should win
    expect(await engine.can('user-viewer', 'read', { type: 'post', attributes: {} })).toBe(true)
  })

  it('deny-overrides policy denies even when allow rule also matches', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
      policies: [
        {
          id: 'deny-overrides-policy',
          name: 'Deny Overrides',
          algorithm: 'deny-overrides',
          rules: [
            {
              id: 'r-allow',
              effect: 'allow',
              priority: 10,
              actions: ['read'] as Action[],
              resources: ['post'] as ResourceType[],
              conditions: { all: [] },
            },
            {
              id: 'r-deny',
              effect: 'deny',
              priority: 10,
              actions: ['read'] as Action[],
              resources: ['post'] as ResourceType[],
              conditions: { all: [] },
            },
          ],
        },
      ],
    })

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
    // With deny-overrides, the deny rule should win -- blocking access
    expect(await engine.can('user-viewer', 'read', { type: 'post', attributes: {} })).toBe(false)
  })
})

describe('Engine - role inheritance cycle protection', () => {
  it('handles circular inheritance without infinite loop', async () => {
    const roleA: Role<Action, ResourceType, RoleId, Scope> = {
      id: 'viewer' as RoleId,
      name: 'Role A',
      inherits: ['editor'],
      permissions: [{ action: 'read', resource: 'post' }],
    }
    const roleB: Role<Action, ResourceType, RoleId, Scope> = {
      id: 'editor' as RoleId,
      name: 'Role B',
      inherits: ['viewer'],
      permissions: [{ action: 'create', resource: 'post' }],
    }

    const engine = createEngine({
      roles: [roleA, roleB],
      assignments: { 'user-cycle': ['viewer'] as RoleId[] },
    })

    // Should not hang, and should have both permissions
    expect(await engine.can('user-cycle', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-cycle', 'create', { type: 'post', attributes: {} })).toBe(true)
  })
})

describe('Engine - hooks', () => {
  it('beforeEvaluate hook can modify the request', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
    })

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      hooks: {
        beforeEvaluate: (req) => ({
          ...req,
          action: 'read' as Action, // Force action to read
        }),
      },
    })

    // Even though we ask for 'create', the hook changes it to 'read'
    expect(await engine.can('user-viewer', 'create', { type: 'post', attributes: {} })).toBe(true)
  })

  it('onDeny hook is called on denied requests', async () => {
    let denyCalled = false
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
    })

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      hooks: {
        onDeny: () => {
          denyCalled = true
        },
      },
    })

    await engine.can('user-viewer', 'delete', { type: 'post', attributes: {} })
    expect(denyCalled).toBe(true)
  })

  it('onError hook is called on evaluation errors', async () => {
    let errorCaught: Error | null = null
    const brokenAdapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>()
    // Make listPolicies throw
    brokenAdapter.listPolicies = () => {
      throw new Error('DB connection failed')
    }

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter: brokenAdapter,
      cacheTTL: 0,
      hooks: {
        onError: (err) => {
          errorCaught = err
        },
      },
    })

    const result = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    expect(result).toBe(false)
    expect(errorCaught).toBeInstanceOf(Error)
    expect(errorCaught!.message).toBe('DB connection failed')
  })
})

describe('Engine - cache invalidation', () => {
  it('invalidate() clears caches and reflects new data', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter })

    // First check caches the result
    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(true)

    // Assign editor role directly through adapter
    await adapter.assignRole('user-1', 'editor' as RoleId)
    await adapter.saveRole(editorRole)

    // Before invalidation: still using cached subject (only has viewer)
    // After invalidation: should pick up the new role
    engine.invalidate()
    expect(await engine.can('user-1', 'create', { type: 'post', attributes: {} })).toBe(true)
  })
})
