import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import type { AccessControl, Client, Request } from '../../types'
import { Engine } from '../engine'

// -- Test setup --

type Action = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'manage'
type ResourceType = 'post' | 'comment' | 'user' | 'dashboard' | 'dashboard.users'
type RoleId = 'viewer' | 'editor' | 'admin' | 'super-admin' | 'org-editor'
type Scope = 'org-1' | 'org-2'

const viewerRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'read', resource: 'comment' },
  ],
}

const editorRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
    { action: 'delete', resource: 'post' },
  ],
}

const adminRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'admin',
  name: 'Admin',
  inherits: ['editor'],
  permissions: [{ action: 'manage', resource: '*' as ResourceType }],
}

const superAdminRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'super-admin',
  name: 'Super Admin',
  inherits: ['admin'],
  permissions: [{ action: '*' as Action, resource: '*' as ResourceType }],
}

const orgEditorRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'org-editor',
  name: 'Org Editor',
  scope: 'org-1',
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'update', resource: 'post' },
  ],
}

function createEngine(overrides?: { roles?: AccessControl.IRole[]; assignments?: Record<string, RoleId[]> }) {
  const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
    roles: (overrides?.roles ?? [
      viewerRole,
      editorRole,
      adminRole,
      superAdminRole,
      orgEditorRole,
    ]) as AccessControl.IRole<Action, ResourceType, RoleId, Scope>[],
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
    const ownerEditorRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
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

  it('returns a Client.PermissionMap with correct boolean values', async () => {
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

  it('returns a full AccessControl.IDecision object', async () => {
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

    const policy: AccessControl.IPolicy<Action, ResourceType, RoleId> = {
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

  describe('export / import (F2)', () => {
    it('export round-trips through import in merge mode', async () => {
      const policy: AccessControl.IPolicy<Action, ResourceType, RoleId> = {
        id: 'p1',
        name: 'P1',
        algorithm: 'deny-overrides',
        rules: [
          { id: 'r', effect: 'allow', priority: 0, actions: ['read'], resources: ['post'], conditions: { all: [] } },
        ],
      }
      const sourceAdapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
        policies: [policy],
        roles: [viewerRole],
      })
      const sourceEngine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter: sourceAdapter, cacheTTL: 0 })
      const snapshot = await sourceEngine.admin.export()
      expect(snapshot.schemaVersion).toBe(1)
      expect(snapshot.policies).toHaveLength(1)
      expect(snapshot.roles).toHaveLength(1)

      const destAdapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>()
      const destEngine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter: destAdapter, cacheTTL: 0 })
      const result = await destEngine.admin.import(snapshot)
      expect(result.policiesAdded).toBe(1)
      expect(result.rolesAdded).toBe(1)
      expect(result.policiesDeleted).toBe(0)
      expect(result.rolesDeleted).toBe(0)
      expect(await destEngine.admin.listPolicies()).toEqual(snapshot.policies)
      expect(await destEngine.admin.listRoles()).toEqual(snapshot.roles)
    })

    it('replace mode deletes existing rows not present in snapshot', async () => {
      const existingPolicy: AccessControl.IPolicy<Action, ResourceType, RoleId> = {
        id: 'old',
        name: 'old',
        algorithm: 'deny-overrides',
        rules: [],
      }
      const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
        policies: [existingPolicy],
        roles: [viewerRole, editorRole],
      })
      const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
      const snapshot: EngineSnapshot = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        policies: [],
        roles: [viewerRole],
      }
      const result = await engine.admin.import(snapshot, { mode: 'replace' })
      expect(result.policiesDeleted).toBe(1)
      expect(result.rolesDeleted).toBe(1)
      expect(await engine.admin.listPolicies()).toEqual([])
      expect((await engine.admin.listRoles()).map((r) => r.id)).toEqual(['viewer'])
    })

    it('rejects unknown schemaVersion before writing anything', async () => {
      const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
      const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
      const bad = { schemaVersion: 99, exportedAt: '', policies: [], roles: [] } as unknown as EngineSnapshot
      await expect(engine.admin.import(bad)).rejects.toThrow(/schemaVersion/)
      // Verify nothing was deleted.
      expect((await engine.admin.listRoles()).map((r) => r.id)).toEqual(['viewer'])
    })
  })
})

