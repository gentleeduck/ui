import { describe, expect, it } from 'vitest'
import type { AccessControl } from '../../types'
import { POLICY_JSON_SCHEMA } from '../'

describe('POLICY_JSON_SCHEMA', () => {
  // Smoke checks only - full external validators (ajv, etc.) live in consumer
  // code. We verify the shape so consumers don't import a malformed schema.
  it('declares Draft 2020-12 + required top-level AccessControl.IPolicy fields', () => {
    expect(POLICY_JSON_SCHEMA.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    expect(POLICY_JSON_SCHEMA.required).toEqual(['id', 'name', 'algorithm', 'rules'])
  })

  it('lists all four combining algorithms', () => {
    expect(POLICY_JSON_SCHEMA.properties.algorithm.enum).toEqual([
      'deny-overrides',
      'allow-overrides',
      'first-match',
      'highest-priority',
    ])
  })

  it('declares every operator the resolver supports', () => {
    const ops = POLICY_JSON_SCHEMA.$defs.condition.properties.operator.enum
    expect(ops).toContain('eq')
    expect(ops).toContain('subset_of')
    expect(ops).toContain('matches')
    // Closed set; new operators here must be mirrored in core/conditions.
    expect(ops.length).toBe(17)
  })
})
