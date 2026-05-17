import { describe, expect, it, vi } from 'vitest'
import type { Client } from '../../../core/types'
import { createAccessControl, createPermissionChecker } from '../index'

type A = 'read' | 'create' | 'delete'
type R = 'post' | 'comment'
type S = 'org-1'

interface FakeContext<T> {
  Provider: { ctx: FakeContext<T> }
  current: T
  default: T
}

function makeFakeReact() {
  const effects: Array<{ run: () => void | (() => void); ran: boolean; cleanup?: () => void }> = []
  const states: { value: unknown; init: boolean }[] = []
  let stateIdx = 0
  let effectIdx = 0

  const React = {
    createContext<T>(defaultValue: T): FakeContext<T> {
      const ctx = { Provider: null as unknown as { ctx: FakeContext<T> }, current: defaultValue, default: defaultValue }
      ctx.Provider = { ctx }
      return ctx
    },
    useContext<T>(ctx: FakeContext<T>): T {
      return ctx.current
    },
    useMemo<T>(factory: () => T, _deps: readonly unknown[]): T {
      return factory()
    },
    // biome-ignore lint/complexity/noBannedTypes: matches React's own useCallback<T extends Function>
    useCallback<T extends Function>(cb: T, _deps: readonly unknown[]): T {
      return cb
    },
    createElement(type: unknown, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
      if (type && typeof type === 'object' && 'ctx' in (type as Record<string, unknown>)) {
        const provider = type as { ctx: FakeContext<unknown> }
        if (props && 'value' in props) {
          provider.ctx.current = props.value
        }
      }
      return { type, props: props ?? {}, children }
    },
    useState<T>(initial: T | (() => T)): [T, (v: T | ((p: T) => T)) => void] {
      const i = stateIdx++
      if (!states[i]) {
        states[i] = {
          value: typeof initial === 'function' ? (initial as () => T)() : initial,
          init: true,
        }
      }
      const slot = states[i]!
      const set = (v: T | ((p: T) => T)) => {
        slot.value = typeof v === 'function' ? (v as (p: T) => T)(slot.value as T) : v
      }
      return [slot.value as T, set]
    },
    useEffect(effect: () => void | (() => void), _deps?: readonly unknown[]): void {
      const i = effectIdx++
      if (!effects[i]) {
        effects[i] = { run: effect, ran: false }
      } else {
        effects[i]!.run = effect
      }
    },
  }

  const beginRender = () => {
    stateIdx = 0
    effectIdx = 0
  }

  return {
    React,
    beginRender,
    runEffects: async () => {
      for (const e of effects) {
        if (!e.ran) {
          const result = e.run()
          if (typeof result === 'function') e.cleanup = result
          e.ran = true
        }
      }
      await new Promise((r) => setTimeout(r, 0))
    },
  }
}

