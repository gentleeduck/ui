import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import { Engine } from '../../../core/engine'
import type { AccessControl } from '../../../core/types'
import { checkAccess, createNextMiddleware, getPermissions, withAccess } from '../index'

type Action = 'read' | 'create' | 'update' | 'delete'
type ResourceType = 'post' | 'comment'
type RoleId = 'viewer' | 'editor'
type Scope = 'org-1'

const viewerRole: AccessControl.IRole<Action, ResourceType, RoleId, Scope> = {
  id: 'viewer',
  name: 'Viewer',
  permissions: [{ action: 'read', resource: 'post' }],
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

function makeRequest(opts: { url?: string; method?: string; headers?: Record<string, string> } = {}): Request {
  const url = opts.url ?? 'https://example.com/api/post'
  const init: RequestInit = { method: opts.method ?? 'GET' }
  if (opts.headers) init.headers = opts.headers
  return new Request(url, init)
}

describe('withAccess', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns 401 when userId is null', async () => {
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'delete', 'post', handler)
    const res = await wrapped(makeRequest({ method: 'DELETE' }), { params: {} })
    expect(res.status).toBe(401)
    expect(handler).not.toHaveBeenCalled()
  })

  it('reads x-user-id default header', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'delete', 'post', handler)
    await wrapped(makeRequest({ method: 'DELETE', headers: { 'x-user-id': 'u' } }), { params: {} })
    expect(can.mock.calls[0]?.[0]).toBe('u')
    can.mockRestore()
  })

  it('returns 403 when not allowed', async () => {
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'delete', 'post', handler, { getUserId: () => 'user-viewer' })
    const res = await wrapped(makeRequest({ method: 'DELETE' }), { params: {} })
    expect(res.status).toBe(403)
    expect(handler).not.toHaveBeenCalled()
  })

  it('calls handler when allowed', async () => {
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'delete', 'post', handler, { getUserId: () => 'user-editor' })
    const res = await wrapped(makeRequest({ method: 'DELETE' }), { params: {} })
    expect(handler).toHaveBeenCalledOnce()
    expect(res.status).toBe(200)
  })

  it('awaits Promise params', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'delete', 'post', handler, { getUserId: () => 'u' })
    await wrapped(makeRequest({ method: 'DELETE' }), { params: Promise.resolve({ id: '99' }) })
    expect(can.mock.calls[0]?.[2]?.id).toBe('99')
    can.mockRestore()
  })

  it('passes scope option', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess<Action, ResourceType, RoleId, Scope>(engine, 'delete', 'post', handler, {
      getUserId: () => 'u',
      scope: 'org-1',
    })
    await wrapped(makeRequest({ method: 'DELETE' }), { params: {} })
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })

  it('default getEnvironment reads x-forwarded-for + ua', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'read', 'post', handler, { getUserId: () => 'u' })
    await wrapped(makeRequest({ headers: { 'x-forwarded-for': '1.1.1.1', 'user-agent': 'curl' } }), { params: {} })
    expect(can.mock.calls[0]?.[3]?.ip).toBe('1.1.1.1')
    expect(can.mock.calls[0]?.[3]?.userAgent).toBe('curl')
    can.mockRestore()
  })

  it('onError on engine throw', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn(() => Response.json({ err: true }, { status: 599 }))
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'read', 'post', handler, { getUserId: () => 'u', onError })
    const res = await wrapped(makeRequest(), { params: {} })
    expect(res.status).toBe(599)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('async getUserId supported', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const handler = vi.fn(async () => Response.json({ ok: true }))
    const wrapped = withAccess(engine, 'read', 'post', handler, {
      getUserId: async () => 'async-user',
    })
    await wrapped(makeRequest(), { params: {} })
    expect(can.mock.calls[0]?.[0]).toBe('async-user')
    can.mockRestore()
  })
})

describe('checkAccess', () => {
  it('delegates to engine.can with attributes:{}', async () => {
    const engine = makeEngine()
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const result = await checkAccess(engine, 'user-1', 'read', 'post', 'res-id', 'org-1' as Scope)
    expect(result).toBe(true)
    expect(can).toHaveBeenCalledWith(
      'user-1',
      'read',
      { type: 'post', id: 'res-id', attributes: {} },
      undefined,
      'org-1',
    )
    can.mockRestore()
  })
})

describe('getPermissions', () => {
  it('delegates to engine.permissions', async () => {
    const engine = makeEngine()
    const map = await getPermissions(engine, 'user-viewer', [
      { action: 'read', resource: 'post' },
      { action: 'delete', resource: 'post' },
    ])
    expect(map['read:post']).toBe(true)
    expect(map['delete:post']).toBe(false)
  })
})

describe('createNextMiddleware', () => {
  let engine: Engine<Action, ResourceType, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns null when no rule matches', async () => {
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/admin', resource: 'post' }],
      getUserId: () => 'u',
    })
    const res = await mw(makeRequest({ url: 'https://x.com/public' }))
    expect(res).toBeNull()
  })

  it('returns 401 when user missing', async () => {
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/post', resource: 'post' }],
      getUserId: () => null,
    })
    const res = await mw(makeRequest({ url: 'https://x.com/post' }))
    expect(res?.status).toBe(401)
  })

  it('returns null (allow) when user is allowed', async () => {
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/post', resource: 'post', action: 'read' }],
      getUserId: () => 'user-viewer',
    })
    const res = await mw(makeRequest({ url: 'https://x.com/post' }))
    expect(res).toBeNull()
  })

  it('returns 403 when not allowed', async () => {
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/post', resource: 'post', action: 'delete' }],
      getUserId: () => 'user-viewer',
    })
    const res = await mw(makeRequest({ url: 'https://x.com/post', method: 'DELETE' }))
    expect(res?.status).toBe(403)
  })

  it('regex pattern works', async () => {
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: /^\/admin\/.*/, resource: 'post', action: 'delete' }],
      getUserId: () => 'user-editor',
    })
    expect(await mw(makeRequest({ url: 'https://x.com/admin/dashboard' }))).toBeNull()
    expect(await mw(makeRequest({ url: 'https://x.com/public' }))).toBeNull()
  })

  it('infers action from method when not set', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/post', resource: 'post' }],
      getUserId: () => 'u',
    })
    await mw(makeRequest({ url: 'https://x.com/post', method: 'DELETE' }))
    expect(can.mock.calls[0]?.[1]).toBe('delete')
    can.mockRestore()
  })

  it('passes scope from rule', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const mw = createNextMiddleware<Action, ResourceType, RoleId, Scope>(engine, {
      rules: [{ pattern: '/post', resource: 'post', action: 'read', scope: 'org-1' }],
      getUserId: () => 'u',
    })
    await mw(makeRequest({ url: 'https://x.com/post' }))
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })

  it('onError invoked on engine throw', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn(() => Response.json({ err: true }, { status: 599 }))
    const mw = createNextMiddleware(engine, {
      rules: [{ pattern: '/post', resource: 'post', action: 'read' }],
      getUserId: () => 'u',
      onError,
    })
    const res = await mw(makeRequest({ url: 'https://x.com/post' }))
    expect(res?.status).toBe(599)
  })
})
