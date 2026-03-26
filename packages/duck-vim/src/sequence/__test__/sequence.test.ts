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

describe('SequenceManager - edge cases', () => {
  let manager: SequenceManager

  afterEach(() => {
    manager?.destroy()
  })

  it('handleKeyEvent returns false when no sequences registered', () => {
    manager = new SequenceManager()
    expect(manager.handleKeyEvent(createEvent('k'))).toBe(false)
  })

  it('handleKeyEvent returns true when a sequence matches', () => {
    manager = new SequenceManager()
    manager.register({
      steps: [{ binding: 'k' }],
      handler: () => {},
    })
    expect(manager.handleKeyEvent(createEvent('k'))).toBe(true)
  })

  it('handleKeyEvent returns false on partial match', () => {
    manager = new SequenceManager()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: () => {},
    })
    expect(manager.handleKeyEvent(createEvent('g'))).toBe(false)
  })

  it('skips all modifier key presses (Shift, Control, Alt, Meta)', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'k' }],
      handler: fn,
    })

    expect(manager.handleKeyEvent(createEvent('Shift'))).toBe(false)
    expect(manager.handleKeyEvent(createEvent('Control'))).toBe(false)
    expect(manager.handleKeyEvent(createEvent('Alt'))).toBe(false)
    expect(manager.handleKeyEvent(createEvent('Meta'))).toBe(false)
    expect(fn).not.toHaveBeenCalled()
  })

  it('handles single-step sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'k' }],
      handler: fn,
    })
    manager.handleKeyEvent(createEvent('k'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('handles three-step sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }, { binding: 'w' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    manager.handleKeyEvent(createEvent('w'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('retries mismatch from step 0 and matches single-step sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'k' }],
      handler: fn,
    })

    // 'x' mismatches, but then step 0 is retried with 'x' (no match)
    manager.handleKeyEvent(createEvent('x'))
    expect(fn).not.toHaveBeenCalled()

    // 'k' directly matches step 0
    manager.handleKeyEvent(createEvent('k'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('retries mismatch and starts new multi-step sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    // Start a match
    manager.handleKeyEvent(createEvent('g'))
    // Mismatch at step 1, but retry with 'g' at step 0 starts new progress
    manager.handleKeyEvent(createEvent('g'))
    // Now complete with 'd'
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('sequence can fire multiple times', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('destroy clears all registrations', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
    })

    manager.destroy()
    manager.handleKeyEvent(createEvent('g'))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('getState reports no matching when no sequences registered', () => {
    manager = new SequenceManager()
    const state = manager.getState()
    expect(state.isMatching).toBe(false)
    expect(state.completedSteps).toBe(0)
    expect(state.totalSteps).toBe(0)
  })

  it('getState reports the most advanced entry', () => {
    manager = new SequenceManager()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }, { binding: 'w' }],
      handler: () => {},
    })
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'x' }],
      handler: () => {},
    })

    manager.handleKeyEvent(createEvent('g'))
    const state = manager.getState()
    expect(state.isMatching).toBe(true)
    // Both are at step 1, but the 3-step one has higher total
    expect(state.completedSteps).toBe(1)
  })

  it('handles modifier key steps in sequence', () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'ctrl+k' }, { binding: 'ctrl+s' }],
      handler: fn,
    })

    manager.handleKeyEvent(createEvent('k', { ctrlKey: true }))
    manager.handleKeyEvent(createEvent('s', { ctrlKey: true }))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('unregister handle clears timeout', async () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    const handle = manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
      options: { timeout: 50 },
    })

    manager.handleKeyEvent(createEvent('g'))
    handle.unregister()

    // Even after timeout, nothing should error
    await new Promise((r) => setTimeout(r, 100))
    expect(fn).not.toHaveBeenCalled()
  })

  it('unregister on non-existent id does not throw', () => {
    manager = new SequenceManager()
    const handle = manager.register({
      steps: [{ binding: 'g' }],
      handler: () => {},
    })
    handle.unregister()
    // Second unregister should be safe
    expect(() => handle.unregister()).not.toThrow()
  })

  it('reset clears in-progress timeout state', async () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
      options: { timeout: 200 },
    })

    manager.handleKeyEvent(createEvent('g'))
    expect(manager.getState().isMatching).toBe(true)

    manager.reset()
    expect(manager.getState().isMatching).toBe(false)

    // Completing the sequence after reset should not fire
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('uses default timeout of 600ms when not specified', async () => {
    manager = new SequenceManager()
    const fn = vi.fn()
    manager.register({
      steps: [{ binding: 'g' }, { binding: 'd' }],
      handler: fn,
      // no timeout option - defaults to 600
    })

    manager.handleKeyEvent(createEvent('g'))
    // Within default timeout, should still match
    await new Promise((r) => setTimeout(r, 50))
    manager.handleKeyEvent(createEvent('d'))
    expect(fn).toHaveBeenCalledOnce()
  })
})

describe('createSequenceMatcher - edge cases', () => {
  it('feed returns true when sequence completes', () => {
    const fn = vi.fn()
    const matcher = createSequenceMatcher(['k'], fn)
    expect(matcher.feed(createEvent('k'))).toBe(true)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('feed returns false on partial match', () => {
    const matcher = createSequenceMatcher(['g', 'd'], () => {})
    expect(matcher.feed(createEvent('g'))).toBe(false)
  })

  it('feed returns false on non-match', () => {
    const matcher = createSequenceMatcher(['g', 'd'], () => {})
    expect(matcher.feed(createEvent('x'))).toBe(false)
  })

  it('getState totalSteps reflects the sequence length', () => {
    const matcher = createSequenceMatcher(['g', 'd', 'w'], () => {})
    matcher.feed(createEvent('g'))
    expect(matcher.getState().totalSteps).toBe(3)
    expect(matcher.getState().completedSteps).toBe(1)
  })

  it('supports modifier steps', () => {
    const fn = vi.fn()
    const matcher = createSequenceMatcher(['ctrl+k', 'ctrl+s'], fn)
    matcher.feed(createEvent('k', { ctrlKey: true }))
    matcher.feed(createEvent('s', { ctrlKey: true }))
    expect(fn).toHaveBeenCalledOnce()
  })

  it('resets state after successful match', () => {
    const fn = vi.fn()
    const matcher = createSequenceMatcher(['g', 'd'], fn)
    matcher.feed(createEvent('g'))
    matcher.feed(createEvent('d'))
    expect(matcher.getState().isMatching).toBe(false)
    expect(matcher.getState().completedSteps).toBe(0)
  })

  it('skips pure modifier key presses', () => {
    const fn = vi.fn()
    const matcher = createSequenceMatcher(['k'], fn)
    expect(matcher.feed(createEvent('Shift'))).toBe(false)
    expect(fn).not.toHaveBeenCalled()
  })
})
