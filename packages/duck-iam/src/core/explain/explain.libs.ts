import { evaluateOperator, resolveConditionValue } from '../conditions'
import { matchesAction, matchesResource, matchesResourceHierarchical, resolve } from '../resolve'
import type { AccessRequest, CombiningAlgorithm, Condition, ConditionGroup, Effect, Policy, Rule } from '../types'
import type { ConditionGroupTrace, ConditionLeafTrace, ConditionTrace, PolicyTrace, RuleTrace } from './explain.types'

/** Maximum nesting depth for traced condition groups. */
const MAX_TRACE_DEPTH = 10

/** Type guard that distinguishes a flat `Condition` from a nested `ConditionGroup`. */
function isCondition(item: Condition | ConditionGroup): item is Condition {
  return 'field' in item
}

/** Trace a single leaf condition, capturing actual vs expected values and the result. */
function traceLeaf(req: AccessRequest, cond: Condition): ConditionLeafTrace {
  const actual = resolve(req, cond.field)
  const expected = resolveConditionValue(req, cond.value ?? null)
  const result = evaluateOperator(cond.operator, actual, expected)
  return { type: 'condition', field: cond.field, operator: cond.operator, expected, actual, result }
}

/** Trace a single condition item, dispatching to leaf or group tracer. */
function traceItem(req: AccessRequest, item: Condition | ConditionGroup, depth: number): ConditionTrace {
  return isCondition(item) ? traceLeaf(req, item) : traceGroup(req, item, depth)
}

/** Recursively trace a condition group, producing child traces for each item. */
function traceGroup(req: AccessRequest, group: ConditionGroup, depth = 0): ConditionGroupTrace {
  if (depth >= MAX_TRACE_DEPTH) {
    return { type: 'group', logic: 'all', result: false, children: [] }
  }

  if ('all' in group) {
    const children = group.all.map((item) => traceItem(req, item, depth + 1))
    return { type: 'group', logic: 'all', result: children.every((c) => c.result), children }
  }

  if ('any' in group) {
    const children = group.any.map((item) => traceItem(req, item, depth + 1))
    return { type: 'group', logic: 'any', result: children.some((c) => c.result), children }
  }

  if ('none' in group) {
    const children = group.none.map((item) => traceItem(req, item, depth + 1))
    return { type: 'group', logic: 'none', result: children.every((c) => !c.result), children }
  }

  return { type: 'group', logic: 'all', result: false, children: [] }
}

/** Trace a single rule evaluation: action match, resource match, and condition tree. */
function traceRule(rule: Rule, req: AccessRequest): RuleTrace {
  const actionMatch = rule.actions.some((a) => matchesAction(a, req.action))

  const resourceMatch = rule.resources.some((r) => {
    if (r.includes('.') || req.resource.type.includes('.')) {
      return matchesResourceHierarchical(r, req.resource.type)
    }
    return matchesResource(r, req.resource.type)
  })

  const conditions = traceGroup(req, rule.conditions)

  return {
    ruleId: rule.id,
    description: rule.description,
    effect: rule.effect,
    priority: rule.priority,
    actionMatch,
    resourceMatch,
    conditionsMet: conditions.result,
    conditions,
    matched: actionMatch && resourceMatch && conditions.result,
  }
}

/** Apply a combining algorithm to matched rule traces, mirroring the evaluate module logic. */
function applyCombiner(
  algorithm: CombiningAlgorithm,
  matched: readonly RuleTrace[],
  defaultEffect: Effect,
): { effect: Effect; reason: string; decidingRuleId?: string } {
  switch (algorithm) {
    case 'deny-overrides': {
      const deny = matched.find((r) => r.effect === 'deny')
      if (deny) return { effect: 'deny', reason: `Denied by rule "${deny.ruleId}"`, decidingRuleId: deny.ruleId }
      const allow = matched.find((r) => r.effect === 'allow')
      if (allow) return { effect: 'allow', reason: `Allowed by rule "${allow.ruleId}"`, decidingRuleId: allow.ruleId }
      return { effect: defaultEffect, reason: `No matching rules -> ${defaultEffect}` }
    }
    case 'allow-overrides': {
      const allow = matched.find((r) => r.effect === 'allow')
      if (allow) return { effect: 'allow', reason: `Allowed by rule "${allow.ruleId}"`, decidingRuleId: allow.ruleId }
      const deny = matched.find((r) => r.effect === 'deny')
      if (deny) return { effect: 'deny', reason: `Denied by rule "${deny.ruleId}"`, decidingRuleId: deny.ruleId }
      return { effect: defaultEffect, reason: `No matching rules -> ${defaultEffect}` }
    }
    case 'first-match': {
      const first = matched[0]
      if (first) {
        return {
          effect: first.effect,
          reason: `First match: rule "${first.ruleId}" (${first.effect})`,
          decidingRuleId: first.ruleId,
        }
      }
      return { effect: defaultEffect, reason: `No matching rules -> ${defaultEffect}` }
    }
    case 'highest-priority': {
      if (matched.length > 0) {
        const sorted = [...matched].sort((a, b) => b.priority - a.priority)
        const top = sorted[0] as (typeof sorted)[0]
        return {
          effect: top.effect,
          reason: `Highest priority: rule "${top.ruleId}" (p=${top.priority})`,
          decidingRuleId: top.ruleId,
        }
      }
      return { effect: defaultEffect, reason: `No matching rules -> ${defaultEffect}` }
    }
  }
}

/** Check whether a policy's target constraints match the request. */
function policyTargetsMatch(policy: Policy, req: AccessRequest): boolean {
  if (!policy.targets) return true
  const { actions, resources, roles } = policy.targets
  if (actions?.length && !actions.some((a) => matchesAction(a, req.action))) return false
  if (resources?.length && !resources.some((r) => matchesResource(r, req.resource.type))) return false
  if (roles?.length && !roles.some((role) => req.subject.roles.includes(role))) return false
  return true
}

/** Trace a full policy evaluation: target matching, rule traces, and combining algorithm result. */
export function tracePolicy(policy: Policy, req: AccessRequest, defaultEffect: Effect): PolicyTrace {
  const targetMatch = policyTargetsMatch(policy, req)

  if (!targetMatch) {
    return {
      policyId: policy.id,
      policyName: policy.name,
      algorithm: policy.algorithm,
      targetMatch: false,
      rules: [],
      result: defaultEffect,
      reason: `Policy "${policy.id}" targets don't match -> ${defaultEffect}`,
    }
  }

  const ruleTraces = policy.rules.map((rule) => traceRule(rule, req))
  const matched = ruleTraces.filter((r) => r.matched)
  const { effect, reason, decidingRuleId } = applyCombiner(policy.algorithm, matched, defaultEffect)

  return {
    policyId: policy.id,
    policyName: policy.name,
    algorithm: policy.algorithm,
    targetMatch: true,
    rules: ruleTraces,
    result: effect,
    reason,
    decidingRuleId,
  }
}
