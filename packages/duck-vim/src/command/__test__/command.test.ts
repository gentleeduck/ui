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
