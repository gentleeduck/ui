import { describe, expect, test } from 'bun:test'
import { animateIfAllowed, prefersReducedMotion } from '../waapi'

describe('prefersReducedMotion', () => {
  test('returns a boolean', () => {
    expect(typeof prefersReducedMotion()).toBe('boolean')
  })

  test('returns false when window.matchMedia is not available', () => {
    // In Bun test env there is no real matchMedia, so the guard returns false
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('animateIfAllowed', () => {
  const keyframes = [{ opacity: 0 }, { opacity: 1 }]
  const options: KeyframeAnimationOptions = { duration: 200 }

  test('returns null when element is null', () => {
    expect(animateIfAllowed(null, keyframes, options)).toBeNull()
  })

  test('returns null when element is null even with reducedMotion false', () => {
    expect(animateIfAllowed(null, keyframes, options, false)).toBeNull()
  })

  test('returns null when reducedMotion is true', () => {
    const el = { animate: () => ({}) } as unknown as Element
    expect(animateIfAllowed(el, keyframes, options, true)).toBeNull()
  })

  test('calls element.animate when allowed', () => {
    let calledWith: unknown[] = []
    const mockAnimation = {} as Animation
    const el = {
      animate: (...args: unknown[]) => {
        calledWith = args
        return mockAnimation
      },
    } as unknown as Element

    const result = animateIfAllowed(el, keyframes, options, false)
    expect(result).toBe(mockAnimation)
    expect(calledWith[0]).toBe(keyframes)
    expect(calledWith[1]).toBe(options)
  })

  test('does not call element.animate when reducedMotion is true', () => {
    let called = false
    const el = {
      animate: () => {
        called = true
        return {} as Animation
      },
    } as unknown as Element

    animateIfAllowed(el, keyframes, options, true)
    expect(called).toBe(false)
  })

  test('passes PropertyIndexedKeyframes to element.animate', () => {
    let receivedKeyframes: unknown = null
    const propKeyframes: PropertyIndexedKeyframes = { opacity: [0, 1], transform: ['scale(0.9)', 'scale(1)'] }
    const el = {
      animate: (kf: unknown) => {
        receivedKeyframes = kf
        return {} as Animation
      },
    } as unknown as Element

    animateIfAllowed(el, propKeyframes, options, false)
    expect(receivedKeyframes).toBe(propKeyframes)
  })

  test('passes custom options through to element.animate', () => {
    let receivedOptions: unknown = null
    const customOptions: KeyframeAnimationOptions = { duration: 500, easing: 'ease-out', fill: 'forwards' }
    const el = {
      animate: (_kf: unknown, opts: unknown) => {
        receivedOptions = opts
        return {} as Animation
      },
    } as unknown as Element

    animateIfAllowed(el, keyframes, customOptions, false)
    expect(receivedOptions).toBe(customOptions)
  })

  test('defaults reducedMotion to prefersReducedMotion() when not provided', () => {
    // In Bun test env, prefersReducedMotion() returns false, so animate should be called
    let called = false
    const el = {
      animate: () => {
        called = true
        return {} as Animation
      },
    } as unknown as Element

    animateIfAllowed(el, keyframes, options)
    expect(called).toBe(true)
  })
})