type EngineSnapshot = {
  schemaVersion: 1
  exportedAt: string
  policies: AccessControl.IPolicy<Action, ResourceType, RoleId>[]
  roles: AccessControl.IRole<Action, ResourceType, RoleId, Scope>[]
}

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
    const roleA: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
      id: 'viewer' as RoleId,
      name: 'AccessControl.IRole A',
      inherits: ['editor'],
      permissions: [{ action: 'read', resource: 'post' }],
    }
    const roleB: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
      id: 'editor' as RoleId,
      name: 'AccessControl.IRole B',
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

  it('onMetrics hook fires once per evaluation with primitive payload', async () => {
    const events: Array<{ subjectId: string; allowed: boolean; mode: string }> = []
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      hooks: {
        onMetrics: (e) => events.push({ subjectId: e.subjectId, allowed: e.allowed, mode: e.mode }),
      },
    })

    await engine.can('user-viewer', 'read', { type: 'post', attributes: {} })
    await engine.can('user-viewer', 'delete', { type: 'post', attributes: {} })

    expect(events).toEqual([
      { subjectId: 'user-viewer', allowed: true, mode: 'development' },
      { subjectId: 'user-viewer', allowed: false, mode: 'development' },
    ])
  })

  it('onMetrics fires in production mode and reports mode="production"', async () => {
    let captured: string | undefined
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-viewer': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
      adapter,
      mode: 'production',
      cacheTTL: 0,
      hooks: {
        onMetrics: (e) => {
          captured = e.mode
        },
      },
    })
    await engine.can('user-viewer', 'read', { type: 'post', attributes: {} })
    expect(captured).toBe('production')
  })
})

describe('Engine - stats', () => {
  it('exposes hit / miss / size per cache', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    // First call: every cache misses then populates.
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    let s = engine.stats()
    expect(s.policies.misses).toBeGreaterThan(0)
    expect(s.policies.size).toBe(1)
    expect(s.mergedPolicies.misses).toBeGreaterThan(0)

    // Second call: merged policies + subjects should hit; underlying caches
    // are reached only on merged-miss so their hit counters stay low.
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    s = engine.stats()
    expect(s.mergedPolicies.hits).toBeGreaterThan(0)
    expect(s.subjects.hits).toBeGreaterThan(0)
  })

  it('resetStats zeroes counters', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    engine.resetStats()
    const s = engine.stats()
    expect(s.policies.hits + s.policies.misses).toBe(0)
    expect(s.subjects.hits + s.subjects.misses).toBe(0)
  })
})

describe('Engine - empty RBAC + explicit ABAC allow', () => {
  it('engine.can returns the ABAC decision when no roles are assigned', async () => {
    // Empty RBAC must not contribute a default-deny that short-circuits the
    // AND combine when an explicit ABAC policy allows the action.
    const publicReadPolicy: AccessControl.IPolicy = {
      id: 'public-read',
      name: 'Public Read',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
      ],
    }
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      policies: [publicReadPolicy] as never,
      roles: [],
      assignments: {},
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter })

    expect(await engine.can('anon-user', 'read', { type: 'post', attributes: {} })).toBe(true)
  })
})

describe('Engine - construction guards', () => {
  it("throws when mode='production' is combined with policyCombine='first-applicable'", () => {
    // evaluateFast cannot represent "rule fired" vs "default applied", so it
    // would silently downgrade first-applicable to AND in production. The
    // ctor refuses the combination to surface the issue at boot, not at
    // request time.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(
      () =>
        new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
          adapter,
          mode: 'production',
          policyCombine: 'first-applicable',
        }),
    ).toThrow(/first-applicable/)
  })

  it("accepts mode='production' with policyCombine='and' (default)", () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(
      () =>
        new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
          adapter,
          mode: 'production',
        }),
    ).not.toThrow()
  })

  it("accepts mode='production' with policyCombine='allow-overrides'", () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(
      () =>
        new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
          adapter,
          mode: 'production',
          policyCombine: 'allow-overrides',
        }),
    ).not.toThrow()
  })

  it("refuses defaultEffect='allow' in production without explicit opt-in (N7)", () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(
      () =>
        new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
          adapter,
          mode: 'production',
          defaultEffect: 'allow',
        }),
    ).toThrow(/fail-open/i)
  })

  it("accepts defaultEffect='allow' in production with allowFailOpen: true", () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(
      () =>
        new Engine<Action, ResourceType, RoleId, Scope, 'production'>({
          adapter,
          mode: 'production',
          defaultEffect: 'allow',
          allowFailOpen: true,
        }),
    ).not.toThrow()
  })

  it("accepts defaultEffect='allow' in development without opt-in", () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    expect(() => new Engine<Action, ResourceType, RoleId, Scope>({ adapter, defaultEffect: 'allow' })).not.toThrow()
  })
})

