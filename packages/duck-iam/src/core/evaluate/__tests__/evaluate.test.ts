import { describe, expect, it } from 'vitest'
import type { AccessRequest, Policy } from '../../types'
import { evaluate, evaluatePolicy } from '../evaluate'

function makeReq(overrides: Partial<AccessRequest> = {}): AccessRequest {
  return {
    subject: {
      id: 'user-1',
      roles: ['editor'],
      attributes: {},
    },
    action: 'read',
    resource: { type: 'post', id: 'post-1', attributes: {} },
    ...overrides,
  }
}

const allowReadPolicy: Policy = {
  id: 'allow-read',
  name: 'Allow Read',
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

const denyDeletePolicy: Policy = {
  id: 'deny-delete',
  name: 'Deny Delete',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'r-deny',
      effect: 'deny',
      priority: 10,
      actions: ['delete'],
      resources: ['post'],
      conditions: { all: [] },
    },
  ],
}

describe('evaluatePolicy()', () => {
  it('allows when a matching allow rule exists', () => {
    const decision = evaluatePolicy(allowReadPolicy, makeReq())
    expect(decision.allowed).toBe(true)
    expect(decision.effect).toBe('allow')
  })

  it('falls to default when no rules match', () => {
    const decision = evaluatePolicy(allowReadPolicy, makeReq({ action: 'delete' }))
    expect(decision.allowed).toBe(false)
    expect(decision.effect).toBe('deny')
  })

  it('deny-overrides: deny wins over allow', () => {
    const policy: Policy = {
      id: 'mixed',
      name: 'Mixed',
      algorithm: 'deny-overrides',
      rules: [
        {
          id: 'r-allow',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
        { id: 'r-deny', effect: 'deny', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
      ],
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('r-deny')
  })

  it('allow-overrides: allow wins over deny', () => {
    const policy: Policy = {
      id: 'mixed',
      name: 'Mixed',
      algorithm: 'allow-overrides',
      rules: [
        { id: 'r-deny', effect: 'deny', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
        {
          id: 'r-allow',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
      ],
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(true)
  })

  it('first-match: uses first matching rule', () => {
    const policy: Policy = {
      id: 'first',
      name: 'First',
      algorithm: 'first-match',
      rules: [
        { id: 'r-deny', effect: 'deny', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
        {
          id: 'r-allow',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
      ],
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('r-deny')
  })

  it('highest-priority: uses highest priority rule', () => {
    const policy: Policy = {
      id: 'priority',
      name: 'Priority',
      algorithm: 'highest-priority',
      rules: [
        { id: 'r-deny', effect: 'deny', priority: 5, actions: ['read'], resources: ['post'], conditions: { all: [] } },
        {
          id: 'r-allow',
          effect: 'allow',
          priority: 100,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
      ],
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(true)
    expect(decision.reason).toContain('r-allow')
  })

  it('respects policy targets: skips policy if action does not match targets', () => {
    const policy: Policy = {
      ...allowReadPolicy,
      targets: { actions: ['write'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    // Policy doesn't apply, falls to default (deny)
    expect(decision.allowed).toBe(false)
  })

  it('respects policy targets: skips policy if resource does not match targets', () => {
    const policy: Policy = {
      ...allowReadPolicy,
      targets: { resources: ['comment'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
  })

  it('respects policy targets: skips policy if role does not match targets', () => {
    const policy: Policy = {
      ...allowReadPolicy,
      targets: { roles: ['admin'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
  })

  it('conditions must pass for rule to match', () => {
    const policy: Policy = {
      id: 'cond',
      name: 'Conditional',
      algorithm: 'deny-overrides',
      rules: [
        {
          id: 'r-conditional',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [{ field: 'subject.id', operator: 'eq', value: 'user-999' }] },
        },
      ],
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false) // condition fails
  })

  it('wildcard actions match all', () => {
    const policy: Policy = {
      id: 'wildcard',
      name: 'Wildcard',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r-wild', effect: 'allow', priority: 10, actions: ['*'], resources: ['post'], conditions: { all: [] } },
      ],
    }
    expect(evaluatePolicy(policy, makeReq({ action: 'anything' })).allowed).toBe(true)
  })

  it('wildcard resources match all', () => {
    const policy: Policy = {
      id: 'wildcard',
      name: 'Wildcard',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r-wild', effect: 'allow', priority: 10, actions: ['read'], resources: ['*'], conditions: { all: [] } },
      ],
    }
    expect(evaluatePolicy(policy, makeReq({ resource: { type: 'anything', attributes: {} } })).allowed).toBe(true)
  })
})

describe('evaluate() - multi-policy', () => {
  it('no policies defaults to deny', () => {
    const decision = evaluate([], makeReq())
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('No policies configured')
  })

  it('no policies defaults to allow when defaultEffect=allow', () => {
    const decision = evaluate([], makeReq(), 'allow')
    expect(decision.allowed).toBe(true)
  })

  it('single policy evaluation', () => {
    const decision = evaluate([allowReadPolicy], makeReq())
    expect(decision.allowed).toBe(true)
  })

  it('deny from any policy = overall deny (defense in depth)', () => {
    const decision = evaluate([allowReadPolicy, denyDeletePolicy], makeReq({ action: 'delete' }))
    expect(decision.allowed).toBe(false)
  })

  it('includes timing information', () => {
    const decision = evaluate([allowReadPolicy], makeReq())
    expect(decision.duration).toBeGreaterThanOrEqual(0)
    expect(decision.timestamp).toBeGreaterThan(0)
  })
})

describe('hierarchical resources in evaluation', () => {
  it('dot-based hierarchy: dashboard rule matches dashboard.users', () => {
    const policy: Policy = {
      id: 'hierarchy',
      name: 'Hierarchy',
      algorithm: 'deny-overrides',
      rules: [
        {
          id: 'r1',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['dashboard'],
          conditions: { all: [] },
        },
      ],
    }
    const req = makeReq({ resource: { type: 'dashboard.users', attributes: {} } })
    expect(evaluatePolicy(policy, req).allowed).toBe(true)
  })

  it('dot-based hierarchy: dashboard.* rule matches dashboard.users but not dashboard', () => {
    const policy: Policy = {
      id: 'hierarchy',
      name: 'Hierarchy',
      algorithm: 'deny-overrides',
      rules: [
        {
          id: 'r1',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['dashboard.*'],
          conditions: { all: [] },
        },
      ],
    }
    expect(evaluatePolicy(policy, makeReq({ resource: { type: 'dashboard.users', attributes: {} } })).allowed).toBe(
      true,
    )
    expect(evaluatePolicy(policy, makeReq({ resource: { type: 'dashboard', attributes: {} } })).allowed).toBe(false)
  })
})
