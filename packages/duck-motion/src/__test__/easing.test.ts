import { describe, expect, test } from 'bun:test'
import { ease, spring } from '../easing'
import { duckEasing } from '../tokens'

describe('easing aliases', () => {
  test('ease is an alias for duckEasing.standard', () => {
    expect(ease).toBe(duckEasing.standard)
  })

  test('spring is an alias for duckEasing.spring', () => {
    expect(spring).toBe(duckEasing.spring)
  })

  test('ease holds the exact standard cubic-bezier string', () => {
    expect(ease).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })

  test('spring holds the exact spring cubic-bezier string', () => {
    expect(spring).toBe('cubic-bezier(1, 0.23995, 0, 1.65)')
  })

  test('ease is a string', () => {
    expect(typeof ease).toBe('string')
  })

  test('spring is a string', () => {
    expect(typeof spring).toBe('string')
  })

  test('ease and spring are different values', () => {
    expect(ease).not.toBe(spring)
  })
})