describe('Engine - DoS bounds at load time (B5)', () => {
  it('routes to deny + onError when adapter returns more policies than maxPolicies', async () => {
    const policies: AccessControl.IPolicy<Action, ResourceType, RoleId>[] = Array.from({ length: 5 }, (_, i) => ({
      id: `p${i}`,
      name: `P${i}`,
      algorithm: 'deny-overrides',
      rules: [],
    }))
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ policies })
    const errors: Error[] = []
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      maxPolicies: 2,
      cacheTTL: 0,
      hooks: {
        onError: (e) => {
          errors.push(e)
        },
      },
    })
    expect(await engine.can('u', 'read', { type: 'post', attributes: {} })).toBe(false)
    expect(errors[0]?.message).toMatch(/maxPolicies/)
  })

  it('routes to deny + onError when adapter returns more roles than maxRoles', async () => {
    const roles: AccessControl.IRole<Action, ResourceType, RoleId, Scope>[] = Array.from({ length: 5 }, (_, i) => ({
      id: `r${i}` as RoleId,
      name: `R${i}`,
      permissions: [],
    }))
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles, assignments: {} })
    const errors: Error[] = []
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      maxRoles: 2,
      cacheTTL: 0,
      hooks: {
        onError: (e) => {
          errors.push(e)
        },
      },
    })
    expect(await engine.can('u', 'read', { type: 'post', attributes: {} })).toBe(false)
    expect(errors[0]?.message).toMatch(/maxRoles/)
  })
})

