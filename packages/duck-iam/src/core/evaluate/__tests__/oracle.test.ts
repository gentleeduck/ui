import { describe, expect, it } from 'vitest'
import type { AccessControl, Request } from '../../types'
import { evaluate, evaluateFast } from '../evaluate'

/**
 * Property-based regression guard: generate deterministic-random policy sets
 * and assert `evaluate(...).allowed === evaluateFast(...)` for every
 * `(policies, request)` pair. Locks the contract that the trace path and the
 * zero-alloc fast path agree on every input, so any future optimization that
 * silently breaks one side trips a failing oracle iteration.
 *
 * Deterministic seed -> reproducible failures.
 */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ACTIONS = ['read', 'write', 'delete', 'posts:read', 'posts:write']
const RESOURCES = ['post', 'comment', 'user', 'org', 'org:project', 'dashboard.users']
const ROLES = ['viewer', 'editor', 'admin', 'guest']
const SCOPES = ['org-1', 'org-2']
const STATUSES = ['active', 'suspended', 'pending']
const ALGORITHMS: AccessControl.CombiningAlgorithm[] = [
  'deny-overrides',
  'allow-overrides',
  'first-match',
  'highest-priority',
]
const COMBINES: AccessControl.PolicyCombine[] = ['and', 'allow-overrides', 'first-applicable']
const DEFAULTS: AccessControl.Effect[] = ['allow', 'deny']

function pick<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)]!
}

function makeCondition(rng: () => number): AccessControl.ICondition {
  // Pick from a small set of resolvable field/value combinations so most
  // conditions evaluate against the generated request state.
  const choice = Math.floor(rng() * 4)
  switch (choice) {
    case 0:
      return { field: 'subject.attributes.status', operator: 'eq', value: pick(rng, STATUSES) }
    case 1:
      return { field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }
    case 2:
      return { field: 'subject.roles', operator: 'contains', value: pick(rng, ROLES) }
    default:
      return { field: 'action', operator: 'in', value: [pick(rng, ACTIONS), pick(rng, ACTIONS)] }
  }
}

function makeConditionGroup(rng: () => number): AccessControl.IConditionGroup {
  const numConds = Math.floor(rng() * 3) // 0..2
  if (numConds === 0) return { all: [] }
  const conds = Array.from({ length: numConds }, () => makeCondition(rng))
  const logic = rng()
  if (logic < 0.5) return { all: conds }
  if (logic < 0.8) return { any: conds }
  return { none: conds }
}

function makeRule(rng: () => number, idx: number): AccessControl.IRule {
  const numActions = 1 + Math.floor(rng() * 2)
  const numResources = 1 + Math.floor(rng() * 2)
  const actions = Array.from({ length: numActions }, () => pick(rng, ACTIONS))
  const resources = Array.from({ length: numResources }, () => pick(rng, RESOURCES))
  // 30% of rules carry conditions - exercises condition evaluation in both paths.
  const withConditions = rng() < 0.3
  return {
    id: `r${idx}`,
    effect: rng() < 0.5 ? 'allow' : 'deny',
    priority: Math.floor(rng() * 20),
    actions,
    resources,
    conditions: withConditions ? makeConditionGroup(rng) : { all: [] },
  }
}

function makePolicy(rng: () => number, idx: number): AccessControl.IPolicy {
  const numRules = 1 + Math.floor(rng() * 4)
  // 30% policies carry targets - exercises NotApplicable fallthrough.
  const withTargets = rng() < 0.3
  // Random target dimensions for broader coverage.
  const targets = withTargets
    ? {
        ...(rng() < 0.5 ? { actions: [pick(rng, ACTIONS) as never] } : {}),
        ...(rng() < 0.5 ? { resources: [pick(rng, RESOURCES) as never] } : {}),
        ...(rng() < 0.3 ? { roles: [pick(rng, ROLES) as never] } : {}),
      }
    : undefined
  return {
    id: `p${idx}`,
    name: `P${idx}`,
    algorithm: pick(rng, ALGORITHMS),
    rules: Array.from({ length: numRules }, (_, i) => makeRule(rng, i)),
    ...(targets && Object.keys(targets).length ? { targets } : {}),
  }
}

function makeRequest(rng: () => number): Request.IAccessRequest {
  // Subject carries role + attributes so conditions resolve against real state.
  const numRoles = 1 + Math.floor(rng() * 2)
  const roles = Array.from({ length: numRoles }, () => pick(rng, ROLES))
  return {
    subject: {
      id: `u${Math.floor(rng() * 10)}`,
      roles,
      attributes: { status: pick(rng, STATUSES), level: Math.floor(rng() * 5) },
    },
    action: pick(rng, ACTIONS),
    resource: {
      type: pick(rng, RESOURCES),
      attributes: { ownerId: rng() < 0.5 ? 'u0' : 'other' },
    },
    scope: rng() < 0.3 ? pick(rng, SCOPES) : undefined,
  }
}

describe('property oracle: evaluate == evaluateFast', () => {
  // 1000 fuzz iterations per (combine, default) pair. Each pair covers small,
  // medium, and large policy sets; total suite cost stays under ~200ms.
  const ITERATIONS = 1000

  for (const combine of COMBINES) {
    for (const defaultEffect of DEFAULTS) {
      it(`combine="${combine}" default="${defaultEffect}"`, () => {
        // first-applicable on evaluateFast is rejected at Engine ctor (needs
        // tri-state), so skip that combination here.
        if (combine === 'first-applicable') return
        const rng = mulberry32(0xdec1ded ^ defaultEffect.length ^ combine.length)
        for (let i = 0; i < ITERATIONS; i++) {
          // Mix small (1-3) and larger (8-12) policy sets across iterations.
          const numPolicies = i % 5 === 0 ? 8 + Math.floor(rng() * 5) : 1 + Math.floor(rng() * 3)
          const policies = Array.from({ length: numPolicies }, (_, idx) => makePolicy(rng, idx))
          const request = makeRequest(rng)
          const fullDecision = evaluate(policies, request, defaultEffect, combine)
          const fastBool = evaluateFast(policies, request, defaultEffect, combine)
          if (fullDecision.allowed !== fastBool) {
            throw new Error(
              `Divergence at iter ${i}: evaluate=${fullDecision.allowed}, evaluateFast=${fastBool}\n` +
                `combine=${combine} default=${defaultEffect}\n` +
                `policies=${JSON.stringify(policies, null, 2)}\n` +
                `request=${JSON.stringify(request)}`,
            )
          }
        }
        expect(true).toBe(true)
      })
    }
  }
})
