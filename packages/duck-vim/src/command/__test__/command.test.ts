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

  it('requireReset auto-clears on keyup of the binding key', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { requireReset: true })
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce()

    // Release the key — should auto-clear `fired`.
    target.dispatchEvent(new KeyboardEvent('keyup', { key: 'k', bubbles: true }))

    // Now the binding can fire again without manual resetFired().
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('requireReset auto-clears on keyup for chord bindings', async () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('g+d', { execute: fn, name: 'goto-def' }, { requireReset: true })

    // First chord press
    target.dispatchEvent(createTestKeyboardEvent('g'))
    target.dispatchEvent(createTestKeyboardEvent('d'))
    await new Promise((r) => setTimeout(r, 10))
    expect(fn).toHaveBeenCalledOnce()

    // Second chord press without releasing — blocked by requireReset
    target.dispatchEvent(createTestKeyboardEvent('g'))
    target.dispatchEvent(createTestKeyboardEvent('d'))
    await new Promise((r) => setTimeout(r, 10))
    expect(fn).toHaveBeenCalledOnce()

    // Release `d` — should auto-clear `fired` on the `g+d` chord entry.
    target.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', bubbles: true }))

    // Now the chord can fire again.
    target.dispatchEvent(createTestKeyboardEvent('g'))
    target.dispatchEvent(createTestKeyboardEvent('d'))
    await new Promise((r) => setTimeout(r, 10))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('honors eventType: "keyup" — fires on keyup, not keydown', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'on-keyup' }, { eventType: 'keyup' })

    // Keydown should NOT fire a keyup-typed binding.
    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).not.toHaveBeenCalled()

    // Keyup fires it.
    target.dispatchEvent(new KeyboardEvent('keyup', { key: 'k', bubbles: true }))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('default eventType is keydown — keyup does not fire it', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'on-keydown' })

    target.dispatchEvent(new KeyboardEvent('keyup', { key: 'k', bubbles: true }))
    expect(fn).not.toHaveBeenCalled()

    target.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce()
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

describe('Registry - edge cases', () => {
  let registry: Registry

  beforeEach(() => {
    registry = new Registry(false)
  })

  it('getCommand returns undefined for non-existent key', () => {
    expect(registry.getCommand('ctrl+z')).toBeUndefined()
  })

  it('getEntry returns undefined for non-existent key', () => {
    expect(registry.getEntry('ctrl+z')).toBeUndefined()
  })

  it('getOptions returns undefined for non-existent key', () => {
    expect(registry.getOptions('ctrl+z')).toBeUndefined()
  })

  it('hasCommand returns false for non-existent key', () => {
    expect(registry.hasCommand('ctrl+z')).toBe(false)
  })

  it('isPrefix returns false when no commands registered', () => {
    expect(registry.isPrefix('g')).toBe(false)
  })

  it('getAllCommands returns empty map when no commands', () => {
    expect(registry.getAllCommands().size).toBe(0)
  })

  it('clear on empty registry does not throw', () => {
    expect(() => registry.clear()).not.toThrow()
  })

  it('allows re-registration after unregister', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    registry.register('k', { execute: fn1, name: 'first' })
    registry.unregister('k')
    registry.register('k', { execute: fn2, name: 'second' })
    expect(registry.getCommand('k')?.name).toBe('second')
  })

  it('handle unregister is idempotent', () => {
    const handle = registry.register('k', { execute: vi.fn(), name: 'test' })
    handle.unregister()
    expect(registry.hasCommand('k')).toBe(false)
    // Second call should not throw
    expect(() => handle.unregister()).not.toThrow()
  })

  it('setEnabled toggles and isEnabled reflects it', () => {
    const handle = registry.register('k', { execute: vi.fn(), name: 'test' })
    handle.setEnabled(false)
    expect(handle.isEnabled()).toBe(false)
    handle.setEnabled(true)
    expect(handle.isEnabled()).toBe(true)
  })

  it('builds prefixes for multi-segment keys', () => {
    registry.register('g+d+w', { execute: vi.fn(), name: 'deep' })
    expect(registry.isPrefix('g')).toBe(true)
    expect(registry.isPrefix('g+d')).toBe(true)
    expect(registry.isPrefix('g+d+w')).toBe(true)
  })

  it('prefixes update when multiple commands share prefix and one is removed', () => {
    registry.register('g+d', { execute: vi.fn(), name: 'gd' })
    registry.register('g+w', { execute: vi.fn(), name: 'gw' })
    expect(registry.isPrefix('g')).toBe(true)

    registry.unregister('g+d')
    // 'g' is still a prefix because g+w exists
    expect(registry.isPrefix('g')).toBe(true)

    registry.unregister('g+w')
    expect(registry.isPrefix('g')).toBe(false)
  })

  it('conflict behavior allow does not warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    registry.register('k', { execute: vi.fn(), name: 'first' })
    registry.register('k', { execute: vi.fn(), name: 'second' }, { conflictBehavior: 'allow' })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('debug mode logs on register and unregister', () => {
    const debugRegistry = new Registry(true)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    debugRegistry.register('k', { execute: vi.fn(), name: 'test' })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Registered 'k'"))
    debugRegistry.unregister('k')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Unregistered 'k'"))
    spy.mockRestore()
  })

  it('debug mode logs on clear', () => {
    const debugRegistry = new Registry(true)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    debugRegistry.register('k', { execute: vi.fn(), name: 'test' })
    debugRegistry.clear()
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Cleared all commands'))
    spy.mockRestore()
  })
})

