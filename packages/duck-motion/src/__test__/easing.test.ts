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
})
