import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { KeyHandler, Registry } from '../command'

function createTestKeyboardEvent(key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...options,
  })
}

describe('KeyHandler & Registry', () => {
  let registry: Registry
  let handler: KeyHandler
  let target: HTMLElement

  beforeEach(() => {
    registry = new Registry(true)
    handler = new KeyHandler(registry, 100)
    target = document.createElement('div')
    document.body.appendChild(target)
    handler.attach(target)
  })

  afterEach(() => {
    handler.detach(target)
    document.body.removeChild(target)
  })

  it('registers and executes a single-key command', () => {
    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' })

    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalled()
  })

  it('registers and executes a multi-key sequence', async () => {
    const fn = vi.fn()
    registry.register('g+d', { execute: fn, name: 'go' })

    target.dispatchEvent(createTestKeyboardEvent('g'))
    target.dispatchEvent(createTestKeyboardEvent('d'))

    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalled()
  })

  it('handles invalid sequence and retries with final key', async () => {
    const fn = vi.fn()
    registry.register('d', { execute: fn, name: 'only-d' })

    target.dispatchEvent(createTestKeyboardEvent('x')) // invalid
    target.dispatchEvent(createTestKeyboardEvent('d'))

    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalled()
  })

  it('resets sequence after timeout', async () => {
    const fn = vi.fn()
    registry.register('g+d', { execute: fn, name: 'go' })

    target.dispatchEvent(createTestKeyboardEvent('g'))
    await new Promise((r) => setTimeout(r, 150)) // longer than timeout
    target.dispatchEvent(createTestKeyboardEvent('d'))

    await new Promise((r) => setTimeout(r, 50))
    expect(fn).not.toHaveBeenCalled()
  })

  it('respects prefixes correctly', async () => {
    const fn = vi.fn()
    registry.register('space+s', { execute: fn, name: 'save' })

    target.dispatchEvent(createTestKeyboardEvent(' ', {}))
    target.dispatchEvent(createTestKeyboardEvent('s'))

    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalled()
  })
})

describe('Registry - enhanced features', () => {
  let registry: Registry

  beforeEach(() => {
    registry = new Registry(false)
  })

  it('returns a RegistrationHandle from register()', () => {
    const handle = registry.register('ctrl+k', { execute: vi.fn(), name: 'test' })
    expect(handle).toBeDefined()
    expect(typeof handle.unregister).toBe('function')
    expect(typeof handle.setEnabled).toBe('function')
    expect(typeof handle.isEnabled).toBe('function')
    expect(typeof handle.resetFired).toBe('function')
  })

  it('unregisters a command via handle', () => {
    const handle = registry.register('ctrl+k', { execute: vi.fn(), name: 'test' })
    expect(registry.hasCommand('ctrl+k')).toBe(true)

    handle.unregister()
    expect(registry.hasCommand('ctrl+k')).toBe(false)
  })

  it('unregisters a command via unregister()', () => {
    registry.register('ctrl+k', { execute: vi.fn(), name: 'test' })
    expect(registry.unregister('ctrl+k')).toBe(true)
    expect(registry.hasCommand('ctrl+k')).toBe(false)
  })

  it('returns false when unregistering non-existent key', () => {
    expect(registry.unregister('ctrl+k')).toBe(false)
  })

  it('recalculates prefixes after unregister', () => {
    registry.register('g+d', { execute: vi.fn(), name: 'test' })
    expect(registry.isPrefix('g')).toBe(true)

    registry.unregister('g+d')
    expect(registry.isPrefix('g')).toBe(false)
  })

  it('toggles enabled via handle', () => {
    const handle = registry.register('k', { execute: vi.fn(), name: 'test' })
    expect(handle.isEnabled()).toBe(true)

    handle.setEnabled(false)
    expect(handle.isEnabled()).toBe(false)
  })

  it('warns on conflict by default', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    registry.register('k', { execute: vi.fn(), name: 'first' })
    registry.register('k', { execute: vi.fn(), name: 'second' })
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('throws on conflict with error behavior', () => {
    registry.register('k', { execute: vi.fn(), name: 'first' })
    expect(() => {
      registry.register('k', { execute: vi.fn(), name: 'second' }, { conflictBehavior: 'error' })
    }).toThrow("Key binding 'k' is already registered")
  })

  it('silently replaces with replace behavior', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fn2 = vi.fn()
    registry.register('k', { execute: vi.fn(), name: 'first' })
    registry.register('k', { execute: fn2, name: 'second' }, { conflictBehavior: 'replace' })
    expect(spy).not.toHaveBeenCalled()
    expect(registry.getCommand('k')?.name).toBe('second')
    spy.mockRestore()
  })

  it('gets all commands', () => {
    registry.register('a', { execute: vi.fn(), name: 'cmd-a' })
    registry.register('b', { execute: vi.fn(), name: 'cmd-b' })
    const all = registry.getAllCommands()
    expect(all.size).toBe(2)
    expect(all.get('a')?.name).toBe('cmd-a')
  })

  it('clears all commands', () => {
    registry.register('a', { execute: vi.fn(), name: 'cmd-a' })
    registry.register('b', { execute: vi.fn(), name: 'cmd-b' })
    registry.clear()
    expect(registry.hasCommand('a')).toBe(false)
    expect(registry.hasCommand('b')).toBe(false)
  })

  it('retrieves options via getOptions', () => {
    registry.register('k', { execute: vi.fn(), name: 'test' }, { preventDefault: true })
    expect(registry.getOptions('k')?.preventDefault).toBe(true)
  })
})

describe('KeyHandler - enhanced features', () => {
  let registry: Registry
  let handler: KeyHandler
  let target: HTMLElement

  beforeEach(() => {
    registry = new Registry(false)
    target = document.createElement('div')
    document.body.appendChild(target)
  })

  afterEach(() => {
    handler?.detach(target)
    if (target.parentNode) document.body.removeChild(target)
  })

  it('skips disabled commands', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { enabled: false })
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('calls preventDefault when option set', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { preventDefault: true })
    const event = createTestKeyboardEvent('k')
    const spy = vi.spyOn(event, 'preventDefault')
    target.dispatchEvent(event)
    expect(spy).toHaveBeenCalled()
    expect(fn).toHaveBeenCalled()
  })

  it('calls stopPropagation when option set', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { stopPropagation: true })
    const event = createTestKeyboardEvent('k')
    const spy = vi.spyOn(event, 'stopPropagation')
    target.dispatchEvent(event)
    expect(spy).toHaveBeenCalled()
  })

  it('respects requireReset - fires only once', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    const handle = registry.register('k', { execute: fn, name: 'test' }, { requireReset: true })
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce()

    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce() // still 1

    handle.resetFired()
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('uses default options from constructor', () => {
    handler = new KeyHandler(registry, 100, { preventDefault: true })
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' })
    const event = createTestKeyboardEvent('k')
    const spy = vi.spyOn(event, 'preventDefault')
    target.dispatchEvent(event)
    expect(spy).toHaveBeenCalled()
  })

  it('per-binding options override defaults', () => {
    handler = new KeyHandler(registry, 100, { preventDefault: true })
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { preventDefault: false })
    const event = createTestKeyboardEvent('k')
    const spy = vi.spyOn(event, 'preventDefault')
    target.dispatchEvent(event)
    expect(spy).not.toHaveBeenCalled()
  })
})
