import { describe, expect, it } from 'vitest'
import type { Role } from '../../types'
import { validatePolicy, validateRoles } from '../validate'

describe('validateRoles()', () => {
  it('valid roles return valid=true', () => {
    const roles: Role[] = [
      { id: 'viewer', name: 'Viewer', permissions: [{ action: 'read', resource: 'post' }] },
      { id: 'editor', name: 'Editor', inherits: ['viewer'], permissions: [{ action: 'write', resource: 'post' }] },
    ]
    const result = validateRoles(roles)
    expect(result.valid).toBe(true)
    expect(result.issues.filter((i) => i.type === 'error')).toHaveLength(0)
  })

  it('detects duplicate role IDs', () => {
    const roles: Role[] = [
      { id: 'viewer', name: 'Viewer', permissions: [] },
      { id: 'viewer', name: 'Viewer 2', permissions: [] },
    ]
    const result = validateRoles(roles)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'DUPLICATE_ROLE_ID')).toBe(true)
  })

  it('detects dangling inherits references', () => {
    const roles: Role[] = [{ id: 'editor', name: 'Editor', inherits: ['nonexistent'], permissions: [] }]
    const result = validateRoles(roles)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'DANGLING_INHERIT')).toBe(true)
  })

  it('detects circular inheritance (warning)', () => {
    const roles: Role[] = [
      { id: 'a', name: 'A', inherits: ['b'], permissions: [{ action: 'read', resource: 'post' }] },
      { id: 'b', name: 'B', inherits: ['a'], permissions: [{ action: 'write', resource: 'post' }] },
    ]
    const result = validateRoles(roles)
    expect(result.valid).toBe(true) // warnings don't make it invalid
    expect(result.issues.some((i) => i.code === 'CIRCULAR_INHERIT')).toBe(true)
  })

  it('warns about empty roles (no permissions, no inheritance)', () => {
    const roles: Role[] = [{ id: 'empty', name: 'Empty', permissions: [] }]
    const result = validateRoles(roles)
    expect(result.issues.some((i) => i.code === 'EMPTY_ROLE')).toBe(true)
  })

  it('does not warn about roles with inheritance but no permissions', () => {
    const roles: Role[] = [
      { id: 'viewer', name: 'Viewer', permissions: [{ action: 'read', resource: 'post' }] },
      { id: 'inheritor', name: 'Inheritor', inherits: ['viewer'], permissions: [] },
    ]
    const result = validateRoles(roles)
    expect(result.issues.some((i) => i.code === 'EMPTY_ROLE')).toBe(false)
  })
})

describe('validatePolicy()', () => {
  const validPolicy = {
    id: 'p1',
    name: 'Test Policy',
    algorithm: 'deny-overrides',
    rules: [
      {
        id: 'r1',
        effect: 'allow',
        priority: 10,
        actions: ['read'],
        resources: ['post'],
        conditions: { all: [] },
      },
    ],
  }

  it('validates a correct policy', () => {
    const result = validatePolicy(validPolicy)
    expect(result.valid).toBe(true)
    expect(result.issues.filter((i) => i.type === 'error')).toHaveLength(0)
  })

  it('rejects non-object input', () => {
    expect(validatePolicy(null).valid).toBe(false)
    expect(validatePolicy('string').valid).toBe(false)
    expect(validatePolicy([]).valid).toBe(false)
    expect(validatePolicy(42).valid).toBe(false)
  })

  it('rejects missing id', () => {
    const result = validatePolicy({ ...validPolicy, id: '' })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'MISSING_FIELD' && i.path === 'id')).toBe(true)
  })

  it('rejects missing name', () => {
    const result = validatePolicy({ ...validPolicy, name: '' })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'MISSING_FIELD' && i.path === 'name')).toBe(true)
  })

  it('rejects invalid algorithm', () => {
    const result = validatePolicy({ ...validPolicy, algorithm: 'invalid' })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_ALGORITHM')).toBe(true)
  })

  it('accepts all valid algorithms', () => {
    for (const algo of ['deny-overrides', 'allow-overrides', 'first-match', 'highest-priority']) {
      const result = validatePolicy({ ...validPolicy, algorithm: algo })
      expect(result.valid).toBe(true)
    }
  })

  it('rejects missing rules', () => {
    const { rules, ...noRules } = validPolicy
    const result = validatePolicy(noRules)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'MISSING_FIELD' && i.path === 'rules')).toBe(true)
  })

  it('rejects invalid rule effect', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [{ ...validPolicy.rules[0], effect: 'maybe' }],
    })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_EFFECT')).toBe(true)
  })

  it('rejects invalid rule priority type', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [{ ...validPolicy.rules[0], priority: 'high' }],
    })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_TYPE' && i.path?.includes('priority'))).toBe(true)
  })

  it('rejects empty actions array', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [{ ...validPolicy.rules[0], actions: [] }],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects non-string actions', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [{ ...validPolicy.rules[0], actions: [123] }],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects empty resources array', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [{ ...validPolicy.rules[0], resources: [] }],
    })
    expect(result.valid).toBe(false)
  })

  it('validates condition operators', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [
        {
          ...validPolicy.rules[0],
          conditions: { all: [{ field: 'action', operator: 'invalid_op', value: 'x' }] },
        },
      ],
    })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_OPERATOR')).toBe(true)
  })

  it('validates condition group structure', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [
        {
          ...validPolicy.rules[0],
          conditions: { invalid: [] },
        },
      ],
    })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_CONDITION')).toBe(true)
  })

  it('warns about duplicate rule IDs', () => {
    const result = validatePolicy({
      ...validPolicy,
      rules: [validPolicy.rules[0], validPolicy.rules[0]],
    })
    expect(result.issues.some((i) => i.code === 'DUPLICATE_RULE_ID')).toBe(true)
  })

  it('validates targets if provided', () => {
    const result = validatePolicy({
      ...validPolicy,
      targets: 'invalid',
    })
    expect(result.valid).toBe(false)
  })

  it('validates targets.actions must be array', () => {
    const result = validatePolicy({
      ...validPolicy,
      targets: { actions: 'not-an-array' },
    })
    expect(result.valid).toBe(false)
  })

  it('rejects invalid version type', () => {
    const result = validatePolicy({ ...validPolicy, version: 'one' })
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'INVALID_TYPE' && i.path === 'version')).toBe(true)
  })

  it('accepts numeric version', () => {
    const result = validatePolicy({ ...validPolicy, version: 2 })
    expect(result.valid).toBe(true)
  })
})
