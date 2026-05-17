import { describe, expect, it } from 'vitest'
import type { AccessControl, Request } from '../../types'
import type { Explain } from '..'
import { explainEvaluation } from '../explain'

function makeReq(overrides: Partial<Request.IAccessRequest> = {}): Request.IAccessRequest {
  return {
    subject: {
      id: 'user-1',
      roles: ['editor'],
      attributes: { department: 'engineering' },
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

const denyAllPolicy: AccessControl.IPolicy = {
  id: 'deny-all',
  name: 'Deny All',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'r-deny',
      effect: 'deny',
      priority: 100,
      actions: ['*'],
      resources: ['*'],
      conditions: { all: [] },
    },
  ],
}

const subjectInfo = {
  subjectId: 'user-1',
  originalRoles: ['editor'],
  scopedRolesApplied: [],
}

describe('explainEvaluation()', () => {
  it('returns an Explain.IResult with decision, request, subject, policies, summary', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.allowed).toBe(true)
    expect(result.request.action).toBe('read')
    expect(result.request.resourceType).toBe('post')
    expect(result.subject.id).toBe('user-1')
    expect(result.policies).toHaveLength(1)
    expect(result.policies[0]!.policyId).toBe('allow-read')
    expect(typeof result.summary).toBe('string')
    expect(result.summary.length).toBeGreaterThan(0)
  })

  it('correctly reports an allowed decision', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.allowed).toBe(true)
    expect(result.decision.effect).toBe('allow')
  })

  it('correctly reports a denied decision', () => {
    const result = explainEvaluation([denyAllPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.allowed).toBe(false)
    expect(result.decision.effect).toBe('deny')
  })

  it('traces all policies without short-circuiting', () => {
    const result = explainEvaluation([allowReadPolicy, denyAllPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.policies).toHaveLength(2)
    expect(result.policies[0]!.policyId).toBe('allow-read')
    expect(result.policies[1]!.policyId).toBe('deny-all')
  })

  it('traces rule matching details', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    const policyTrace = result.policies[0]!
    expect(policyTrace.rules).toHaveLength(1)
    const rule = policyTrace.rules[0]!
    expect(rule.ruleId).toBe('r1')
    expect(rule.effect).toBe('allow')
    expect(rule.actionMatch).toBe(true)
    expect(rule.resourceMatch).toBe(true)
    expect(rule.conditionsMet).toBe(true)
    expect(rule.matched).toBe(true)
  })

  it('reports non-matching rules correctly', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq({ action: 'delete' }), 'deny', subjectInfo)
    const rule = result.policies[0]!.rules[0]!
    expect(rule.actionMatch).toBe(false)
    expect(rule.matched).toBe(false)
  })

  it('includes request details', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq({ scope: 'org-1' }), 'deny', subjectInfo)
    expect(result.request.action).toBe('read')
    expect(result.request.resourceType).toBe('post')
    expect(result.request.scope).toBe('org-1')
  })

  it('includes subject details', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.subject.id).toBe('user-1')
    expect(result.subject.roles).toEqual(['editor'])
  })

  it('generates a human-readable summary', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.summary).toContain('ALLOWED')
    expect(result.summary).toContain('user-1')
    expect(result.summary).toContain('read')
    expect(result.summary).toContain('post')
  })

  it('summary reports DENIED for denied requests', () => {
    const result = explainEvaluation([denyAllPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.summary).toContain('DENIED')
  })

  it('handles no policies', () => {
    const result = explainEvaluation([], makeReq(), 'deny', subjectInfo)
    expect(result.decision.allowed).toBe(false)
    expect(result.policies).toHaveLength(0)
  })

  it('handles no policies with allow default', () => {
    const result = explainEvaluation([], makeReq(), 'allow', subjectInfo)
    expect(result.decision.allowed).toBe(true) // defaultEffect=allow is used when no policies exist
  })

  it('reports policy target mismatches', () => {
    const targetedPolicy: AccessControl.IPolicy = {
      ...allowReadPolicy,
      targets: { actions: ['write'] },
    }
    const result = explainEvaluation([targetedPolicy], makeReq(), 'deny', subjectInfo)
    const pt = result.policies[0]!
    expect(pt.targetMatch).toBe(false)
    expect(pt.rules).toHaveLength(0) // rules not evaluated when targets don't match
  })

  it('includes timing information', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.duration).toBeGreaterThanOrEqual(0)
    expect(result.decision.timestamp).toBeGreaterThan(0)
  })

  it('includes scoped roles in summary', () => {
    const scopedInfo = { ...subjectInfo, scopedRolesApplied: ['org-editor'] }
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', scopedInfo)
    expect(result.summary).toContain('scoped')
    expect(result.summary).toContain('org-editor')
  })

  it('traces conditions inside rules', () => {
    const conditionalPolicy: AccessControl.IPolicy = {
      id: 'conditional',
      name: 'Conditional',
      algorithm: 'deny-overrides',
      rules: [
        {
          id: 'r-cond',
          effect: 'allow',
          priority: 10,
          actions: ['read'],
          resources: ['post'],
          conditions: {
            all: [{ field: 'subject.attributes.department', operator: 'eq', value: 'engineering' }],
          },
        },
      ],
    }
    const result = explainEvaluation([conditionalPolicy], makeReq(), 'deny', subjectInfo)
    const ruleTrace = result.policies[0]!.rules[0]!
    expect(ruleTrace.conditionsMet).toBe(true)
    expect(ruleTrace.conditions.type).toBe('group')
    expect(ruleTrace.conditions.children).toHaveLength(1)
    const child = ruleTrace.conditions.children[0]!
    expect(child.type).toBe('condition')
    expect(child.result).toBe(true)
  })

  it('populates AccessControl.IDecision.rule with the deciding rule on allow', () => {
    const result = explainEvaluation([allowReadPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.rule).toBeDefined()
    expect(result.decision.rule?.id).toBe('r1')
    expect(result.decision.rule?.effect).toBe('allow')
    expect(result.policies[0]!.decidingRule).toBeDefined()
    expect(result.policies[0]!.decidingRule?.id).toBe('r1')
  })

  it('populates AccessControl.IDecision.rule with the deciding rule on deny', () => {
    const result = explainEvaluation([denyAllPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.rule).toBeDefined()
    expect(result.decision.rule?.id).toBe('r-deny')
    expect(result.decision.rule?.effect).toBe('deny')
    expect(result.policies[0]!.decidingRule?.id).toBe('r-deny')
  })

  it('omits AccessControl.IDecision.rule when no rule fires (default-effect path)', () => {
    // No matching rule -> default-effect result; no deciding rule to report.
    const result = explainEvaluation([{ ...allowReadPolicy }], makeReq({ action: 'write' }), 'deny', subjectInfo)
    expect(result.decision.effect).toBe('deny')
    expect(result.decision.rule).toBeUndefined()
  })

  it('AccessControl.IDecision.rule reflects the denying policy when allow + deny chained', () => {
    // AND-combination: deny-all short-circuits, deciding rule must come from that policy.
    const result = explainEvaluation([allowReadPolicy, denyAllPolicy], makeReq(), 'deny', subjectInfo)
    expect(result.decision.allowed).toBe(false)
    expect(result.decision.policy).toBe('deny-all')
    expect(result.decision.rule?.id).toBe('r-deny')
  })

  it('combine="allow-overrides": allowing policy wins despite a denying sibling', () => {
    const result = explainEvaluation(
      [denyAllPolicy, allowReadPolicy],
      makeReq(),
      'deny',
      subjectInfo,
      'allow-overrides',
    )
    expect(result.decision.allowed).toBe(true)
    expect(result.decision.policy).toBe('allow-read')
    expect(result.decision.rule?.id).toBe('r1')
  })

  it('combine="first-applicable": first policy with a deciding rule wins', () => {
    const result = explainEvaluation(
      [allowReadPolicy, denyAllPolicy],
      makeReq(),
      'deny',
      subjectInfo,
      'first-applicable',
    )
    expect(result.decision.allowed).toBe(true)
    expect(result.decision.policy).toBe('allow-read')
  })

  it('combine="first-applicable": falls through to default when no rule fires', () => {
    // Different action so no rules in either policy match.
    const result = explainEvaluation(
      [allowReadPolicy],
      makeReq({ action: 'write' }),
      'deny',
      subjectInfo,
      'first-applicable',
    )
    expect(result.decision.effect).toBe('deny')
    expect(result.decision.rule).toBeUndefined()
  })
})
