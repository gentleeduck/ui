import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import { Engine } from '../../../core/engine'
import type { Role } from '../../../core/types'
import { accessMiddleware, guard } from '../index'

type Action = 'read' | 'create' | 'update' | 'delete'
type Resource = 'post' | 'comment'
type RoleId = 'viewer' | 'editor'
type Scope = 'org-1'

const viewerRole: Role<Action, Resource, RoleId, Scope> = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [{ action: 'read', resource: 'post' }],
}
const editorRole: Role<Action, Resource, RoleId, Scope> = {
  id: 'editor',
  name: 'Editor',
  inherits: ['viewer'],
  permissions: [
    { action: 'create', resource: 'post' },
    { action: 'delete', resource: 'post' },
  ],
}

function makeEngine() {
  const adapter = new MemoryAdapter<Action, Resource, RoleId, Scope>({
    roles: [viewerRole, editorRole],
    assignments: { 'user-viewer': ['viewer'], 'user-editor': ['editor'] },
  })
  return new Engine<Action, Resource, RoleId, Scope>({ adapter, cacheTTL: 0 })
}

interface RecordedJson {
  data: unknown
  status: number
}

function makeContext(opts: {
  method?: string
  path?: string
  url?: string
  headers?: Record<string, string>
  state?: Record<string, unknown>
  params?: Record<string, string>
}) {
  const json: RecordedJson[] = []
  const state = opts.state ?? {}
  return {
    json,
    ctx: {
      req: {
        method: opts.method ?? 'GET',
        path: opts.path ?? '/',
        url: opts.url ?? `https://example.com${opts.path ?? '/'}`,
        header(name: string) {
          return opts.headers?.[name.toLowerCase()] ?? opts.headers?.[name]
        },
        param(name: string) {
          return opts.params?.[name]
        },
      },
      get(key: string) {
        return state[key]
      },
      set(key: string, value: unknown) {
        state[key] = value
      },
      json(data: unknown, status = 200) {
        json.push({ data, status })
        return new Response(JSON.stringify(data), { status })
      },
      text(_data: string, status = 200) {
        return new Response(_data, { status })
      },
    },
  }
}

describe('accessMiddleware (hono)', () => {
  let engine: Engine<Action, Resource, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns 401 when userId missing', async () => {
    const mw = accessMiddleware(engine)
    const { ctx, json } = makeContext({ method: 'GET', path: '/post' })
    const next = vi.fn(async () => undefined)
    await mw(ctx, next)
    expect(json[0]?.status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('reads userId from context state first', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine)
    const { ctx } = makeContext({ method: 'GET', path: '/post', state: { userId: 'user-state' } })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[0]).toBe('user-state')
    can.mockRestore()
  })

  it('falls back to x-user-id header', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine)
    const { ctx } = makeContext({ method: 'GET', path: '/post', headers: { 'x-user-id': 'user-hdr' } })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[0]).toBe('user-hdr')
    can.mockRestore()
  })

  it('calls next when allowed', async () => {
    const mw = accessMiddleware(engine, { getUserId: () => 'user-viewer' })
    const { ctx } = makeContext({ method: 'GET', path: '/post' })
    const next = vi.fn(async () => undefined)
    await mw(ctx, next)
    expect(next).toHaveBeenCalledOnce()
  })

  it('returns 403 default when denied', async () => {
    const mw = accessMiddleware(engine, { getUserId: () => 'user-viewer' })
    const { ctx, json } = makeContext({ method: 'DELETE', path: '/post' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(json[0]?.status).toBe(403)
  })

  it('infers action from method', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, { getUserId: () => 'u' })
    const { ctx } = makeContext({ method: 'PATCH', path: '/post' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[1]).toBe('update')
    can.mockRestore()
  })

  it('uses default env extractor with cf-connecting-ip', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, { getUserId: () => 'u' })
    const { ctx } = makeContext({
      method: 'GET',
      path: '/post',
      headers: { 'cf-connecting-ip': '1.2.3.4', 'user-agent': 'curl' },
    })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[3]?.ip).toBe('1.2.3.4')
    expect(can.mock.calls[0]?.[3]?.userAgent).toBe('curl')
    can.mockRestore()
  })

  it('falls back to x-forwarded-for', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware(engine, { getUserId: () => 'u' })
    const { ctx } = makeContext({
      method: 'GET',
      path: '/post',
      headers: { 'x-forwarded-for': '5.6.7.8' },
    })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[3]?.ip).toBe('5.6.7.8')
    can.mockRestore()
  })

  it('onError handles engine throw', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn((_e, c) => c.json({ err: true }, 599))
    const mw = accessMiddleware(engine, { getUserId: () => 'u', onError })
    const { ctx, json } = makeContext({ method: 'GET', path: '/post' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(json[0]?.status).toBe(599)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('getScope passed to engine', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = accessMiddleware<Action, Resource, RoleId, Scope>(engine, {
      getUserId: () => 'u',
      getScope: () => 'org-1',
    })
    const { ctx } = makeContext({ method: 'GET', path: '/post' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })
})

describe('guard (hono)', () => {
  let engine: Engine<Action, Resource, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('401 when no user', async () => {
    const mw = guard(engine, 'delete', 'post')
    const { ctx, json } = makeContext({ method: 'DELETE', path: '/post/1' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(json[0]?.status).toBe(401)
  })

  it('next() when allowed', async () => {
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'user-editor' })
    const { ctx } = makeContext({ method: 'DELETE', path: '/post/1', params: { id: '1' } })
    const next = vi.fn(async () => undefined)
    await mw(ctx, next)
    expect(next).toHaveBeenCalledOnce()
  })

  it('403 when denied', async () => {
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'user-viewer' })
    const { ctx, json } = makeContext({ method: 'DELETE', path: '/post/1', params: { id: '1' } })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(json[0]?.status).toBe(403)
  })

  it('passes resource id from param("id")', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'u' })
    const { ctx } = makeContext({ method: 'DELETE', path: '/post/42', params: { id: '42' } })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(can.mock.calls[0]?.[2]?.id).toBe('42')
    can.mockRestore()
  })

  it('onError invoked on throw', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn((_e, c) => c.json({ err: true }, 599))
    const mw = guard(engine, 'delete', 'post', { getUserId: () => 'u', onError })
    const { ctx, json } = makeContext({ method: 'DELETE', path: '/post/1' })
    await mw(
      ctx,
      vi.fn(async () => undefined),
    )
    expect(json[0]?.status).toBe(599)
  })
})
