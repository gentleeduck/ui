import { beforeEach, describe, expect, it } from 'vitest'
import type { Engine } from '../../../core'
import type { AccessControl, Adapter } from '../../../core/types'
import { type Redis, RedisAdapter } from '../index'

type A = 'read' | 'write'
type R = 'post' | 'comment'
type Ro = 'viewer' | 'editor'
type S = 'org-1' | 'org-2'

class FakeRedis implements Redis.ILike {
  private strings = new Map<string, string>()
  private hashes = new Map<string, Map<string, string>>()
  private sets = new Map<string, Set<string>>()

  async get(key: string): Promise<string | null> {
    return this.strings.get(key) ?? null
  }
  async set(key: string, value: string): Promise<unknown> {
    this.strings.set(key, value)
    return 'OK'
  }
  async del(...keys: string[]): Promise<number> {
    let n = 0
    for (const k of keys) {
      if (this.strings.delete(k)) n++
      if (this.hashes.delete(k)) n++
      if (this.sets.delete(k)) n++
    }
    return n
  }
  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.hashes.has(key)) this.hashes.set(key, new Map())
    const h = this.hashes.get(key)!
    const fresh = !h.has(field)
    h.set(field, value)
    return fresh ? 1 : 0
  }
  async hget(key: string, field: string): Promise<string | null> {
    return this.hashes.get(key)?.get(field) ?? null
  }
  async hdel(key: string, ...fields: string[]): Promise<number> {
    const h = this.hashes.get(key)
    if (!h) return 0
    let n = 0
    for (const f of fields) if (h.delete(f)) n++
    return n
  }
  async hkeys(key: string): Promise<string[]> {
    return Array.from(this.hashes.get(key)?.keys() ?? [])
  }
  async hvals(key: string): Promise<string[]> {
    return Array.from(this.hashes.get(key)?.values() ?? [])
  }
  async hgetall(key: string): Promise<Record<string, string>> {
    const out: Record<string, string> = {}
    for (const [k, v] of this.hashes.get(key)?.entries() ?? []) out[k] = v
    return out
  }
  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.sets.has(key)) this.sets.set(key, new Set())
    const s = this.sets.get(key)!
    let n = 0
    for (const m of members) {
      if (!s.has(m)) {
        s.add(m)
        n++
      }
    }
    return n
  }
  async srem(key: string, ...members: string[]): Promise<number> {
    const s = this.sets.get(key)
    if (!s) return 0
    let n = 0
    for (const m of members) if (s.delete(m)) n++
    return n
  }
  async smembers(key: string): Promise<string[]> {
    return Array.from(this.sets.get(key) ?? [])
  }

  // helpers for assertions
  rawHash(key: string): Map<string, string> | undefined {
    return this.hashes.get(key)
  }
  rawSet(key: string): Set<string> | undefined {
    return this.sets.get(key)
  }
}