describe('Engine - fail-skip on malformed policy (B4)', () => {
  it('skips a throwing policy and continues evaluating the rest', async () => {
    const goodPolicy: AccessControl.IPolicy<Action, ResourceType, RoleId> = {
      id: 'good',
      name: 'good',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r', effect: 'allow', priority: 0, actions: ['read'], resources: ['post'], conditions: { all: [] } },
      ],
    }
    const badPolicy = {
      id: 'bad',
      name: 'bad',
      algorithm: 'deny-overrides',
    } as unknown as AccessControl.IPolicy<Action, ResourceType, RoleId>
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      policies: [badPolicy, goodPolicy],
    })
    const errors: Array<{ msg: string; id: string }> = []
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      hooks: { onPolicyError: (err, id) => errors.push({ msg: err.message, id }) },
    })
    expect(await engine.can('u', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(errors).toHaveLength(1)
    expect(errors[0]?.id).toBe('bad')
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

  it('invalidateRoles(roleId) keeps subjects without that role cached', async () => {
    // Two subjects: only one holds the role we're about to mutate.
    // The unrelated subject's cache entry must survive.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
      assignments: {
        'user-viewer-only': ['viewer'] as RoleId[],
        'user-editor': ['editor'] as RoleId[],
      },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    // Warm subject cache for both.
    expect(await engine.can('user-viewer-only', 'read', { type: 'post', attributes: {} })).toBe(true)
    expect(await engine.can('user-editor', 'read', { type: 'post', attributes: {} })).toBe(true)

    // Spy on adapter.getSubjectRoles via call counting.
    let viewerCalls = 0
    let editorCalls = 0
    const origGetRoles = adapter.getSubjectRoles.bind(adapter)
    adapter.getSubjectRoles = async (id) => {
      if (id === 'user-viewer-only') viewerCalls++
      if (id === 'user-editor') editorCalls++
      return origGetRoles(id)
    }

    // Mutate the editor role; only editor-holders should be evicted.
    engine.invalidateRoles('editor' as RoleId)

    await engine.can('user-viewer-only', 'read', { type: 'post', attributes: {} })
    await engine.can('user-editor', 'read', { type: 'post', attributes: {} })

    expect(viewerCalls).toBe(0) // still cached
    expect(editorCalls).toBe(1) // evicted, re-fetched
  })

  it('invalidateRoles() with no arg falls back to clearing the entire subject cache', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(true)

    let calls = 0
    const orig = adapter.getSubjectRoles.bind(adapter)
    adapter.getSubjectRoles = async (id) => {
      calls++
      return orig(id)
    }

    engine.invalidateRoles()
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    expect(calls).toBe(1)
  })

  it('single-flight: concurrent cold-start checks fan in to one adapter load', async () => {
    // 50 parallel can() calls on a fresh engine must hit listPolicies/listRoles once each,
    // not 50 times. Catches the thundering-herd regression.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    let policyCalls = 0
    let roleCalls = 0
    const origPolicies = adapter.listPolicies.bind(adapter)
    const origRoles = adapter.listRoles.bind(adapter)
    adapter.listPolicies = async () => {
      policyCalls++
      // Force async gap so concurrent callers all see in-flight state.
      await new Promise((r) => setTimeout(r, 0))
      return origPolicies()
    }
    adapter.listRoles = async () => {
      roleCalls++
      await new Promise((r) => setTimeout(r, 0))
      return origRoles()
    }

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    const promises = Array.from({ length: 50 }, () => engine.can('user-1', 'read', { type: 'post', attributes: {} }))
    const results = await Promise.all(promises)
    expect(results.every((r) => r === true)).toBe(true)
    expect(policyCalls).toBe(1)
    expect(roleCalls).toBe(1)
  })

  it('single-flight: concurrent subject resolves fan in to one fetch per subject', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole],
      assignments: {
        'user-a': ['viewer'] as RoleId[],
        'user-b': ['editor'] as RoleId[],
      },
    })
    const counts = new Map<string, number>()
    const orig = adapter.getSubjectRoles.bind(adapter)
    adapter.getSubjectRoles = async (id) => {
      counts.set(id, (counts.get(id) ?? 0) + 1)
      await new Promise((r) => setTimeout(r, 0))
      return orig(id)
    }

    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    await Promise.all([
      engine.can('user-a', 'read', { type: 'post', attributes: {} }),
      engine.can('user-a', 'read', { type: 'post', attributes: {} }),
      engine.can('user-b', 'read', { type: 'post', attributes: {} }),
      engine.can('user-a', 'read', { type: 'post', attributes: {} }),
      engine.can('user-b', 'read', { type: 'post', attributes: {} }),
    ])
    expect(counts.get('user-a')).toBe(1)
    expect(counts.get('user-b')).toBe(1)
  })

  it('invalidatePolicies() mid-flight: pending load does not write stale cache', async () => {
    // Narrow invalidator must clear its in-flight slot, mirroring the broad
    // invalidate() guard below.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    const origPolicies = adapter.listPolicies.bind(adapter)
    adapter.listPolicies = async () => {
      await new Promise((r) => setTimeout(r, 5))
      return origPolicies()
    }
    const pending = engine.can('user-1', 'read', { type: 'post', attributes: {} })
    engine.invalidatePolicies()
    await pending
    // Engine still resolves correctly after the narrow invalidate races the loader.
    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(true)
  })

  it('invalidateRoles() mid-flight: pending load does not write stale cache', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    const origRoles = adapter.listRoles.bind(adapter)
    adapter.listRoles = async () => {
      await new Promise((r) => setTimeout(r, 5))
      return origRoles()
    }
    const pending = engine.can('user-1', 'read', { type: 'post', attributes: {} })
    engine.invalidateRoles()
    await pending
    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(true)
  })

  it('rbac cached policy is frozen - consumer mutation throws in strict mode', async () => {
    // Cached Policy is a shared reference; mutations would corrupt subsequent
    // loadAllPolicies() callers. Strict-mode JS throws on frozen-target writes.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    // Reach into private cache via a typed accessor on the engine for the test only.
    const cache = (engine as unknown as { _rbacPolicyCache: { get(k: string): { rules: unknown[] } | undefined } })
      ._rbacPolicyCache
    const cached = cache.get('rbac')!
    expect(Object.isFrozen(cached)).toBe(true)
    expect(Object.isFrozen(cached.rules)).toBe(true)
    // strict mode is enabled in vitest by default; push on frozen array throws.
    expect(() => (cached.rules as unknown[]).push({})).toThrow()
  })

  it('invalidate() during a pending load: result is consistent with the post-invalidate adapter state', async () => {
    // Race target: caller A's loadPolicies awaits adapter.listPolicies, invalidate() fires,
    // A's promise then resolves. Without the in-flight sentinel guard, A would write the
    // pre-invalidate result back into the now-cleared cache, silently masking the invalidate.
    // We exercise the path; assertion is on no thrown error and the final state being
    // re-loadable. (A direct race assertion would be flaky on a single-threaded event loop.)
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { 'user-1': ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    // Slow listPolicies so we can interleave invalidate().
    const origPolicies = adapter.listPolicies.bind(adapter)
    adapter.listPolicies = async () => {
      await new Promise((r) => setTimeout(r, 5))
      return origPolicies()
    }

    const pending = engine.can('user-1', 'read', { type: 'post', attributes: {} })
    engine.invalidate() // mid-flight
    await expect(pending).resolves.toBe(true)
    // Post-race: engine remains functional and reflects the live adapter state.
    await adapter.savePolicy({
      id: 'extra',
      name: 'Extra',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r-deny', effect: 'deny', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
      ],
    })
    engine.invalidatePolicies()
    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(false)
  })

  it('invalidateRoles(roleId) evicts subjects that inherit the role transitively', async () => {
    // user-admin holds 'admin' which inherits 'editor' which inherits 'viewer'.
    // Request.ISubject.roles is the resolved set, so mutating 'viewer' must still evict.
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole, adminRole],
      assignments: { 'user-admin': ['admin'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    expect(await engine.can('user-admin', 'read', { type: 'post', attributes: {} })).toBe(true)

    let calls = 0
    const orig = adapter.getSubjectRoles.bind(adapter)
    adapter.getSubjectRoles = async (id) => {
      calls++
      return orig(id)
    }

    engine.invalidateRoles('viewer' as RoleId)
    await engine.can('user-admin', 'read', { type: 'post', attributes: {} })
    expect(calls).toBe(1)
  })

  it('synthesised RBAC policy is deep-frozen (M2)', async () => {
    const engine = createEngine()
    await engine.can('user-editor', 'read', { type: 'post', attributes: {} })
    const internal = engine as unknown as { _rbacPolicyCache: { get(k: string): AccessControl.IPolicy | undefined } }
    const rbac = internal._rbacPolicyCache.get('rbac')
    expect(rbac).toBeDefined()
    expect(Object.isFrozen(rbac)).toBe(true)
    expect(Object.isFrozen(rbac?.rules)).toBe(true)
    const rule = rbac!.rules[0]!
    expect(Object.isFrozen(rule)).toBe(true)
    expect(Object.isFrozen(rule.actions)).toBe(true)
    expect(Object.isFrozen(rule.resources)).toBe(true)
    if (rule.conditions) expect(Object.isFrozen(rule.conditions)).toBe(true)
  })

  it('RBAC rebuild is single-flighted across concurrent cold callers (M3)', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole, editorRole, adminRole],
      assignments: { 'user-admin': ['admin'] as RoleId[] },
    })
    let listRoleCalls = 0
    const origListRoles = adapter.listRoles.bind(adapter)
    adapter.listRoles = async () => {
      listRoleCalls++
      return origListRoles()
    }
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })

    await Promise.all([
      engine.can('user-admin', 'read', { type: 'post', attributes: {} }),
      engine.can('user-admin', 'read', { type: 'post', attributes: {} }),
      engine.can('user-admin', 'read', { type: 'post', attributes: {} }),
    ])
    expect(listRoleCalls).toBe(1)
  })
})

