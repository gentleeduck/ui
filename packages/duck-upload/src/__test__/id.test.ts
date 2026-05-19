import { describe, expect, test } from 'vitest'
import { generateId } from '../core/utils/id'

describe('generateId', () => {
  test('starts with the `upload_` prefix', () => {
    expect(generateId()).toMatch(/^upload_/)
  })

  test('produces unique values across many calls', () => {
    const set = new Set<string>()
    for (let i = 0; i < 10_000; i++) set.add(generateId())
    expect(set.size).toBe(10_000)
  })
})
