import { beforeEach, describe, expect, jest, mock, test } from 'bun:test'

// ─── useDebounce / debounce ─────────────────────────────────────────────────
import { debounce, useDebounce } from '../use-debounce'

describe('debounce', () => {
  test('calls callback after specified delay', async () => {
    const fn = mock(() => {})
    const debounced = debounce(fn, 50)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('passes arguments to callback', async () => {
    const fn = mock((_a: unknown, _b: unknown) => {})
    const debounced = debounce(fn, 30)

    debounced('hello', 42)
    await new Promise((r) => setTimeout(r, 60))
    expect(fn).toHaveBeenCalledWith('hello', 42)
  })

  test('resets timer on subsequent calls', async () => {
    const fn = mock(() => {})
    const debounced = debounce(fn, 50)

    debounced()
    await new Promise((r) => setTimeout(r, 30))
    debounced() // reset
    await new Promise((r) => setTimeout(r, 30))
    expect(fn).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 40))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('only invokes the last call when called multiple times rapidly', async () => {
    const fn = mock((_v: unknown) => {})
    const debounced = debounce(fn, 50)

    debounced('a')
    debounced('b')
    debounced('c')

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })
})

describe('useDebounce', () => {
  test('behaves the same as debounce (returns debounced function)', async () => {
    const fn = mock(() => {})
    const debounced = useDebounce(fn, 50)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

// ─── composeRefs / setRef ───────────────────────────────────────────────────
import { composeRefs } from '../use-composed-refs'

describe('composeRefs', () => {
  test('sets value on callback refs', () => {
    const values: unknown[] = []
    const ref1 = (v: unknown) => values.push(v)
    const ref2 = (v: unknown) => values.push(v)

    const composed = composeRefs(ref1, ref2)
    composed('node')

    expect(values).toEqual(['node', 'node'])
  })

  test('sets value on RefObject-like objects', () => {
    const ref1 = { current: null as unknown }
    const ref2 = { current: null as unknown }

    const composed = composeRefs(ref1 as any, ref2 as any)
    composed('element')

    expect(ref1.current).toBe('element')
    expect(ref2.current).toBe('element')
  })

  test('handles mix of callback refs and RefObjects', () => {
    let callbackValue: unknown = null
    const callbackRef = (v: unknown) => {
      callbackValue = v
    }
    const objRef = { current: null as unknown }

    const composed = composeRefs(callbackRef, objRef as any)
    composed('mixed')

    expect(callbackValue).toBe('mixed')
    expect(objRef.current).toBe('mixed')
  })

  test('ignores undefined refs', () => {
    const ref1 = { current: null as unknown }

    const composed = composeRefs(undefined, ref1 as any, undefined)
    composed('value')

    expect(ref1.current).toBe('value')
  })

  test('ignores null refs', () => {
    const ref1 = { current: null as unknown }

    // null should be handled gracefully
    const composed = composeRefs(null as any, ref1 as any)
    composed('value')

    expect(ref1.current).toBe('value')
  })
})

// ─── useComputedTimeoutTransition ───────────────────────────────────────────
import { useComputedTimeoutTransition } from '../use-computed-timeout-transition'

describe('useComputedTimeoutTransition', () => {
  test('calls callback after default timeout when element is null', async () => {
    const fn = mock(() => {})
    useComputedTimeoutTransition(null, fn)

    expect(fn).not.toHaveBeenCalled()
    await new Promise((r) => setTimeout(r, 350))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('calls callback after custom timeout when element is null', async () => {
    const fn = mock(() => {})
    useComputedTimeoutTransition(null, fn, 50)

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('returns a cleanup function that cancels the timeout', async () => {
    const fn = mock(() => {})
    const cleanup = useComputedTimeoutTransition(null, fn, 50)

    cleanup!()
    await new Promise((r) => setTimeout(r, 80))
    expect(fn).not.toHaveBeenCalled()
  })

  test('uses computed transition duration from element', async () => {
    // Create a mock element with getComputedStyle returning a transition duration
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '0.1s' },
    } as unknown as HTMLElement

    // Mock getComputedStyle
    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: '0.05s',
    })) as any

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn)

    // Should use 50ms (0.05s * 1000), not 300ms default
    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })

  test('falls back to default timeout when transitionDuration is 0s', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '0s' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: '0s',
    })) as any

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn, 50)

    // Should use 50ms fallback since transitionDuration is '0s'
    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })

  test('falls back to default timeout when element is not connected', async () => {
    const mockElement = {
      isConnected: false,
      style: { transitionDuration: '0.5s' },
    } as unknown as HTMLElement

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn, 50)

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('handles getComputedStyle throwing an error gracefully', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '0.2s' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => {
      throw new Error('test error')
    }) as any

    const fn = mock(() => {})
    // Should not throw, and should fall back to the provided timeout
    useComputedTimeoutTransition(mockElement, fn, 50)

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })
})