describe('createAccessControl', () => {
  const map: Client.PermissionMap<A, R, S> = {
    'read:post': true,
    'create:post': false,
    'org-1:delete:post': true,
    'delete:post:abc': true,
  } as unknown as Client.PermissionMap<A, R, S>

  it('exposes can returning true/false from map', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, useAccess } = createAccessControl<A, R, S>(React as never)

    AccessProvider({ permissions: map, children: null })

    const { can } = useAccess()
    expect(can('read', 'post')).toBe(true)
    expect(can('create', 'post')).toBe(false)
  })

  it('cannot is the inverse of can', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, useAccess } = createAccessControl<A, R, S>(React as never)

    AccessProvider({ permissions: map, children: null })

    const { cannot } = useAccess()
    expect(cannot('read', 'post')).toBe(false)
    expect(cannot('create', 'post')).toBe(true)
  })

  it('default context returns false / true', () => {
    const { React } = makeFakeReact()
    const { useAccess } = createAccessControl<A, R, S>(React as never)
    const { can, cannot } = useAccess()
    expect(can('read', 'post')).toBe(false)
    expect(cannot('read', 'post')).toBe(true)
  })

  it('scope key resolves correctly', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, useAccess } = createAccessControl<A, R, S>(React as never)
    AccessProvider({ permissions: map, children: null })
    const { can } = useAccess()
    expect(can('delete', 'post', undefined, 'org-1')).toBe(true)
  })

  it('resourceId key resolves correctly', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, useAccess } = createAccessControl<A, R, S>(React as never)
    AccessProvider({ permissions: map, children: null })
    const { can } = useAccess()
    expect(can('delete', 'post', 'abc')).toBe(true)
    expect(can('delete', 'post', 'xyz')).toBe(false)
  })

  it('Can renders children when allowed, fallback when denied', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, Can } = createAccessControl<A, R, S>(React as never)
    AccessProvider({ permissions: map, children: null })

    const allowed = Can({ action: 'read', resource: 'post', children: 'OK', fallback: 'NO' })
    expect(allowed).toBe('OK')
    const denied = Can({ action: 'create', resource: 'post', children: 'OK', fallback: 'NO' })
    expect(denied).toBe('NO')
  })

  it('Can fallback defaults to null', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, Can } = createAccessControl<A, R, S>(React as never)
    AccessProvider({ permissions: map, children: null })
    const denied = Can({ action: 'create', resource: 'post', children: 'OK' })
    expect(denied).toBe(null)
  })

  it('Cannot inverts behaviour', () => {
    const { React } = makeFakeReact()
    const { AccessProvider, Cannot } = createAccessControl<A, R, S>(React as never)
    AccessProvider({ permissions: map, children: null })

    expect(Cannot({ action: 'read', resource: 'post', children: 'denied' })).toBe(null)
    expect(Cannot({ action: 'create', resource: 'post', children: 'denied' })).toBe('denied')
  })

  it('AccessProvider returns a Provider element', () => {
    const { React } = makeFakeReact()
    const { AccessProvider } = createAccessControl<A, R, S>(React as never)
    const el = AccessProvider({ permissions: map, children: 'kids' }) as unknown as { type: { ctx: unknown } }
    expect(el.type).toHaveProperty('ctx')
  })

  describe('usePermissions', () => {
    it('fetches permissions and returns map', async () => {
      const { React, runEffects, beginRender } = makeFakeReact()
      const { usePermissions } = createAccessControl<A, R, S>(React as never)

      const fetcher = vi.fn(async () => ({ 'read:post': true }) as unknown as Client.PermissionMap<A, R, S>)

      beginRender()
      const result1 = usePermissions(fetcher)
      expect(result1.loading).toBe(true)

      await runEffects()
      await new Promise((r) => setTimeout(r, 0))

      beginRender()
      const result2 = usePermissions(fetcher)
      expect((result2.permissions as Record<string, boolean>)['read:post']).toBe(true)
      expect(result2.loading).toBe(false)
      expect(result2.can('read', 'post')).toBe(true)
    })

    it('captures fetch error', async () => {
      const { React, runEffects, beginRender } = makeFakeReact()
      const { usePermissions } = createAccessControl<A, R, S>(React as never)

      const fetcher = vi.fn(async () => {
        throw new Error('fail')
      })

      beginRender()
      usePermissions(fetcher as unknown as () => Promise<Client.PermissionMap<A, R, S>>)

      await runEffects()
      await new Promise((r) => setTimeout(r, 0))

      beginRender()
      const r = usePermissions(fetcher as unknown as () => Promise<Client.PermissionMap<A, R, S>>)
      expect(r.error?.message).toBe('fail')
      expect(r.loading).toBe(false)
    })
  })
})

describe('createPermissionChecker', () => {
  it('can returns map value', () => {
    const checker = createPermissionChecker<A, R, S>({
      'read:post': true,
      'create:post': false,
    } as unknown as Client.PermissionMap<A, R, S>)
    expect(checker.can('read', 'post')).toBe(true)
    expect(checker.can('create', 'post')).toBe(false)
  })

  it('missing key returns false', () => {
    const checker = createPermissionChecker<A, R, S>({} as unknown as Client.PermissionMap<A, R, S>)
    expect(checker.can('read', 'post')).toBe(false)
  })

  it('cannot inverts can', () => {
    const checker = createPermissionChecker<A, R, S>({
      'read:post': true,
    } as unknown as Client.PermissionMap<A, R, S>)
    expect(checker.cannot('read', 'post')).toBe(false)
    expect(checker.cannot('create', 'post')).toBe(true)
  })

  it('exposes original permissions', () => {
    const map = { 'read:post': true } as unknown as Client.PermissionMap<A, R, S>
    const checker = createPermissionChecker<A, R, S>(map)
    expect(checker.permissions).toBe(map)
  })

  it('respects scope key', () => {
    const checker = createPermissionChecker<A, R, S>({
      'org-1:delete:post': true,
    } as unknown as Client.PermissionMap<A, R, S>)
    expect(checker.can('delete', 'post', undefined, 'org-1')).toBe(true)
    expect(checker.can('delete', 'post')).toBe(false)
  })
})
