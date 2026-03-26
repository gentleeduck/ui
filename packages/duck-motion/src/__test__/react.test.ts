import { describe, expect, test } from 'bun:test'
import {
  getDuckReducedMotionServerSnapshot,
  motionTransition,
  onDuckReducedMotionChange,
  useDuckReducedMotion,
} from '../react'

describe('motionTransition', () => {
  test('returns { duration: 0 } when reduced is true', () => {
    const result = motionTransition(true, { duration: 300, easing: 'ease-in' })
    expect(result).toEqual({ duration: 0 })
  })

  test('returns normal config when reduced is false', () => {
    const normal = { duration: 300, easing: 'ease-in' }
    const result = motionTransition(false, normal)
    expect(result).toBe(normal)
  })

  test('reduced result does not contain the normal properties', () => {
    const result = motionTransition(true, { duration: 200, fill: 'forwards' } as Record<string, unknown>)
    expect(result).not.toHaveProperty('fill')
    expect(result).toEqual({ duration: 0 })
  })

  test('returns exact same object reference when not reduced', () => {
    const normal = { duration: 500 }
    expect(motionTransition(false, normal)).toBe(normal)
  })

  test('reduced result always has duration: 0 regardless of input duration', () => {
    const result1 = motionTransition(true, { duration: 1000 })
    const result2 = motionTransition(true, { duration: 0 })
    expect(result1).toEqual({ duration: 0 })
    expect(result2).toEqual({ duration: 0 })
  })

  test('reduced result has exactly one key', () => {
    const result = motionTransition(true, { duration: 300, easing: 'ease', fill: 'both' } as Record<string, unknown>)
    expect(Object.keys(result)).toEqual(['duration'])
  })

  test('works with an empty normal config', () => {
    const normal = {} as Record<string, unknown>
    const result = motionTransition(false, normal)
    expect(result).toBe(normal)
  })

  test('reduced path ignores all custom properties in normal', () => {
    const normal = { duration: 400, delay: 100, iterations: 3 } as Record<string, unknown>
    const result = motionTransition(true, normal)
    expect(result).not.toHaveProperty('delay')
    expect(result).not.toHaveProperty('iterations')
    expect(result).toEqual({ duration: 0 })
  })
})

describe('getDuckReducedMotionServerSnapshot', () => {
  test('returns false (server default)', () => {
    expect(getDuckReducedMotionServerSnapshot()).toBe(false)
  })

  test('return type is boolean', () => {
    expect(typeof getDuckReducedMotionServerSnapshot()).toBe('boolean')
  })

  test('is stable across multiple calls', () => {
    const a = getDuckReducedMotionServerSnapshot()
    const b = getDuckReducedMotionServerSnapshot()
    expect(a).toBe(b)
  })
})

describe('useDuckReducedMotion', () => {
  test('returns a boolean', () => {
    const result = useDuckReducedMotion()
    expect(typeof result).toBe('boolean')
  })

  test('returns false in test environment without matchMedia', () => {
    expect(useDuckReducedMotion()).toBe(false)
  })

  test('is stable across multiple calls', () => {
    const a = useDuckReducedMotion()
    const b = useDuckReducedMotion()
    expect(a).toBe(b)
  })
})

describe('onDuckReducedMotionChange', () => {
  test('returns an unsubscribe function', () => {
    const unsub = onDuckReducedMotionChange(() => {})
    expect(typeof unsub).toBe('function')
    // calling unsub should not throw
    unsub()
  })

  test('unsubscribe can be called multiple times without error', () => {
    const unsub = onDuckReducedMotionChange(() => {})
    unsub()
    expect(() => unsub()).not.toThrow()
  })

  test('accepts any callback function', () => {
    let callCount = 0
    const unsub = onDuckReducedMotionChange(() => {
      callCount++
    })
    expect(typeof unsub).toBe('function')
    unsub()
    // callback should not have been invoked by subscribe itself
    expect(callCount).toBe(0)
  })
})
