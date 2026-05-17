import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import { Engine } from '../../../core/engine'
import type { AccessControl } from '../../../core/types'
import { accessMiddleware, adminRouter, guard } from '../index'

type Action = 'read' | 'create' | 'update' | 'delete'
type ResourceType = 'post' | 'comment'
type RoleId = 'viewer' | 'editor'
type Scope = 'org-1'

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

function makeEngine() {
  const adapter = new MemoryAdapter<Action, ResourceType, RoleId, Scope>({
    roles: [viewerRole, editorRole],
    assignments: { 'user-viewer': ['viewer'], 'user-editor': ['editor'] },
  })
  return new Engine<Action, ResourceType, RoleId, Scope>({ adapter, cacheTTL: 0 })
}

interface MockRes {
  statusCode: number
  body: unknown
  status(code: number): MockRes
  json(body: unknown): void
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: 0,
    body: undefined,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
    },
  }
  return res
}

describe('accessMiddleware (express)', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns 401 when no userId resolved', async () => {
    const mw = accessMiddleware(engine)
    const res = makeRes()
    const next = vi.fn()
    await mw(
      { method: 'GET', path: '/post' } as unknown as Parameters<typeof mw>[0],
      res as unknown as Parameters<typeof mw>[1],
      next,
    )
    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() when allowed', async () => {
    const mw = accessMiddleware(engine, { getUserId: () => 'user-viewer' })
    const res = makeRes()
    const next = vi.fn()
    await mw({ method: 'GET', path: '/post' } as Parameters<typeof mw>[0], res as Parameters<typeof mw>[1], next)
    expect(next).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(0)
  })

  it('returns 403 default onDenied when not allowed', async () => {
    const mw = accessMiddleware(engine, { getUserId: () => 'user-viewer' })
    const res = makeRes()
    const next = vi.fn()
    await mw({ method: 'DELETE', path: '/post' } as Parameters<typeof mw>[0], res as Parameters<typeof mw>[1], next)
    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
  })

  it('infers action from METHOD_ACTION_MAP', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, { getUserId: () => 'user-x' })
    await mw(
      { method: 'POST', path: '/post' } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    expect(can.mock.calls[0]?.[1]).toBe('create')
    can.mockRestore()
  })

  it('infers resource from path first segment', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, { getUserId: () => 'user-x' })
    await mw(
      { method: 'GET', path: '/comment/42' } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    const res = can.mock.calls[0]?.[2]
    expect(res?.type).toBe('comment')
    expect(res?.id).toBe('42')
    can.mockRestore()
  })

  it('uses custom getResource and getAction', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, {
      getUserId: () => 'user-x',
      getResource: () => ({ type: 'post', id: 'x', attributes: { foo: 'bar' } }),
      getAction: () => 'update',
    })
    await mw(
      { method: 'GET', path: '/anything' } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    expect(can.mock.calls[0]?.[1]).toBe('update')
    expect(can.mock.calls[0]?.[2]).toEqual({ type: 'post', id: 'x', attributes: { foo: 'bar' } })
    can.mockRestore()
  })

  it('passes scope when getScope provided', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware<Action, ResourceType, RoleId, Scope>(engine, {
      getUserId: () => 'user-x',
      getScope: () => 'org-1',
    })
    await mw(
      { method: 'GET', path: '/post' } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })

  it('custom onDenied invoked', async () => {
    const onDenied = vi.fn((_req, res: MockRes) => {
      res.status(418).json({ msg: 'teapot' })
    })
    const mw = accessMiddleware(engine, { getUserId: () => 'user-viewer', onDenied: onDenied as never })
    const res = makeRes()
    await mw({ method: 'DELETE', path: '/post' } as Parameters<typeof mw>[0], res as Parameters<typeof mw>[1], vi.fn())
    expect(res.statusCode).toBe(418)
    expect(onDenied).toHaveBeenCalledOnce()
  })

  it('onError invoked on engine throw', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn((_err, _req, res: MockRes) => {
      res.status(599).json({})
    })
    const mw = accessMiddleware(engine, { getUserId: () => 'user-x', onError: onError as never })
    const res = makeRes()
    await mw({ method: 'GET', path: '/post' } as Parameters<typeof mw>[0], res as Parameters<typeof mw>[1], vi.fn())
    expect(onError).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(599)
  })

  it('default getUserId reads req.user.id', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine)
    await mw(
      { method: 'GET', path: '/post', user: { id: 'user-from-jwt' } } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    expect(can.mock.calls[0]?.[0]).toBe('user-from-jwt')
    can.mockRestore()
  })
})

