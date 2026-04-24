import { beforeEach, describe, expect, it } from 'vitest'
import type { Policy, Role } from '../../../core/types'
import { MemoryAdapter } from '../index'

type A = 'read' | 'write'
type R = 'post' | 'comment'
type Ro = 'viewer' | 'editor'
type S = 'org-1'

describe('MemoryAdapter', () => {
  let adapter: MemoryAdapter<A, R, Ro, S>

  beforeEach(() => {
    adapter = new MemoryAdapter<A, R, Ro, S>()
  })

  describe('PolicyStore', () => {
    const policy: Policy<A, R, Ro> = {
      id: 'p1',
      name: 'Test Policy',
      algorithm: 'deny-overrides',
      rules: [],
    }

    it('starts empty', async () => {
      expect(await adapter.listPolicies()).toEqual([])
    })

    it('savePolicy + listPolicies', async () => {
      await adapter.savePolicy(policy)
      expect(await adapter.listPolicies()).toEqual([policy])
    })

    it('getPolicy returns policy or null', async () => {
      expect(await adapter.getPolicy('p1')).toBeNull()
      await adapter.savePolicy(policy)
      expect(await adapter.getPolicy('p1')).toEqual(policy)
    })

    it('deletePolicy removes policy', async () => {
      await adapter.savePolicy(policy)
      await adapter.deletePolicy('p1')
      expect(await adapter.listPolicies()).toEqual([])
    })

    it('savePolicy overwrites existing', async () => {
      await adapter.savePolicy(policy)
      const updated = { ...policy, name: 'Updated' }
      await adapter.savePolicy(updated)
      expect((await adapter.getPolicy('p1'))!.name).toBe('Updated')
    })
  })

  describe('RoleStore', () => {
    const role: Role<A, R, Ro, S> = {
      id: 'viewer',
      name: 'Viewer',
      permissions: [{ action: 'read', resource: 'post' }],
    }

    it('starts empty', async () => {
      expect(await adapter.listRoles()).toEqual([])
    })

    it('saveRole + listRoles', async () => {
      await adapter.saveRole(role)
      expect(await adapter.listRoles()).toEqual([role])
    })

    it('getRole returns role or null', async () => {
      expect(await adapter.getRole('viewer')).toBeNull()
      await adapter.saveRole(role)
      expect(await adapter.getRole('viewer')).toEqual(role)
    })

    it('deleteRole removes role', async () => {
      await adapter.saveRole(role)
      await adapter.deleteRole('viewer')
      expect(await adapter.listRoles()).toEqual([])
    })
  })

  describe('SubjectStore', () => {
    it('getSubjectRoles returns empty for unknown subject', async () => {
      expect(await adapter.getSubjectRoles('unknown')).toEqual([])
    })

    it('assignRole + getSubjectRoles', async () => {
      await adapter.assignRole('user-1', 'viewer')
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['viewer'])
    })

    it('assignRole deduplicates roles in getSubjectRoles', async () => {
      await adapter.assignRole('user-1', 'viewer')
      await adapter.assignRole('user-1', 'viewer')
      const roles = await adapter.getSubjectRoles('user-1')
      expect(roles).toEqual(['viewer'])
    })

    it('revokeRole removes role', async () => {
      await adapter.assignRole('user-1', 'viewer')
      await adapter.assignRole('user-1', 'editor')
      await adapter.revokeRole('user-1', 'viewer')
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('revokeRole is no-op for unknown subject', async () => {
      await adapter.revokeRole('unknown', 'viewer') // should not throw
    })

    it('getSubjectScopedRoles returns scoped assignments', async () => {
      await adapter.assignRole('user-1', 'editor', 'org-1')
      await adapter.assignRole('user-1', 'viewer') // no scope
      const scoped = await adapter.getSubjectScopedRoles('user-1')
      expect(scoped).toEqual([{ role: 'editor', scope: 'org-1' }])
    })

    it('getSubjectAttributes returns empty for unknown subject', async () => {
      expect(await adapter.getSubjectAttributes('unknown')).toEqual({})
    })

    it('setSubjectAttributes merges attributes', async () => {
      await adapter.setSubjectAttributes('user-1', { a: 1, b: 'two' })
      await adapter.setSubjectAttributes('user-1', { c: true })
      expect(await adapter.getSubjectAttributes('user-1')).toEqual({ a: 1, b: 'two', c: true })
    })
  })

  describe('constructor init', () => {
    it('initializes from init object', async () => {
      const adapter = new MemoryAdapter<A, R, Ro, S>({
        policies: [{ id: 'p1', name: 'P', algorithm: 'deny-overrides', rules: [] }],
        roles: [{ id: 'viewer', name: 'Viewer', permissions: [] }],
        assignments: { 'user-1': ['viewer'] },
        attributes: { 'user-1': { level: 5 } },
      })

      expect(await adapter.listPolicies()).toEqual([{ id: 'p1', name: 'P', algorithm: 'deny-overrides', rules: [] }])
      expect(await adapter.listRoles()).toEqual([{ id: 'viewer', name: 'Viewer', permissions: [] }])
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['viewer'])
      expect(await adapter.getSubjectAttributes('user-1')).toEqual({ level: 5 })
    })
  })
})