describe('KeyHandler - edge cases', () => {
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

  it('ignores pure modifier key presses', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' })

    target.dispatchEvent(createTestKeyboardEvent('Shift'))
    target.dispatchEvent(createTestKeyboardEvent('Control'))
    target.dispatchEvent(createTestKeyboardEvent('Alt'))
    target.dispatchEvent(createTestKeyboardEvent('Meta'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('normalizes space key in sequences', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('space', { execute: fn, name: 'space-cmd' })
    target.dispatchEvent(createTestKeyboardEvent(' '))
    expect(fn).toHaveBeenCalled()
  })

  it('normalizes escape key in sequences', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('esc', { execute: fn, name: 'esc-cmd' })
    target.dispatchEvent(createTestKeyboardEvent('Escape'))
    expect(fn).toHaveBeenCalled()
  })

  it('normalizes control key descriptor to ctrl', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('ctrl+s', { execute: fn, name: 'save' })
    target.dispatchEvent(createTestKeyboardEvent('s', { ctrlKey: true }))
    expect(fn).toHaveBeenCalled()
  })

  it('skips command when ignoreInputs is set and target is input', () => {
    handler = new KeyHandler(registry, 100)

    const input = document.createElement('input')
    input.type = 'text'
    document.body.appendChild(input)
    handler.attach(input)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' }, { ignoreInputs: true })
    input.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).not.toHaveBeenCalled()

    handler.detach(input)
    document.body.removeChild(input)
  })

  it('handles modifier key combinations in descriptor', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('ctrl+alt+shift+s', { execute: fn, name: 'complex' })
    target.dispatchEvent(createTestKeyboardEvent('s', { ctrlKey: true, altKey: true, shiftKey: true }))
    expect(fn).toHaveBeenCalled()
  })

  it('builds descriptor with meta modifier', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('meta+s', { execute: fn, name: 'meta-save' })
    target.dispatchEvent(createTestKeyboardEvent('s', { metaKey: true }))
    expect(fn).toHaveBeenCalled()
  })

  it('retries last key as prefix after failed sequence', async () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('g+d', { execute: fn, name: 'gd' })

    // 'x' is not a command or prefix, so sequence resets
    // 'g' is then retried and becomes a prefix
    target.dispatchEvent(createTestKeyboardEvent('x'))
    target.dispatchEvent(createTestKeyboardEvent('g'))
    target.dispatchEvent(createTestKeyboardEvent('d'))

    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalled()
  })

  it('attach to document by default works', () => {
    handler = new KeyHandler(registry, 100)
    // attach() with no arguments defaults to document
    expect(() => handler.attach()).not.toThrow()
    handler.detach()
  })

  it('detach from document by default works', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach()
    expect(() => handler.detach()).not.toThrow()
  })

  it('detach() with no arg removes listener from originally attached target', () => {
    handler = new KeyHandler(registry, 100)
    const customTarget = document.createElement('div')
    document.body.appendChild(customTarget)

    const fn = vi.fn()
    registry.register('k', { execute: fn, name: 'test' })

    handler.attach(customTarget)
    customTarget.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce()

    // detach() without arg should clean up the listener on customTarget.
    handler.detach()
    customTarget.dispatchEvent(createTestKeyboardEvent('k'))
    expect(fn).toHaveBeenCalledOnce() // still 1 — listener removed

    document.body.removeChild(customTarget)
  })

  it('handles F-key bindings', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('f1', { execute: fn, name: 'help' })
    target.dispatchEvent(createTestKeyboardEvent('F1'))
    expect(fn).toHaveBeenCalled()
  })

  it('handles Tab key', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('tab', { execute: fn, name: 'tab-cmd' })
    target.dispatchEvent(createTestKeyboardEvent('Tab'))
    expect(fn).toHaveBeenCalled()
  })

  it('handles Backspace key', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('backspace', { execute: fn, name: 'backspace-cmd' })
    target.dispatchEvent(createTestKeyboardEvent('Backspace'))
    expect(fn).toHaveBeenCalled()
  })

  it('handles Delete key', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('delete', { execute: fn, name: 'delete-cmd' })
    target.dispatchEvent(createTestKeyboardEvent('Delete'))
    expect(fn).toHaveBeenCalled()
  })

  it('handles Enter key', () => {
    handler = new KeyHandler(registry, 100)
    handler.attach(target)

    const fn = vi.fn()
    registry.register('enter', { execute: fn, name: 'enter-cmd' })
    target.dispatchEvent(createTestKeyboardEvent('Enter'))
    expect(fn).toHaveBeenCalled()
  })
})
