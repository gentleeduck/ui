import { describe, expect, test } from 'vitest'
import { computeFingerprint, fingerprintMatches } from '../core/utils/fingerprint'

function fileOf(name: string, content: string, type = 'text/plain', lastModified = 0): File {
  return new File([content], name, { type, lastModified })
}

describe('computeFingerprint', () => {
  test('captures name, size, type, lastModified', () => {
    const f = fileOf('a.txt', 'hello', 'text/plain', 1234)
    expect(computeFingerprint(f)).toEqual({
      name: 'a.txt',
      size: 5,
      type: 'text/plain',
      lastModified: 1234,
    })
  })
})

describe('fingerprintMatches', () => {
  test('same identity matches', () => {
    const f = fileOf('a.txt', 'hello', 'text/plain', 1234)
    expect(fingerprintMatches(computeFingerprint(f), computeFingerprint(f))).toBe(true)
  })

  test('different name does not match', () => {
    const a = computeFingerprint(fileOf('a.txt', 'hello'))
    const b = computeFingerprint(fileOf('b.txt', 'hello'))
    expect(fingerprintMatches(a, b)).toBe(false)
  })

  test('different size does not match', () => {
    const a = computeFingerprint(fileOf('a.txt', 'hello'))
    const b = computeFingerprint(fileOf('a.txt', 'hello!'))
    expect(fingerprintMatches(a, b)).toBe(false)
  })

  test('different lastModified does not match', () => {
    const a = computeFingerprint(fileOf('a.txt', 'hello', 'text/plain', 1))
    const b = computeFingerprint(fileOf('a.txt', 'hello', 'text/plain', 2))
    expect(fingerprintMatches(a, b)).toBe(false)
  })

  test('type difference is intentionally ignored', () => {
    const a = computeFingerprint(fileOf('a', 'hello', 'text/plain', 1))
    const b = computeFingerprint(fileOf('a', 'hello', 'application/octet-stream', 1))
    expect(fingerprintMatches(a, b)).toBe(true)
  })
})
