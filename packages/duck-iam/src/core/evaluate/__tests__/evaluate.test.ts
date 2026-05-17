import { describe, expect, it } from 'vitest'
import type { AccessControl, Request } from '../../types'
import { evaluate, evaluateFast, evaluatePolicy, evaluatePolicyFast } from '../evaluate'

function makeReq(overrides: Partial<Request.IAccessRequest> = {}): Request.IAccessRequest {
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

const allowReadPolicy: AccessControl.IPolicy = {
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

const denyDeletePolicy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
      ...allowReadPolicy,
      targets: { actions: ['write'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    // policy doesn't apply, falls to default (deny)
    expect(decision.allowed).toBe(false)
  })

  it('respects policy targets: skips policy if resource does not match targets', () => {
    const policy: AccessControl.IPolicy = {
      ...allowReadPolicy,
      targets: { resources: ['comment'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
  })

  it('respects policy targets: skips policy if role does not match targets', () => {
    const policy: AccessControl.IPolicy = {
      ...allowReadPolicy,
      targets: { roles: ['admin'] },
    }
    const decision = evaluatePolicy(policy, makeReq())
    expect(decision.allowed).toBe(false)
  })

  it('conditions must pass for rule to match', () => {
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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
    const policy: AccessControl.IPolicy = {
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

describe('first-match priority order', () => {
  // Both rules match; the high-priority rule (declared second) must win regardless of source order.
  const priorityPolicy: AccessControl.IPolicy = {
    id: 'first-priority',
    name: 'First Priority',
    algorithm: 'first-match',
    rules: [
      {
        id: 'r-low-allow',
        effect: 'allow',
        priority: 1,
        actions: ['read'],
        resources: ['post'],
        conditions: { all: [] },
      },
      {
        id: 'r-high-deny',
        effect: 'deny',
        priority: 100,
        actions: ['read'],
        resources: ['post'],
        conditions: { all: [] },
      },
    ],
  }

  it('trace path: highest priority wins, not source order', () => {
    const decision = evaluatePolicy(priorityPolicy, makeReq())
    expect(decision.allowed).toBe(false)
    expect(decision.rule?.id).toBe('r-high-deny')
    expect(decision.reason).toContain('r-high-deny')
  })

  it('fast path: highest priority wins, not source order', () => {
    expect(evaluatePolicyFast(priorityPolicy, makeReq())).toBe(false)
  })

  it('precomputed cache: highest priority wins on unconditional rules', () => {
    // Two unconditional rules -> precomputed cache fires (no wildcards, no conditions).
    // Both paths share indexPolicy()'s WeakMap, so the same lookup must respect priority.
    const policy: AccessControl.IPolicy = {
      id: 'precomp',
      name: 'Precomp',
      algorithm: 'first-match',
      rules: [
        {
          id: 'r-low-deny',
          effect: 'deny',
          priority: 1,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
        {
          id: 'r-high-allow',
          effect: 'allow',
          priority: 50,
          actions: ['read'],
          resources: ['post'],
          conditions: { all: [] },
        },
      ],
    }
    expect(evaluatePolicyFast(policy, makeReq())).toBe(true)
  })

  it('ties preserve source order (stable selection)', () => {
    // Equal priority -> earlier rule wins. Mirrors evaluate.test.ts:106 behavior.
    const policy: AccessControl.IPolicy = {
      id: 'first-tie',
      name: 'First Tie',
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
    expect(evaluatePolicy(policy, makeReq()).rule?.id).toBe('r-deny')
    expect(evaluatePolicyFast(policy, makeReq())).toBe(false)
  })
})

describe('fast path: expansive action/resource patterns route via wildcardAny', () => {
  // Colon-prefix actions like 'posts:*' must route through wildcardAny so the
  // fast path matches a request like { action: 'posts:read', resource: 'post' }.
  const colonActionPolicy: AccessControl.IPolicy = {
    id: 'colon-action',
    name: 'Colon Action',
    algorithm: 'deny-overrides',
    rules: [
      { id: 'r1', effect: 'allow', priority: 10, actions: ['posts:*'], resources: ['post'], conditions: { all: [] } },
    ],
  }

  it('fast path matches "posts:*" against "posts:read"', () => {
    expect(evaluatePolicyFast(colonActionPolicy, makeReq({ action: 'posts:read' }))).toBe(true)
  })

  it('trace path matches "posts:*" against "posts:read"', () => {
    expect(evaluatePolicy(colonActionPolicy, makeReq({ action: 'posts:read' })).allowed).toBe(true)
  })

  it('fast path matches "dashboard.*" resource against "dashboard.users"', () => {
    const policy: AccessControl.IPolicy = {
      id: 'dot-resource',
      name: 'Dot Request.IResource',
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
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'dashboard.users', attributes: {} } }))).toBe(true)
  })

  it('fast path matches "org:*" resource against "org:project"', () => {
    const policy: AccessControl.IPolicy = {
      id: 'colon-resource',
      name: 'Colon Request.IResource',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['org:*'], conditions: { all: [] } },
      ],
    }
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'org:project', attributes: {} } }))).toBe(true)
  })
})