describe('Engine - adapter timeout (B1)', () => {
  it('aborts a hung listPolicies after adapterTimeoutMs', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    // Adapter ignores the signal and never resolves; the engine's timer must
    // fire and reject with the timeout error.
    adapter.listPolicies = () => new Promise(() => {})
    const errors: Error[] = []
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      adapterTimeoutMs: 30,
      hooks: {
        onError: (e) => {
          errors.push(e)
        },
      },
    })
    expect(await engine.can('user-1', 'read', { type: 'post', attributes: {} })).toBe(false)
    expect(errors[0]?.message).toMatch(/timed out/)
  })

  it('hard-cancels the underlying adapter call via AbortSignal', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    let aborted = false
    adapter.listPolicies = (opts) =>
      new Promise((_resolve, reject) => {
        opts?.signal?.addEventListener('abort', () => {
          aborted = true
          reject(new Error('aborted'))
        })
      })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 0,
      adapterTimeoutMs: 30,
    })
    await engine.can('user-1', 'read', { type: 'post', attributes: {} })
    expect(aborted).toBe(true)
  })
})

describe('Engine - cross-instance invalidator (B2)', () => {
  function makeBus<TRole extends string = string>(): {
    invalidatorFor(): {
      publish(event: { kind: string; roleId?: TRole; subjectId?: string }): void
      subscribe(h: (event: { kind: string; roleId?: TRole; subjectId?: string }) => void): () => void
    }
  } {
    const handlers = new Set<(event: never) => void>()
    return {
      invalidatorFor() {
        return {
          publish(event) {
            for (const h of handlers) (h as (e: typeof event) => void)(event)
          },
          subscribe(h) {
            handlers.add(h as (e: never) => void)
            return () => {
              handlers.delete(h as (e: never) => void)
            }
          },
        }
      },
    }
  }

  it('broadcasts invalidate events across engine instances and applies them locally', async () => {
    const bus = makeBus<RoleId>()
    const adapterA = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { u1: ['viewer'] as RoleId[] },
    })
    const adapterB = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { u1: ['viewer'] as RoleId[] },
    })
    const engineA = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter: adapterA,
      cacheTTL: 60,
      invalidator: bus.invalidatorFor() as never,
    })
    const engineB = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter: adapterB,
      cacheTTL: 60,
      invalidator: bus.invalidatorFor() as never,
    })

    // Warm B's cache.
    await engineB.can('u1', 'read', { type: 'post', attributes: {} })
    let listCallsB = 0
    const orig = adapterB.listPolicies.bind(adapterB)
    adapterB.listPolicies = (opts) => {
      listCallsB++
      return orig(opts)
    }

    // A invalidates locally -> publishes -> B drops its caches.
    engineA.invalidatePolicies()

    await engineB.can('u1', 'read', { type: 'post', attributes: {} })
    expect(listCallsB).toBe(1)

    engineA.dispose()
    engineB.dispose()
  })

  it('does not echo self-published events back into the same engine', async () => {
    const bus = makeBus<RoleId>()
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({
      adapter,
      cacheTTL: 60,
      invalidator: bus.invalidatorFor() as never,
    })
    let listCalls = 0
    const orig = adapter.listPolicies.bind(adapter)
    adapter.listPolicies = (opts) => {
      listCalls++
      return orig(opts)
    }
    await engine.can('u', 'read', { type: 'post', attributes: {} })
    engine.invalidatePolicies()
    await engine.can('u', 'read', { type: 'post', attributes: {} })
    // The single publish goes to the bus and back into our subscription.
    // Bus-handler applies invalidate with `broadcast: false`. We expect: warm
    // call, invalidate, cold call -> exactly 2 listPolicies calls.
    expect(listCalls).toBe(2)
    engine.dispose()
  })
})

