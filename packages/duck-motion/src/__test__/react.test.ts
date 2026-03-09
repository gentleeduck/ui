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
})

describe('getDuckReducedMotionServerSnapshot', () => {
  test('returns false (server default)', () => {
    expect(getDuckReducedMotionServerSnapshot()).toBe(false)
  })
})

describe('useDuckReducedMotion', () => {
  test('returns a boolean', () => {
    const result = useDuckReducedMotion()
    expect(typeof result).toBe('boolean')
  })
})

describe('onDuckReducedMotionChange', () => {
  test('returns an unsubscribe function', () => {
    const unsub = onDuckReducedMotionChange(() => {})
    expect(typeof unsub).toBe('function')
    // calling unsub should not throw
    unsub()
  })
})
