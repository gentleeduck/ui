import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSequenceMatcher, SequenceManager } from '../sequence'

function createEvent(key: string, opts: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts })
}

describe('SequenceManager', () => {
  let manager: SequenceManager

  afterEach(() => {
    manager?.destroy()
  })

  it('matches a two-step sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('does not match incomplete sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('x'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('resets on timeout', async () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
      options: { timeout: 50 },
    })

    manager.handleKeyEvent(createEvent('g'))
    await new Promise((r) => setTimeout(r, 100))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('retries from step 0 on mismatch', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('x'))
    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('handles concurrent sequences', () => {
    manager = new SequenceManager()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    manager.register({
      steps: [{ binding: 'd' }, { binding: 'd' }],
      handler: fn1,
    })
    manager.register({
      steps: [{ binding: 'd' }, { binding: 'w' }],
      handler: fn2,
    })

    manager.handleKeyEvent(createEvent('d'))
    manager.handleKeyEvent(createEvent('w'))
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledOnce()
  })

  it('unregisters a sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    const handle = manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    handle.unregister()
    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('respects enabled option', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
      options: { enabled: false },
    })

    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('reports matching state', () => {
    manager = new SequenceManager()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: () => {},
    })

    expect(manager.getState().isMatching).toBe(false)
    manager.handleKeyEvent(createEvent('g'))
    const state = manager.getState()
    expect(state.isMatching).toBe(true)
    expect(state.completedSteps).toBe(1)
    expect(state.totalSteps).toBe(2)
  })

  it('resets all entries via reset()', () => {
    manager = new SequenceManager()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: () => {},
    })

    manager.handleKeyEvent(createEvent('g'))
    expect(manager.getState().isMatching).toBe(true)
    manager.reset()
    expect(manager.getState().isMatching).toBe(false)
  })

  it('skips pure modifier key presses', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('Shift'))
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('createSequenceMatcher', () => {
  it('matches a sequence via feed()', () => {
    const fn = vi.fn()
    const matcher = createSequenceMatcher(['g', 'd'], fn)

    matcher.feed(createEvent('g'))
    expect(fn).not.toHaveBeenCalled()
    matcher.feed(createEvent('d'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('reports state via getState()', () => {
    const matcher = createSequenceMatcher(['g', 'd'], () => {})

    expect(matcher.getState().isMatching).toBe(false)
    matcher.feed(createEvent('g'))
    expect(matcher.getState().isMatching).toBe(true)
    expect(matcher.getState().completedSteps).toBe(1)
  })

  it('resets via reset()', () => {
    const matcher = createSequenceMatcher(['g', 'd'], () => {})

    matcher.feed(createEvent('g'))
    matcher.reset()
    expect(matcher.getState().isMatching).toBe(false)
  })
})
