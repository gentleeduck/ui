import { describe, expect, test } from 'bun:test'
import { animateIfAllowed, prefersReducedMotion } from '../waapi'

describe('prefersReducedMotion', () => {
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
})
