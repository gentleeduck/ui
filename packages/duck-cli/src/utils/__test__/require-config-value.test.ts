import { describe, expect, it } from 'vitest'
import { requireConfigValue } from '../require-config-value'

describe('requireConfigValue', () => {
  it('returns the provided value when it exists', () => {
    expect(requireConfigValue('duck', 'missing')).toBe('duck')
    expect(requireConfigValue(false, 'missing')).toBe(false)
    expect(requireConfigValue(0, 'missing')).toBe(0)
  })

  it('throws when the value is undefined', () => {
    expect(() => requireConfigValue(undefined, 'missing value')).toThrow('missing value')
  })

  it('throws when the value is null', () => {
    expect(() => requireConfigValue(null, 'missing value')).toThrow('missing value')
  })
})
