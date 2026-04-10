import { describe, expect, test } from 'bun:test'
import { loadDomAnimation, loadDomMax, loadMotionFeatures } from '../motion-features'

describe('loadDomAnimation', () => {
  test('is a function', () => {
    expect(typeof loadDomAnimation).toBe('function')
  })

  test('returns a promise', () => {
    const result = loadDomAnimation()
    expect(result).toBeInstanceOf(Promise)
  })
})

describe('loadDomMax', () => {
  test('is a function', () => {
    expect(typeof loadDomMax).toBe('function')
  })

  test('returns a promise', () => {
    const result = loadDomMax()
    expect(result).toBeInstanceOf(Promise)
  })
})

describe('loadMotionFeatures', () => {
  test('is a function', () => {
    expect(typeof loadMotionFeatures).toBe('function')
  })

  test('defaults to loadDomAnimation', () => {
    const result = loadMotionFeatures()
    expect(result).toBe(loadDomAnimation)
  })

  test('returns loadDomAnimation for "animation"', () => {
    expect(loadMotionFeatures('animation')).toBe(loadDomAnimation)
  })

  test('returns loadDomMax for "max"', () => {
    expect(loadMotionFeatures('max')).toBe(loadDomMax)
  })
})
