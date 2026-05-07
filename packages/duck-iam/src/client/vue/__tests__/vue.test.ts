import { describe, expect, it, vi } from 'vitest'
import type { PermissionMap } from '../../../core/types'
import { ACCESS_INJECTION_KEY, createVueAccess } from '../index'

type A = 'read' | 'create' | 'delete'
type R = 'post'
type S = 'org-1'

interface VueRef<T> {
  value: T
}

function makeFakeVue() {
  const provided = new Map<symbol | string, unknown>()

  const vue = {
    ref<T>(initial: T): VueRef<T> {
      return { value: initial }
    },
    computed<T>(getter: () => T): VueRef<T> {
      return { value: getter() }
    },
    inject<T>(key: symbol | string): T | undefined {
      return provided.get(key) as T | undefined
    },
    provide(key: symbol | string, value: unknown): void {
      provided.set(key, value)
    },
    defineComponent(options: Record<string, unknown>): unknown {
      return options
    },
    h(type: unknown, props?: Record<string, unknown> | null, children?: unknown): Record<string, unknown> {
      return { type, props, children }
    },
  }

  return { vue, provided }
}

const map: PermissionMap<A, R, S> = {
  'read:post': true,
  'create:post': false,
  'org-1:delete:post': true,
} as unknown as PermissionMap<A, R, S>

describe('createVueAccess - createAccessState', () => {
  it('can returns map values', () => {
    const { vue } = makeFakeVue()
    const { createAccessState } = createVueAccess<A, R, S>(vue)
    const state = createAccessState(map)
    expect(state.can('read', 'post')).toBe(true)
    expect(state.can('create', 'post')).toBe(false)
  })

  it('cannot inverts can', () => {
    const { vue } = makeFakeVue()
    const { createAccessState } = createVueAccess<A, R, S>(vue)
    const state = createAccessState(map)
    expect(state.cannot('read', 'post')).toBe(false)
    expect(state.cannot('create', 'post')).toBe(true)
  })

  it('scope key works', () => {
    const { vue } = makeFakeVue()
    const { createAccessState } = createVueAccess<A, R, S>(vue)
    const state = createAccessState(map)
    expect(state.can('delete', 'post', undefined, 'org-1')).toBe(true)
    expect(state.can('delete', 'post')).toBe(false)
  })

  it('update mutates reactive permissions', () => {
    const { vue } = makeFakeVue()
    const { createAccessState } = createVueAccess<A, R, S>(vue)
    const state = createAccessState({} as PermissionMap<A, R, S>)
    expect(state.can('read', 'post')).toBe(false)
    state.update({ 'read:post': true } as unknown as PermissionMap<A, R, S>)
    expect(state.can('read', 'post')).toBe(true)
  })

  it('missing key resolves false', () => {
    const { vue } = makeFakeVue()
    const { createAccessState } = createVueAccess<A, R, S>(vue)
    const state = createAccessState({} as PermissionMap<A, R, S>)
    expect(state.can('read', 'post')).toBe(false)
  })
})

describe('createVueAccess - provideAccess + useAccess', () => {
  it('provideAccess registers state via vue.provide', () => {
    const { vue, provided } = makeFakeVue()
    const { provideAccess } = createVueAccess<A, R, S>(vue)
    provideAccess(map)
    expect(provided.has(ACCESS_INJECTION_KEY)).toBe(true)
  })

  it('useAccess returns provided state', () => {
    const { vue } = makeFakeVue()
    const { provideAccess, useAccess } = createVueAccess<A, R, S>(vue)
    provideAccess(map)
    const state = useAccess()
    expect(state.can('read', 'post')).toBe(true)
  })

  it('useAccess throws when no provider', () => {
    const { vue } = makeFakeVue()
    const { useAccess } = createVueAccess<A, R, S>(vue)
    expect(() => useAccess()).toThrow(/useAccess.*provideAccess/)
  })
})

describe('createVueAccess - createAccessPlugin', () => {
  it('install provides state and registers globals', () => {
    const { vue, provided } = makeFakeVue()
    const { createAccessPlugin } = createVueAccess<A, R, S>(vue)
    const plugin = createAccessPlugin(map)
    const globalProps: Record<string, unknown> = {}
    const app = {
      provide: (key: symbol | string, value: unknown) => {
        provided.set(key, value)
      },
      config: { globalProperties: globalProps },
    }
    plugin.install(app)
    expect(provided.has(ACCESS_INJECTION_KEY)).toBe(true)
    expect(typeof globalProps.$can).toBe('function')
    expect(typeof globalProps.$cannot).toBe('function')
    const $can = globalProps.$can as (a: A, r: R, id?: string, s?: S) => boolean
    expect($can('read', 'post')).toBe(true)
    expect($can('create', 'post')).toBe(false)
  })
})

describe('createVueAccess - Can/Cannot components', () => {
  it('Can renders default slot when allowed, fallback when denied', () => {
    const { vue } = makeFakeVue()
    const access = createVueAccess<A, R, S>(vue)
    access.provideAccess(map)
    const Can = access.Can as {
      setup: (props: Record<string, string>, ctx: { slots: Record<string, () => unknown> }) => () => unknown
    }

    const defaultSlot = vi.fn(() => 'OK')
    const fallbackSlot = vi.fn(() => 'NO')

    const renderAllowed = Can.setup(
      { action: 'read', resource: 'post' },
      { slots: { default: defaultSlot, fallback: fallbackSlot } },
    )
    expect(renderAllowed()).toBe('OK')
    expect(defaultSlot).toHaveBeenCalled()

    const renderDenied = Can.setup(
      { action: 'create', resource: 'post' },
      { slots: { default: defaultSlot, fallback: fallbackSlot } },
    )
    expect(renderDenied()).toBe('NO')
  })

  it('Can with no fallback returns undefined when denied', () => {
    const { vue } = makeFakeVue()
    const access = createVueAccess<A, R, S>(vue)
    access.provideAccess(map)
    const Can = access.Can as {
      setup: (p: Record<string, string>, c: { slots: Record<string, undefined | (() => unknown)> }) => () => unknown
    }
    const render = Can.setup({ action: 'create', resource: 'post' }, { slots: { default: () => 'OK' } })
    expect(render()).toBeUndefined()
  })

  it('Cannot renders when denied, null when allowed', () => {
    const { vue } = makeFakeVue()
    const access = createVueAccess<A, R, S>(vue)
    access.provideAccess(map)
    const Cannot = access.Cannot as {
      setup: (p: Record<string, string>, c: { slots: Record<string, () => unknown> }) => () => unknown
    }

    const slot = vi.fn(() => 'denied')
    const denied = Cannot.setup({ action: 'create', resource: 'post' }, { slots: { default: slot } })
    expect(denied()).toBe('denied')
    const allowed = Cannot.setup({ action: 'read', resource: 'post' }, { slots: { default: slot } })
    expect(allowed()).toBeNull()
  })

  it('Can returns options with name="Can"', () => {
    const { vue } = makeFakeVue()
    const { Can, Cannot } = createVueAccess<A, R, S>(vue)
    expect((Can as { name: string }).name).toBe('Can')
    expect((Cannot as { name: string }).name).toBe('Cannot')
  })
})

describe('exports', () => {
  it('exports stable injection key as Symbol', () => {
    expect(typeof ACCESS_INJECTION_KEY).toBe('symbol')
  })
})
