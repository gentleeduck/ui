import { describe, expect, it } from 'vitest'
import { require_config_value } from '../require-config-value'

describe('require_config_value', () => {
  it('returns the provided value when it exists', () => {
    expect(require_config_value('duck', 'missing')).toBe('duck')
    expect(require_config_value(false, 'missing')).toBe(false)
    expect(require_config_value(0, 'missing')).toBe(0)
  })

  it('throws when the value is undefined', () => {
    expect(() => require_config_value(undefined, 'missing value')).toThrow('missing value')
  })

  it('throws when the value is null', () => {
    expect(() => require_config_value(null, 'missing value')).toThrow('missing value')
  })
})
