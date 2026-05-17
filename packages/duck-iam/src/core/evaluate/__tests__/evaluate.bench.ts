import { bench, describe } from 'vitest'
import type { AccessControl, Request } from '../../types'
import { evaluate, evaluateFast, evaluatePolicyFast } from '../evaluate'
import { indexPolicy } from '../evaluate.libs'

function buildPolicy(numRules: number, withConditions: boolean): AccessControl.IPolicy {
  const rules: AccessControl.IRule[] = []
  const actions = ['read', 'create', 'update', 'delete', 'manage']
  const resources = ['post', 'comment', 'user', 'org', 'org:project']
  for (let i = 0; i < numRules; i++) {
    rules.push({
      id: `r${i}`,
      effect: i % 7 === 0 ? 'deny' : 'allow',
      priority: i % 20,
      actions: [actions[i % actions.length]!],
      resources: [resources[i % resources.length]!],
      conditions: withConditions
        ? { all: [{ field: 'subject.attributes.status', operator: 'eq', value: 'active' }] }
        : { all: [] },
    })
  }
  return { id: 'p', name: 'P', algorithm: 'deny-overrides', rules }
}

const req: Request.IAccessRequest = {
  subject: { id: 'u1', roles: ['editor'], attributes: { status: 'active' } },
  action: 'read',
  resource: { type: 'post', attributes: {} },
}

describe('evaluatePolicyFast', () => {
  const tiny = buildPolicy(5, false)
  const medium = buildPolicy(50, false)
  const large = buildPolicy(500, false)
  const conditional = buildPolicy(50, true)

  bench('5 rules, unconditional', () => {
    evaluatePolicyFast(tiny, req)
  })

  bench('50 rules, unconditional', () => {
    evaluatePolicyFast(medium, req)
  })

  bench('500 rules, unconditional', () => {
    evaluatePolicyFast(large, req)
  })

  bench('50 rules with conditions', () => {
    evaluatePolicyFast(conditional, req)
  })
})

describe('indexPolicy (cache hit)', () => {
  const policy = buildPolicy(100, false)
  // Warm the cache once.
  indexPolicy(policy)

  bench('cache hit', () => {
    indexPolicy(policy)
  })
})

describe('indexPolicy (cold build)', () => {
  bench('100 rules cold build', () => {
    // Use a fresh policy object each invocation to defeat the WeakMap cache.
    indexPolicy(buildPolicy(100, false))
  })
})

describe('evaluate vs evaluateFast', () => {
  const policies = [buildPolicy(50, false)]

  bench('evaluate (trace path)', () => {
    evaluate(policies, req)
  })

  bench('evaluateFast (production path)', () => {
    evaluateFast(policies, req)
  })
})

describe('cross-policy combine', () => {
  const policies = Array.from({ length: 10 }, () => buildPolicy(20, false))

  bench('combine=and x 10 policies', () => {
    evaluateFast(policies, req, 'deny', 'and')
  })

  bench('combine=allow-overrides x 10 policies', () => {
    evaluateFast(policies, req, 'deny', 'allow-overrides')
  })
})
