import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AccessControl, Adapter } from '../../../core/types'
import { PrismaAdapter } from '../index'

type A = 'read' | 'write'
type R = 'post' | 'comment'
type Ro = 'viewer' | 'editor'
type S = 'org-1' | 'org-2'

interface PolicyRow {
  id: string
  name: string
  description: string | null
  version: number
  algorithm: string
  rules: unknown
  targets: unknown | null
}
interface RoleRow {
  id: string
  name: string
  description: string | null
  permissions: unknown
  inherits: string[] | null
  scope: string | null
  metadata: unknown | null
}
interface AssignmentRow {
  subjectId: string
  roleId: string
  scope: string | null
}
interface AttrRow {
  subjectId: string
  data: unknown
}

function makePrismaMock() {
  const policies = new Map<string, PolicyRow>()
  const roles = new Map<string, RoleRow>()
  const assignments: AssignmentRow[] = []
  const attrs = new Map<string, AttrRow>()

  return {
    accessPolicy: {
      findMany: vi.fn(async () => Array.from(policies.values())),
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => policies.get(where.id) ?? null),
      upsert: vi.fn(async ({ where, create }: { where: { id: string }; create: Record<string, unknown> }) => {
        policies.set(where.id, create as unknown as PolicyRow)
        return create as unknown as PolicyRow
      }),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        const row = policies.get(where.id)!
        policies.delete(where.id)
        return row
      }),
    },
    accessRole: {
      findMany: vi.fn(async () => Array.from(roles.values())),
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => roles.get(where.id) ?? null),
      upsert: vi.fn(async ({ where, create }: { where: { id: string }; create: Record<string, unknown> }) => {
        roles.set(where.id, create as unknown as RoleRow)
        return create as unknown as RoleRow
      }),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        const row = roles.get(where.id)!
        roles.delete(where.id)
        return row
      }),
    },
    accessAssignment: {
      findMany: vi.fn(async ({ where }: { where: { subjectId: string } }) =>
        assignments.filter((a) => a.subjectId === where.subjectId),
      ),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const row = data as unknown as AssignmentRow
        assignments.push(row)
        return row
      }),
      deleteMany: vi.fn(async ({ where }: { where: Record<string, unknown> }) => {
        const before = assignments.length
        for (let i = assignments.length - 1; i >= 0; i--) {
          const a = assignments[i]!
          let matches = true
          for (const [k, v] of Object.entries(where)) {
            if ((a as unknown as Record<string, unknown>)[k] !== v) {
              matches = false
              break
            }
          }
          if (matches) assignments.splice(i, 1)
        }
        return { count: before - assignments.length }
      }),
    },
    accessSubjectAttr: {
      findUnique: vi.fn(async ({ where }: { where: { subjectId: string } }) => attrs.get(where.subjectId) ?? null),
      upsert: vi.fn(
        async ({
          where,
          create,
          update,
        }: {
          where: { subjectId: string }
          create: Record<string, unknown>
          update: Record<string, unknown>
        }) => {
          const existing = attrs.get(where.subjectId)
          if (existing) {
            attrs.set(where.subjectId, { ...existing, ...(update as Partial<AttrRow>) })
          } else {
            attrs.set(where.subjectId, create as unknown as AttrRow)
          }
          return attrs.get(where.subjectId)!
        },
      ),
    },
  }
}

