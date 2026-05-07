import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryAdapter } from '../../../adapters/memory'
import { Engine } from '../../../core/engine'
import type { Role } from '../../../core/types'
import {
  ACCESS_ENGINE_TOKEN,
  ACCESS_METADATA_KEY,
  Authorize,
  createEngineProvider,
  createTypedAuthorize,
  nestAccessGuard,
} from '../index'

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

function makeCtx(opts: {
  user?: Record<string, unknown>
  params?: Record<string, string>
  method?: string
  path?: string
  routePath?: string
  headers?: Record<string, string>
  handler: object
}) {
  return {
    switchToHttp() {
      return {
        getRequest() {
          return {
            user: opts.user,
            params: opts.params ?? {},
            method: opts.method ?? 'GET',
            path: opts.path ?? '/',
            route: opts.routePath ? { path: opts.routePath } : undefined,
            headers: opts.headers,
          }
        },
      }
    },
    getHandler() {
      return opts.handler
    },
  }
}

describe('@Authorize decorator', () => {
  it('attaches __accessMeta to descriptor.value', () => {
    const fn = function handler() {
      return null
    }
    const desc = { value: fn, configurable: true, writable: true } as PropertyDescriptor
    const dec = Authorize({ action: 'delete', resource: 'post' })
    dec({} as never, 'method', desc)
    expect((fn as unknown as { __accessMeta: { action: string } }).__accessMeta).toEqual({
      action: 'delete',
      resource: 'post',
    })
  })

  it('default meta has infer:true', () => {
    const fn = function handler() {
      return null
    }
    const desc = { value: fn, configurable: true, writable: true } as PropertyDescriptor
    Authorize()({} as never, 'method', desc)
    expect((fn as unknown as { __accessMeta: { infer: boolean } }).__accessMeta.infer).toBe(true)
  })

  it('createTypedAuthorize returns Authorize itself', () => {
    expect(createTypedAuthorize<Action, Resource, Scope>()).toBe(Authorize)
  })

  it('exports stable metadata key', () => {
    expect(ACCESS_METADATA_KEY).toBe('duck-iam:authorize')
  })
})

describe('nestAccessGuard', () => {
  let engine: Engine<Action, Resource, RoleId, Scope>

  beforeEach(() => {
    engine = makeEngine()
  })

  it('returns true when handler has no @Authorize meta', async () => {
    const guard = nestAccessGuard(engine)
    const handler = function noAuth() {}
    const ctx = makeCtx({ user: { id: 'user-viewer' }, handler })
    expect(await guard(ctx)).toBe(true)
  })

  it('returns false when no userId resolved', async () => {
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ handler })
    expect(await guard(ctx)).toBe(false)
  })

  it('returns true when allowed', async () => {
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'user-editor' }, handler })
    expect(await guard(ctx)).toBe(true)
  })

  it('returns false when denied', async () => {
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'user-viewer' }, handler })
    expect(await guard(ctx)).toBe(false)
  })

  it('uses user.sub fallback when user.id missing', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'read', resource: 'post' },
    })
    const ctx = makeCtx({ user: { sub: 'user-from-sub' }, handler })
    await guard(ctx)
    expect(can.mock.calls[0]?.[0]).toBe('user-from-sub')
    can.mockRestore()
  })

  it('uses params.id as resource id', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'u' }, params: { id: '42' }, handler })
    await guard(ctx)
    expect(can.mock.calls[0]?.[2]?.id).toBe('42')
    can.mockRestore()
  })

  it('infer:true derives action from method and resource from path', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', { value: { infer: true } })
    const ctx = makeCtx({
      user: { id: 'u' },
      method: 'DELETE',
      routePath: '/api/posts/:id',
      handler,
    })
    await guard(ctx)
    expect(can.mock.calls[0]?.[1]).toBe('delete')
    can.mockRestore()
  })

  it('decorator scope takes precedence over getScope', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const guard = nestAccessGuard<Action, Resource, RoleId, Scope>(engine, {
      getScope: () => 'org-1',
    })
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post', scope: 'org-decorator' },
    })
    const ctx = makeCtx({ user: { id: 'u' }, handler })
    await guard(ctx)
    expect(can.mock.calls[0]?.[4]).toBe('org-decorator')
    can.mockRestore()
  })

  it('falls back to getScope when decorator scope absent', async () => {
    const can = vi.spyOn(engine, 'can').mockResolvedValue(true)
    const guard = nestAccessGuard<Action, Resource, RoleId, Scope>(engine, {
      getScope: () => 'org-1',
    })
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'u' }, handler })
    await guard(ctx)
    expect(can.mock.calls[0]?.[4]).toBe('org-1')
    can.mockRestore()
  })

  it('onError handles engine throw - default returns false', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const guard = nestAccessGuard(engine)
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'u' }, handler })
    expect(await guard(ctx)).toBe(false)
  })

  it('custom onError can override result', async () => {
    vi.spyOn(engine, 'can').mockRejectedValue(new Error('boom'))
    const onError = vi.fn(() => true)
    const guard = nestAccessGuard(engine, { onError })
    const handler = function h() {}
    Object.defineProperty(handler, '__accessMeta', {
      value: { action: 'delete', resource: 'post' },
    })
    const ctx = makeCtx({ user: { id: 'u' }, handler })
    expect(await guard(ctx)).toBe(true)
    expect(onError).toHaveBeenCalledOnce()
  })
})

describe('createEngineProvider', () => {
  it('creates a NestJS provider with the engine token', () => {
    const factory = () => makeEngine()
    const provider = createEngineProvider(factory)
    expect(provider.provide).toBe(ACCESS_ENGINE_TOKEN)
    expect(provider.useFactory).toBe(factory)
  })

  it('exports stable engine token', () => {
    expect(ACCESS_ENGINE_TOKEN).toBe('ACCESS_ENGINE')
  })
})