describe('guard (express)', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns 401 when no userId', async () => {
    const mw = guard(engine, 'delete', 'post')
    const res = makeRes()
    const next = vi.fn()
    await mw({ method: 'DELETE', path: '/post/1' } as Parameters<typeof mw>[0], res as Parameters<typeof mw>[1], next)
    expect(res.statusCode).toBe(401)
  })

  it('next() when allowed', async () => {
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'user-editor' })
    const next = vi.fn()
    await mw(
      { method: 'DELETE', path: '/post/1', params: { id: '1' } } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      next,
    )
    expect(next).toHaveBeenCalledOnce()
  })

  it('onDenied 403 when not allowed', async () => {
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'user-viewer' })
    const res = makeRes()
    const next = vi.fn()
    await mw(
      { method: 'DELETE', path: '/post/1', params: { id: '1' } } as Parameters<typeof mw>[0],
      res as Parameters<typeof mw>[1],
      next,
    )
    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
  })

  it('passes resourceId from params and scope', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = guard<Action, ResourceType, RoleId, Scope>(engine, 'update', 'post', {
      getUserId: () => 'u',
      scope: 'org-1',
    })
    await mw(
      { method: 'PUT', path: '/post/42', params: { id: '42' } } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      vi.fn(),
    )
    expect(can.mock.calls[0]?.[2]?.id).toBe('42')
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })

  it('forwards engine errors to next()', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('engine err'))
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'u' })
    const next = vi.fn()
    await mw(
      { method: 'DELETE', path: '/post/1' } as Parameters<typeof mw>[0],
      makeRes() as Parameters<typeof mw>[1],
      next,
    )
    expect(next).toHaveBeenCalledOnce()
    expect((next.mock.calls[0]?.[0] as Error).message).toBe('engine err')
  })
})

describe('adminRouter (express)', () => {
  type RouteHandler = (req: never, res: never) => Promise<void> | void

  const makeRouter = () => {
    const handlers: Record<string, RouteHandler> = {}
    const record = (key: string) => (path: string, h: RouteHandler) => {
      handlers[`${key} ${path}`] = h
    }
    const router = {
      get: vi.fn(record('GET')),
      put: vi.fn(record('PUT')),
      post: vi.fn(record('POST')),
      delete: vi.fn(record('DELETE')),
    }
    return { router, handlers }
  }

  it('wires CRUD endpoints to engine.admin when authorize returns true', async () => {
    const engine = makeEngine()
    const { router, handlers } = makeRouter()

    const mounted = adminRouter(engine, { authorize: () => true })(() => router as never)
    expect(mounted).toBe(router as unknown)

    const res = makeRes()
    const call = (key: string, req: unknown) => handlers[key]!(req as never, res as never)

    await call('GET /policies', {})
    expect(Array.isArray(res.body)).toBe(true)

    await call('GET /roles', {})
    expect(Array.isArray(res.body)).toBe(true)

    await call('PUT /policies', { body: { id: 'p1', name: 'P', algorithm: 'deny-overrides', rules: [] } })
    expect((res.body as { ok: boolean }).ok).toBe(true)

    await call('PUT /roles', { body: { id: 'r1', name: 'R', permissions: [] } })
    expect((res.body as { ok: boolean }).ok).toBe(true)

    await call('POST /subjects/:id/roles', {
      params: { id: 'user-1' },
      body: { roleId: 'editor', scope: 'org-1' },
    })
    expect((res.body as { ok: boolean }).ok).toBe(true)

    await call('DELETE /subjects/:id/roles/:roleId', { params: { id: 'user-1', roleId: 'editor' } })
    expect((res.body as { ok: boolean }).ok).toBe(true)
  })

  it('rejects construction without an authorize callback', () => {
    const engine = makeEngine()
    expect(() => adminRouter(engine, undefined as never)).toThrow(/authorize/)
    expect(() => adminRouter(engine, {} as never)).toThrow(/authorize/)
  })

  it('returns 401 when authorize returns false', async () => {
    const engine = makeEngine()
    const { router, handlers } = makeRouter()
    adminRouter(engine, { authorize: () => false })(() => router as never)
    const res = makeRes()

    await handlers['PUT /policies']!({ body: {} } as never, res as never)
    expect(res.statusCode).toBe(401)
    expect((res.body as { error: string }).error).toBe('Unauthorized')
  })

  it('passes the request to authorize so it can inspect headers/user', async () => {
    const engine = makeEngine()
    const { router, handlers } = makeRouter()
    const seen: Array<{ user?: { id: string; role?: string } }> = []
    adminRouter(engine, {
      authorize: (req) => {
        seen.push(req as { user?: { id: string; role?: string } })
        return (req as { user?: { role?: string } }).user?.role === 'admin'
      },
    })(() => router as never)
    const res = makeRes()

    await handlers['PUT /roles']!(
      { body: { id: 'r', name: 'r', permissions: [] }, user: { id: 'u', role: 'admin' } } as never,
      res as never,
    )
    expect((res.body as { ok: boolean }).ok).toBe(true)
    expect(seen[0]?.user?.id).toBe('u')
  })

  it('surfaces handler errors via onError without leaking authorize result', async () => {
    const engine = makeEngine()
    const { router, handlers } = makeRouter()
    const boom = new Error('boom')
    adminRouter(engine, {
      authorize: () => true,
      onError: (err, _req, res) => res.status(500).json({ error: err.message }),
    })(() => router as never)
    const original = engine.admin.savePolicy
    engine.admin.savePolicy = async () => {
      throw boom
    }
    const res = makeRes()
    await handlers['PUT /policies']!({ body: {} } as never, res as never)
    expect(res.statusCode).toBe(500)
    expect((res.body as { error: string }).error).toBe('boom')
    engine.admin.savePolicy = original
  })
})