describe('Engine.healthCheck() (N2)', () => {
  it('returns ok=true when the adapter responds', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
    const health = await engine.healthCheck()
    expect(health.ok).toBe(true)
    expect(health.adapter).toBe('ok')
    expect(health.adapterLatencyMs).toBeGreaterThanOrEqual(0)
    expect(health.lastError).toBeUndefined()
  })

  it('returns ok=false and the error when the adapter throws', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({})
    adapter.listPolicies = async () => {
      throw new Error('db dead')
    }
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
    const health = await engine.healthCheck()
    expect(health.ok).toBe(false)
    expect(health.adapter).toBe('fail')
    expect(health.lastError).toBe('db dead')
  })

  it('reports cache hit rate after warmup', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
      roles: [viewerRole],
      assignments: { u1: ['viewer'] as RoleId[] },
    })
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    await engine.can('u1', 'read', { type: 'post', attributes: {} })
    await engine.can('u1', 'read', { type: 'post', attributes: {} })
    const h = await engine.healthCheck()
    expect(h.cacheHitRate).toBeGreaterThan(0)
  })
})

describe('Engine.preload() (N4)', () => {
  it('warms merged-policy cache so the first can() is hot', async () => {
    const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({ roles: [viewerRole] })
    let listCalls = 0
    const orig = adapter.listPolicies.bind(adapter)
    adapter.listPolicies = (opts) => {
      listCalls++
      return orig(opts)
    }
    const engine = new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 60 })
    await engine.preload()
    await engine.can('u', 'read', { type: 'post', attributes: {} })
    expect(listCalls).toBe(1)
  })
})