describe('PrismaAdapter', () => {
  let prisma: ReturnType<typeof makePrismaMock>
  let adapter: PrismaAdapter<A, R, Ro, S>

  beforeEach(() => {
    prisma = makePrismaMock()
    adapter = new PrismaAdapter<A, R, Ro, S>(prisma)
  })

  describe('Adapter.IPolicyStore', () => {
    const policy: AccessControl.IPolicy<A, R, Ro> = {
      id: 'p1',
      name: 'Test AccessControl.IPolicy',
      description: 'desc',
      version: 1,
      algorithm: 'deny-overrides',
      rules: [],
      targets: { actions: ['read'] },
    }

    it('listPolicies returns empty initially', async () => {
      expect(await adapter.listPolicies()).toEqual([])
    })

    it('savePolicy writes via upsert', async () => {
      await adapter.savePolicy(policy)
      expect(prisma.accessPolicy.upsert).toHaveBeenCalledOnce()
      const list = await adapter.listPolicies()
      expect(list).toHaveLength(1)
      expect(list[0]?.id).toBe('p1')
    })

    it('getPolicy roundtrips description and targets', async () => {
      await adapter.savePolicy(policy)
      const got = await adapter.getPolicy('p1')
      expect(got?.description).toBe('desc')
      expect(got?.targets).toEqual({ actions: ['read'] })
    })

    it('getPolicy null when missing', async () => {
      expect(await adapter.getPolicy('nope')).toBeNull()
    })

    it('savePolicy normalizes optional fields to null', async () => {
      await adapter.savePolicy({
        id: 'p2',
        name: 'Bare',
        algorithm: 'allow-overrides',
        rules: [],
      })
      const args = (prisma.accessPolicy.upsert as ReturnType<typeof vi.fn>).mock.calls[0]![0] as {
        create: Record<string, unknown>
      }
      expect(args.create.description).toBeNull()
      expect(args.create.targets).toBeNull()
      expect(args.create.version).toBe(1)
    })

    it('toPolicy converts null description back to undefined', async () => {
      await adapter.savePolicy({
        id: 'p3',
        name: 'Bare',
        algorithm: 'first-match',
        rules: [],
      })
      const got = await adapter.getPolicy('p3')
      expect(got?.description).toBeUndefined()
      expect(got?.targets).toBeUndefined()
    })

    it('deletePolicy removes the row', async () => {
      await adapter.savePolicy(policy)
      await adapter.deletePolicy('p1')
      expect(prisma.accessPolicy.delete).toHaveBeenCalledWith({ where: { id: 'p1' } })
      expect(await adapter.listPolicies()).toEqual([])
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
      const got = await adapter.getRole('editor')
      expect(got).toMatchObject({
        id: 'editor',
        name: 'Editor',
        description: 'Can edit',
        inherits: ['viewer'],
        scope: 'org-1',
        metadata: { color: 'blue' },
      })
    })

    it('getRole null when missing', async () => {
      expect(await adapter.getRole('nope')).toBeNull()
    })

    it('saveRole normalizes optionals', async () => {
      await adapter.saveRole({
        id: 'minimal' as Ro,
        name: 'Minimal',
        permissions: [],
      })
      const args = (prisma.accessRole.upsert as ReturnType<typeof vi.fn>).mock.calls[0]![0] as {
        create: Record<string, unknown>
      }
      expect(args.create.description).toBeNull()
      expect(args.create.scope).toBeNull()
      expect(args.create.metadata).toBeNull()
      expect(args.create.inherits).toEqual([])
    })

    it('toRole converts null inherits to empty array', async () => {
      await adapter.saveRole({ id: 'r2' as Ro, name: 'R', permissions: [] })
      const got = await adapter.getRole('r2')
      expect(got?.inherits).toEqual([])
    })

    it('deleteRole removes the row', async () => {
      await adapter.saveRole(role)
      await adapter.deleteRole('editor')
      expect(await adapter.listRoles()).toEqual([])
    })
  })

  describe('Adapter.ISubjectStore', () => {
    it('getSubjectRoles returns deduplicated list', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.assignRole('user-1', 'viewer' as Ro)
      const out = await adapter.getSubjectRoles('user-1')
      expect(out.sort()).toEqual(['editor', 'viewer'])
    })

    it('getSubjectScopedRoles returns only scoped', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro) // unscoped
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.assignRole('user-1', 'viewer' as Ro, 'org-2')
      const out = await adapter.getSubjectScopedRoles('user-1')
      expect(out).toHaveLength(2)
      expect(out).toContainEqual({ role: 'editor', scope: 'org-1' })
      expect(out).toContainEqual({ role: 'viewer', scope: 'org-2' })
    })

    it('assignRole writes scope:null when omitted', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      const call = (prisma.accessAssignment.create as ReturnType<typeof vi.fn>).mock.calls[0]![0] as {
        data: Record<string, unknown>
      }
      expect(call.data.scope).toBeNull()
    })

    it('revokeRole without scope clears all scopes', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.revokeRole('user-1', 'editor' as Ro)
      expect(await adapter.getSubjectRoles('user-1')).toEqual([])
    })

    it('revokeRole with scope only clears matching scope', async () => {
      await adapter.assignRole('user-1', 'editor' as Ro)
      await adapter.assignRole('user-1', 'editor' as Ro, 'org-1')
      await adapter.revokeRole('user-1', 'editor' as Ro, 'org-1')
      const remaining = await adapter.getSubjectScopedRoles('user-1')
      expect(remaining).toEqual([])
      expect(await adapter.getSubjectRoles('user-1')).toEqual(['editor'])
    })

    it('getSubjectAttributes returns {} when missing', async () => {
      expect(await adapter.getSubjectAttributes('nobody')).toEqual({})
    })

    it('setSubjectAttributes upsert + merge', async () => {
      await adapter.setSubjectAttributes('user-1', { team: 'A' })
      await adapter.setSubjectAttributes('user-1', { plan: 'pro' })
      const got = await adapter.getSubjectAttributes('user-1')
      expect(got).toEqual({ team: 'A', plan: 'pro' })
    })

    it('setSubjectAttributes overwrites existing keys on merge', async () => {
      await adapter.setSubjectAttributes('user-1', { team: 'A' })
      await adapter.setSubjectAttributes('user-1', { team: 'B' })
      expect((await adapter.getSubjectAttributes('user-1')).team).toBe('B')
    })
  })
})