describe('NotApplicable semantics', () => {
  // A policy whose targets don't match the request is NotApplicable
  // (`applicable: false`) and must be skipped by the combiner, not folded as
  // the default effect.
  const allowReadAnywhere: AccessControl.IPolicy = {
    id: 'allow-read-anywhere',
    name: 'Allow Read Anywhere',
    algorithm: 'deny-overrides',
    rules: [{ id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['*'], conditions: { all: [] } }],
  }
  const writesAuditPolicy: AccessControl.IPolicy = {
    id: 'audit-writes',
    name: 'Audit Writes',
    algorithm: 'deny-overrides',
    targets: { actions: ['create' as const, 'update' as const, 'delete' as const] },
    rules: [
      { id: 'r-audit', effect: 'allow', priority: 10, actions: ['*'], resources: ['*'], conditions: { all: [] } },
    ],
  }

  it('evaluate: AND combine skips NotApplicable policies', () => {
    // Read request: audit-writes targets only writes -> NotApplicable -> must NOT
    // contribute the default-deny that would have short-circuited the chain.
    expect(evaluate([allowReadAnywhere, writesAuditPolicy], makeReq()).allowed).toBe(true)
  })

  it('evaluate: all NotApplicable falls through to default', () => {
    // Both policies NotApplicable (target only writes); no policy contributes -> default.
    expect(evaluate([writesAuditPolicy], makeReq()).effect).toBe('deny')
    expect(evaluate([writesAuditPolicy], makeReq(), 'allow').effect).toBe('allow')
  })

  it('evaluateFast: AND combine skips NotApplicable policies', () => {
    expect(evaluateFast([allowReadAnywhere, writesAuditPolicy], makeReq())).toBe(true)
  })

  it('evaluatePolicy marks NotApplicable decisions', () => {
    const decision = evaluatePolicy(writesAuditPolicy, makeReq())
    expect(decision.applicable).toBe(false)
  })

  it('evaluatePolicyFast returns null for NotApplicable', () => {
    expect(evaluatePolicyFast(writesAuditPolicy, makeReq())).toBe(null)
  })
})