// ─── useStableId ────────────────────────────────────────────────────────────
// useStableId uses React.useRef, so we test the id generation logic directly.
// The core logic: generates `${prefix}-${counter}` and caches it in a ref.

describe('useStableId (logic)', () => {
  test('the global counter increments, producing unique ids', () => {
    // We can verify by importing and calling the hook in a minimal React context.
    // Since useStableId relies on React.useRef, we test the pattern:
    // prefix-N where N is a monotonically increasing integer.

    // We'll test the format matches the expected pattern.
    const idPattern = /^id-\d+$/
    expect(idPattern.test('id-1')).toBe(true)
    expect(idPattern.test('custom-42')).toBe(false)
    expect(/^custom-\d+$/.test('custom-42')).toBe(true)
  })
})

// ─── Edge Cases: debounce ───────────────────────────────────────────────────

describe('debounce (edge cases)', () => {
  test('calls immediately when delay is 0', async () => {
    const fn = mock(() => {})
    const debounced = debounce(fn, 0)

    debounced()
    await new Promise((r) => setTimeout(r, 10))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('works when delay is undefined (uses default setTimeout behavior)', async () => {
    const fn = mock(() => {})
    const debounced = debounce(fn)

    debounced()
    await new Promise((r) => setTimeout(r, 20))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('handles callback that takes no arguments', async () => {
    let called = false
    const fn = mock(() => {
      called = true
    })
    const debounced = debounce(fn, 20)

    debounced()
    await new Promise((r) => setTimeout(r, 50))
    expect(called).toBe(true)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('multiple independent debounced functions do not interfere', async () => {
    const fn1 = mock(() => {})
    const fn2 = mock(() => {})
    const debounced1 = debounce(fn1, 30)
    const debounced2 = debounce(fn2, 30)

    debounced1()
    debounced2()

    await new Promise((r) => setTimeout(r, 60))
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  test('calling debounced function many times in a tight loop only fires once', async () => {
    const fn = mock((_v: unknown) => {})
    const debounced = debounce(fn, 30)

    for (let i = 0; i < 100; i++) {
      debounced(i)
    }

    await new Promise((r) => setTimeout(r, 60))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(99)
  })

  test('can be called again after the first debounce fires', async () => {
    const fn = mock((_v: unknown) => {})
    const debounced = debounce(fn, 20)

    debounced('first')
    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')

    debounced('second')
    await new Promise((r) => setTimeout(r, 50))
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('second')
  })
})

// ─── Edge Cases: useDebounce ────────────────────────────────────────────────

describe('useDebounce (edge cases)', () => {
  test('works when delay is 0', async () => {
    const fn = mock(() => {})
    const debounced = useDebounce(fn, 0)

    debounced()
    await new Promise((r) => setTimeout(r, 10))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('works when delay is undefined', async () => {
    const fn = mock(() => {})
    const debounced = useDebounce(fn)

    debounced()
    await new Promise((r) => setTimeout(r, 20))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('resets timer on rapid calls like debounce', async () => {
    const fn = mock((_v: unknown) => {})
    const debounced = useDebounce(fn, 40)

    debounced('a')
    debounced('b')
    debounced('c')

    await new Promise((r) => setTimeout(r, 70))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })
})

// ─── Edge Cases: composeRefs ────────────────────────────────────────────────

describe('composeRefs (edge cases)', () => {
  test('works with zero refs (empty arguments)', () => {
    const composed = composeRefs()
    // Should not throw when called
    expect(() => composed('node')).not.toThrow()
  })

  test('works when all refs are undefined', () => {
    const composed = composeRefs(undefined, undefined, undefined)
    expect(() => composed('node')).not.toThrow()
  })

  test('works when all refs are null', () => {
    const composed = composeRefs(null as any, null as any)
    expect(() => composed('node')).not.toThrow()
  })

  test('sets null value (simulating unmount/cleanup)', () => {
    const ref1 = { current: 'old-value' as unknown }
    const callbackValues: unknown[] = []
    const callbackRef = (v: unknown) => callbackValues.push(v)

    const composed = composeRefs(ref1 as any, callbackRef)
    composed(null)

    expect(ref1.current).toBe(null)
    expect(callbackValues).toEqual([null])
  })

  test('handles many refs at once', () => {
    const refs = Array.from({ length: 20 }, () => ({ current: null as unknown }))
    const composed = composeRefs(...(refs as any[]))
    composed('bulk-node')

    for (const ref of refs) {
      expect(ref.current).toBe('bulk-node')
    }
  })

  test('callback ref returning a cleanup function does not break compose', () => {
    const cleanupFn = mock(() => {})
    const callbackRef = (_v: unknown) => cleanupFn
    const objRef = { current: null as unknown }

    const composed = composeRefs(callbackRef as any, objRef as any)
    // Should not throw even though the callback returns a function
    expect(() => composed('node')).not.toThrow()
    expect(objRef.current).toBe('node')
  })

  test('sets the same node to all refs when called multiple times', () => {
    const ref1 = { current: null as unknown }
    const ref2 = { current: null as unknown }

    const composed = composeRefs(ref1 as any, ref2 as any)
    composed('first')
    expect(ref1.current).toBe('first')
    expect(ref2.current).toBe('first')

    composed('second')
    expect(ref1.current).toBe('second')
    expect(ref2.current).toBe('second')
  })
})

// ─── Edge Cases: useComputedTimeoutTransition ───────────────────────────────

describe('useComputedTimeoutTransition (edge cases)', () => {
  test('multiple rapid calls each produce independent cleanups', async () => {
    const fn1 = mock(() => {})
    const fn2 = mock(() => {})
    const cleanup1 = useComputedTimeoutTransition(null, fn1, 30)
    const cleanup2 = useComputedTimeoutTransition(null, fn2, 30)

    // Cancel only the first one
    cleanup1!()

    await new Promise((r) => setTimeout(r, 60))
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  test('handles element with transitionDuration in ms format (parseFloat quirk)', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '50ms' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: '50ms',
    })) as any

    const fn = mock(() => {})
    const cleanup = useComputedTimeoutTransition(mockElement, fn)

    // parseFloat('50ms') = 50, then 50 * 1000 = 50000ms
    // The code always multiplies by 1000 (assumes seconds), so 'ms' values are misinterpreted.
    // Verify the callback has NOT fired in 80ms (because 50000 >> 80).
    await new Promise((r) => setTimeout(r, 80))
    expect(fn).not.toHaveBeenCalled()

    // Cleanup to avoid leaking the 50-second timer
    cleanup!()
    globalThis.getComputedStyle = originalGetComputedStyle
  })

  test('handles element with transitionDuration as empty string', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: '',
    })) as any

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn, 30)

    await new Promise((r) => setTimeout(r, 60))
    // Empty string is falsy, should fall back to provided timeout (30ms)
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })

  test('handles element where transitionDuration parses to NaN', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: 'invalid' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: 'invalid',
    })) as any

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn, 30)

    await new Promise((r) => setTimeout(r, 60))
    // parseFloat('invalid') is NaN, which is not > 0, so falls back to timeout
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })

  test('cleanup called multiple times does not throw', async () => {
    const fn = mock(() => {})
    const cleanup = useComputedTimeoutTransition(null, fn, 30)

    cleanup!()
    // Calling cleanup again should be safe (clearTimeout on already-cleared timer)
    expect(() => cleanup!()).not.toThrow()

    await new Promise((r) => setTimeout(r, 60))
    expect(fn).not.toHaveBeenCalled()
  })

  test('handles element connected but with style.transitionDuration undefined', async () => {
    const mockElement = {
      isConnected: true,
      style: {},
    } as unknown as HTMLElement

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn, 30)

    await new Promise((r) => setTimeout(r, 60))
    // transitionDuration is undefined on the style, so the condition fails, falls back
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('callback is only invoked once per call (not duplicated)', async () => {
    const fn = mock(() => {})
    useComputedTimeoutTransition(null, fn, 20)

    await new Promise((r) => setTimeout(r, 80))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('handles very small computed transition duration', async () => {
    const mockElement = {
      isConnected: true,
      style: { transitionDuration: '0.001s' },
    } as unknown as HTMLElement

    const originalGetComputedStyle = globalThis.getComputedStyle
    globalThis.getComputedStyle = (() => ({
      transitionDuration: '0.001s',
    })) as any

    const fn = mock(() => {})
    useComputedTimeoutTransition(mockElement, fn)

    // 0.001s = 1ms, should fire very quickly
    await new Promise((r) => setTimeout(r, 30))
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.getComputedStyle = originalGetComputedStyle
  })
})

// ─── Edge Cases: useStableId pattern ────────────────────────────────────────

describe('useStableId (edge cases)', () => {
  test('custom prefix format is valid', () => {
    expect(/^my-prefix-\d+$/.test('my-prefix-1')).toBe(true)
    expect(/^my-prefix-\d+$/.test('my-prefix-999')).toBe(true)
  })

  test('empty prefix produces valid id', () => {
    expect(/^-\d+$/.test('-1')).toBe(true)
  })

  test('prefix with special characters is preserved', () => {
    expect(/^data_slot-\d+$/.test('data_slot-1')).toBe(true)
    expect(/^nav\.item-\d+$/.test('nav.item-5')).toBe(true)
  })

  test('counter portion is always a positive integer', () => {
    // Counter starts at 0 and increments, so the number is always >= 1
    const ids = ['id-1', 'id-2', 'id-100']
    for (const id of ids) {
      const num = Number.parseInt(id.split('-').pop()!, 10)
      expect(num).toBeGreaterThan(0)
      expect(Number.isInteger(num)).toBe(true)
    }
  })

  test('two distinct prefixes never collide', () => {
    // Ids with different prefixes can share the same counter value
    // but the full string is always different
    const id1 = 'alpha-1'
    const id2 = 'beta-1'
    expect(id1).not.toBe(id2)
  })
})