describe('RedisAdapter', () => {
  let redis: FakeRedis
  let adapter: RedisAdapter<A, R, Ro, S>

  beforeEach(() => {
    redis = new FakeRedis()
    adapter = new RedisAdapter<A, R, Ro, S>({ client: redis })
  })

  describe('Adapter.IPolicyStore', () => {
    const policy: AccessControl.IPolicy<A, R, Ro> = {
      id: 'p1',
      name: 'Test',
      description: 'desc',
      version: 2,
      algorithm: 'deny-overrides',
      rules: [],
      targets: { actions: ['read'] },
    }

    it('listPolicies starts empty', async () => {
      expect(await adapter.listPolicies()).toEqual([])
    })

    it('savePolicy + listPolicies roundtrip', async () => {
      await adapter.savePolicy(policy)
      const list = await adapter.listPolicies()
      expect(list).toEqual([policy])
    })

    it('getPolicy returns null when missing', async () => {
      expect(await adapter.getPolicy('nope')).toBeNull()
    })

    it('getPolicy returns saved policy', async () => {
      await adapter.savePolicy(policy)
      expect(await adapter.getPolicy('p1')).toEqual(policy)
    })

    it('savePolicy overwrites existing', async () => {
      await adapter.savePolicy(policy)
      await adapter.savePolicy({ ...policy, name: 'Updated' })
      const got = await adapter.getPolicy('p1')
      expect(got?.name).toBe('Updated')
      expect(redis.rawHash('policies')?.size).toBe(1)
    })

    it('deletePolicy removes', async () => {
      await adapter.savePolicy(policy)
      await adapter.deletePolicy('p1')
      expect(await adapter.listPolicies()).toEqual([])
    })

    it('stores under prefixed key when keyPrefix set', async () => {
      const prefixed = new RedisAdapter<A, R, Ro, S>({ client: redis, keyPrefix: 'iam:' })
      await prefixed.savePolicy(policy)
      expect(redis.rawHash('iam:policies')).toBeDefined()
      expect(redis.rawHash('policies')).toBeUndefined()
    })
  })

  describe('Adapter.IRoleStore', () => {
    const role: AccessControl.IRole<A, R, Ro, S> = {
      id: 'editor',
      name: 'Editor',
      description: 'Can edit',
      permissions: [{ action: 'write', resource: 'post' }],
      inherits: ['viewer'] as Ro[],
      scope: 'org-1',
      metadata: { color: 'blue' },
    }

    it('listRoles empty', async () => {
      expect(await adapter.listRoles()).toEqual([])
    })

    it('saveRole + getRole roundtrip', async () => {
      await adapter.saveRole(role)
      expect(await adapter.getRole('editor')).toEqual(role)
    })

    it('getRole null when missing', async () => {
      expect(await adapter.getRole('nope')).toBeNull()
    })

    it('saveRole overwrites', async () => {
      await adapter.saveRole(role)
      await adapter.saveRole({ ...role, name: 'New' })
      const got = await adapter.getRole('editor')
      expect(got?.name).toBe('New')
      expect(redis.rawHash('roles')?.size).toBe(1)
    })

    it('deleteRole removes', async () => {
      await adapter.saveRole(role)
      await adapter.deleteRole('editor')
      expect(await adapter.listRoles()).toEqual([])
    })

    it('listRoles returns multiple', async () => {
      await adapter.saveRole(role)
      await adapter.saveRole({ id: 'viewer', name: 'V', permissions: [] })
      const list = await adapter.listRoles()
      expect(list).toHaveLength(2)
    })
  })

  describe('Adapter.ISubjectStore', () => {
    it('getSubjectRoles empty when none assigned', async () => {
      expect(await adapter.getSubjectRoles('user-1')).toEqual([])
    })

    it('assignRole + getSubjectRoles', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('assignRole is idempotent (set semantics)', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro)
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('getSubjectRoles dedups across scopes', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-2')
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('getSubjectScopedRoles only returns scoped', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.assignRole('user-1', 'viewer' as Ro, 'org-2')
      const scoped = await adapter.getSubjectScopedRoles('user-1')
      expect(scoped).toHaveLength(2)
      expect(scoped).toContainEqual({ role: 'editor', scope: 'org-1' })
      expect(scoped).toContainEqual({ role: 'viewer', scope: 'org-2' })
    })

    it('revokeRole without scope removes all matching role assignments', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-2')
      await adapter.assignRole('user-1', 'viewer' as Ro)
      await adapter.revokeRole('user-1', 'editor' as Ro)
      const remaining = await adapter.getSubjectRoles('user-1')
      expect(remaining).toEqual(['viewer'])
    })

    it('revokeRole with scope only clears matching scoped assignment', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.revokeRole('user-1', 'editor' as Ro, 'org-1')
      const scoped = await adapter.getSubjectScopedRoles('user-1')
      expect(scoped).toEqual([])
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('revokeRole no-op when role not assigned', async () => {
      await adapter.revokeRole('user-1', 'editor' as Ro)
      expect(await adapter.getSubjectRoles('user-1')).toEqual([])
    })

    it('getSubjectAttributes returns {} when missing', async () => {
      expect(await adapter.getSubjectAttributes('nobody')).toEqual({})
    })

    it('setSubjectAttributes stores and merges', async () => {
      await adapter.setSubjectAttributes('user-1', { team: 'A' })
      await adapter.setSubjectAttributes('user-1', { plan: 'pro' })
      expect(await adapter.getSubjectAttributes('user-1')).toEqual({ team: 'A', plan: 'pro' })
    })

    it('setSubjectAttributes overwrites existing keys', async () => {
      await adapter.setSubjectAttributes('user-1', { team: 'A' })
      await adapter.setSubjectAttributes('user-1', { team: 'B' })
      expect((await adapter.getSubjectAttributes('user-1')).team).toBe('B')
    })

    it('keys are isolated per subject', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-2', 'viewer' as Ro)
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
      expect(await adapter.getSubjectRoles('user-2')).toEqual(['viewer'])
    })
  })

  describe('keyPrefix', () => {
    it('namespaces all storage keys', async () => {
      const prefixed = new RedisAdapter<A, R, Ro, S>({ client: redis, keyPrefix: 'app1:' })
      await prefixed.savePolicy({ id: 'p1', name: 'P', algorithm: 'deny-overrides', rules: [] })
      await prefixed.saveRole({ id: 'r1' as Ro, name: 'R', permissions: [] })
      await prefixed.assignRole('user-1', 'r1' as Ro)
      await prefixed.setSubjectAttributes('user-1', { x: 1 })

      expect(redis.rawHash('app1:policies')).toBeDefined()
      expect(redis.rawHash('app1:roles')).toBeDefined()
      expect(redis.rawSet('app1:assignments:user-1')).toBeDefined()
      // Default (unprefixed) keys stay empty
      expect(redis.rawHash('policies')).toBeUndefined()
    })

    it('two adapters with different prefixes do not collide', async () => {
      const a1 = new RedisAdapter<A, R, Ro, S>({ client: redis, keyPrefix: 'app1:' })
      const a2 = new RedisAdapter<A, R, Ro, S>({ client: redis, keyPrefix: 'app2:' })
      await a1.savePolicy({ id: 'p1', name: 'P1', algorithm: 'deny-overrides', rules: [] })
      await a2.savePolicy({ id: 'p1', name: 'P2', algorithm: 'deny-overrides', rules: [] })
      expect((await a1.getPolicy('p1'))?.name).toBe('P1')
      expect((await a2.getPolicy('p1'))?.name).toBe('P2')
    })
  })

  describe('integration with engine', () => {
    it('adapter contract satisfies Engine when used end-to-end', async () => {
      const { Engine } = await import('../../../core/engine')
      const engine = new Engine<A, R, Ro, S>({ adapter, cacheTTL: 0 })

      await adapter.saveRole({
        id: 'editor' as Ro,
        name: 'Editor',
        permissions: [{ action: 'write', resource: 'post' }],
      })
      await adapter.assignRole('user-1', 'editor' as Ro)

      const allowed = await engine.can('user-1', 'write', { type: 'post', attributes: {} })
      expect(allowed).toBe(true)

      const denied = await engine.can('user-1', 'read', { type: 'post', attributes: {} })
      expect(denied).toBe(false)
    })
  })

  describe('NUL byte guard on role/scope', () => {
    // The encoded set member uses `\0` as separator. A caller smuggling a NUL
    // through `as TRole` would corrupt the assignment silently - the guard
    // throws instead.
    it('assignRole rejects roleId containing NUL', async () => {
      const adapter = new RedisAdapter<A, R, Ro, S>({ client: new FakeRedis() })
      await expect(adapter.assignRole('user-1', 'view\0er' as Ro)).rejects.toThrow(/NUL/)
    })

    it('assignRole rejects scope containing NUL', async () => {
      const adapter = new RedisAdapter<A, R, Ro, S>({ client: new FakeRedis() })
      await expect(adapter.assignRole('user-1', 'viewer' as Ro, 'org\0-1' as S)).rejects.toThrow(/NUL/)
    })
  })
})