describe('cross-policy combine', () => {
  const allowPolicy: AccessControl.IPolicy = {
    id: 'allow',
    name: 'Allow',
    algorithm: 'deny-overrides',
    rules: [
      { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
    ],
  }
  const denyPolicy: AccessControl.IPolicy = {
    id: 'deny',
    name: 'Deny',
    algorithm: 'deny-overrides',
    rules: [
      { id: 'r1', effect: 'deny', priority: 10, actions: ['read'], resources: ['post'], conditions: { all: [] } },
    ],
  }

  it('"and" (default): any deny denies overall', () => {
    expect(evaluate([allowPolicy, denyPolicy], makeReq(), 'deny', 'and').allowed).toBe(false)
    expect(evaluateFast([allowPolicy, denyPolicy], makeReq(), 'deny', 'and')).toBe(false)
  })

  it('"and": all allow -> allow', () => {
    expect(evaluate([allowPolicy, allowPolicy], makeReq(), 'deny', 'and').allowed).toBe(true)
    expect(evaluateFast([allowPolicy, allowPolicy], makeReq(), 'deny', 'and')).toBe(true)
  })

  it('"allow-overrides": any allow allows overall', () => {
    expect(evaluate([denyPolicy, allowPolicy], makeReq(), 'deny', 'allow-overrides').allowed).toBe(true)
    expect(evaluateFast([denyPolicy, allowPolicy], makeReq(), 'deny', 'allow-overrides')).toBe(true)
  })

  it('"allow-overrides": all deny -> deny', () => {
    expect(evaluate([denyPolicy, denyPolicy], makeReq(), 'deny', 'allow-overrides').allowed).toBe(false)
    expect(evaluateFast([denyPolicy, denyPolicy], makeReq(), 'deny', 'allow-overrides')).toBe(false)
  })

  it('"first-applicable": first decided policy wins', () => {
    // Both policies match - the first one (allow) wins under first-applicable.
    expect(evaluate([allowPolicy, denyPolicy], makeReq(), 'deny', 'first-applicable').allowed).toBe(true)
    // Reverse order: deny wins.
    expect(evaluate([denyPolicy, allowPolicy], makeReq(), 'deny', 'first-applicable').allowed).toBe(false)
  })

  it('"first-applicable" falls through to default when no rule fires', () => {
    const noMatchPolicy: AccessControl.IPolicy = {
      id: 'nomatch',
      name: 'NoMatch',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r1', effect: 'allow', priority: 10, actions: ['write'], resources: ['post'], conditions: { all: [] } },
      ],
    }
    expect(evaluate([noMatchPolicy], makeReq(), 'deny', 'first-applicable').allowed).toBe(false)
    expect(evaluate([noMatchPolicy], makeReq(), 'allow', 'first-applicable').allowed).toBe(true)
  })
})

describe('fast path: literal-parent resource patterns', () => {
  // A literal pattern with no `*` can still parent-match a deeper request type:
  // `'org'` matches `'org:project'` (colon) and `'dashboard'` matches `'dashboard.users'` (dot).
  // The fast path indexes by literal key, so parent-prefix lookups must probe each parent.

  it('colon parent: literal "org" matches request "org:project"', () => {
    const policy: AccessControl.IPolicy = {
      id: 'parent-colon',
      name: 'Parent Colon',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['org'], conditions: { all: [] } },
      ],
    }
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'org:project', attributes: {} } }))).toBe(true)
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'org:project:doc', attributes: {} } }))).toBe(true)
    // The exact literal still matches:
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'org', attributes: {} } }))).toBe(true)
    // Unrelated resource type does not:
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'other', attributes: {} } }))).toBe(false)
  })

  it('dot parent: literal "dashboard" matches request "dashboard.users"', () => {
    const policy: AccessControl.IPolicy = {
      id: 'parent-dot',
      name: 'Parent Dot',
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
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'dashboard.users', attributes: {} } }))).toBe(true)
    expect(
      evaluatePolicyFast(policy, makeReq({ resource: { type: 'dashboard.users.settings', attributes: {} } })),
    ).toBe(true)
  })

  it('precomputed cache walks parent prefixes', () => {
    // No conditions + no wildcards -> precomputed path. Request resource is deeper than rule's literal.
    const policy: AccessControl.IPolicy = {
      id: 'precomp-parent',
      name: 'Precomp Parent',
      algorithm: 'deny-overrides',
      rules: [
        { id: 'r1', effect: 'allow', priority: 10, actions: ['read'], resources: ['org'], conditions: { all: [] } },
      ],
    }
    expect(evaluatePolicyFast(policy, makeReq({ resource: { type: 'org:project', attributes: {} } }))).toBe(true)
  })
})
