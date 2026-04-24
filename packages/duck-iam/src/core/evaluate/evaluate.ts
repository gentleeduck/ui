import { evalConditionGroup } from '../conditions'
import { matchesAction, matchesResource, matchesResourceHierarchical } from '../resolve'
import type { AccessRequest, Decision, Effect, Policy, Rule } from '../types'
import { combiners, type IndexedRule, indexPolicy, policyApplies, ruleApplies } from './evaluate.libs'

/**
 * Inline candidate matching — checks resource + conditions without allocating.
 * Action is already narrowed by the index lookup.
 */
function matchCandidate(
  entry: IndexedRule,
  action: string,
  resType: string,
  resHasDot: boolean,
  req: AccessRequest,
): boolean {
  // Action — already narrowed by index, but handle prefix patterns
  if (!entry.hasWildcardAction && !entry.actions.has(action)) {
    let ok = false
    for (const a of entry.rule.actions) {
      if (matchesAction(a, action)) {
        ok = true
        break
      }
    }
    if (!ok) return false
  }

  // Resource
  if (!entry.hasWildcardResource) {
    let ok = false
    for (const r of entry.rule.resources) {
      if (resHasDot || r.includes('.')) {
        if (matchesResourceHierarchical(r, resType)) {
          ok = true
          break
        }
      } else {
        if (matchesResource(r, resType)) {
          ok = true
          break
        }
      }
    }
    if (!ok) return false
  }

  // Conditions — skip eval entirely for empty/unconditional rules
  const cond = entry.rule.conditions
  if (!('all' in cond) && !('any' in cond) && !('none' in cond)) return true
  return evalConditionGroup(req, cond)
}

/**
 * Evaluates a single policy against an access request.
 *
 * Pure function with no side effects. Checks policy targets first, then
 * evaluates matching rules using the policy's combining algorithm.
 *
 * @param policy        - The policy to evaluate
 * @param request       - The access request to evaluate against
 * @param defaultEffect - Effect to use when no rules match (defaults to `'deny'`)
 * @returns A {@link Decision} with the evaluation result
 */
export function evaluatePolicy(policy: Policy, request: AccessRequest, defaultEffect: Effect = 'deny'): Decision {
  const start = performance.now()

  if (!policyApplies(policy, request)) {
    return {
      allowed: defaultEffect === 'allow',
      effect: defaultEffect,
      policy: policy.id,
      reason: `Policy "${policy.id}" targets don't match -> ${defaultEffect}`,
      duration: performance.now() - start,
      timestamp: Date.now(),
    }
  }

  const matched: Array<{ rule: Rule; effect: Effect }> = []

  for (const rule of policy.rules) {
    if (ruleApplies(rule, request)) {
      matched.push({ rule, effect: rule.effect })
    }
  }

  const combiner = combiners[policy.algorithm]
  const result = combiner(matched, defaultEffect)

  return {
    allowed: result.effect === 'allow',
    effect: result.effect,
    rule: result.rule,
    policy: policy.id,
    reason: result.reason,
    duration: performance.now() - start,
    timestamp: Date.now(),
  }
}

/**
 * Evaluates multiple policies against an access request using AND-combination.
 *
 * A deny from any single policy is final (defense in depth). Policies are
 * evaluated in order; the first non-allow result short-circuits.
 *
 * @param policies      - All policies to evaluate
 * @param request       - The access request to evaluate against
 * @param defaultEffect - Effect to use when no rules match (defaults to `'deny'`)
 * @returns A {@link Decision} with the overall evaluation result
 */
export function evaluate(policies: Policy[], request: AccessRequest, defaultEffect: Effect = 'deny'): Decision {
  const start = performance.now()

  if (policies.length === 0) {
    return {
      allowed: defaultEffect === 'allow',
      effect: defaultEffect,
      reason: 'No policies configured',
      duration: performance.now() - start,
      timestamp: Date.now(),
    }
  }

  let lastAllow: Decision | null = null

  for (const policy of policies) {
    const decision = evaluatePolicy(policy, request, defaultEffect)

    if (!decision.allowed) {
      return {
        ...decision,
        duration: performance.now() - start,
      }
    }
    lastAllow = decision
  }

  return {
    ...(lastAllow ?? {
      allowed: true,
      effect: 'allow' as const,
      reason: 'All policies allowed',
      timestamp: Date.now(),
    }),
    duration: performance.now() - start,
  }
}

// ---------------------------------------------------------------------------
// Fast (production-mode) evaluation — returns plain booleans, no allocations
// ---------------------------------------------------------------------------

/**
 * Fast single-policy evaluation — returns a plain boolean.
 *
 * Zero-allocation hot path: no matched[] array, no { rule, effect } objects,
 * no intermediate arrays. Combines index lookup + rule matching + combining
 * algorithm in a single inlined loop.
 */
export function evaluatePolicyFast(policy: Policy, request: AccessRequest, defaultEffect: Effect = 'deny'): boolean {
  // Inline policyApplies — avoid function call overhead
  const targets = policy.targets
  if (targets) {
    if (targets.actions?.length && !targets.actions.some((a) => matchesAction(a, request.action))) {
      return defaultEffect === 'allow'
    }
    if (targets.resources?.length && !targets.resources.some((r) => matchesResource(r, request.resource.type))) {
      return defaultEffect === 'allow'
    }
    if (targets.roles?.length && !targets.roles.some((role) => request.subject.roles.includes(role))) {
      return defaultEffect === 'allow'
    }
  }

  const idx = indexPolicy(policy)
  const action = request.action
  const resType = request.resource.type

  // Fastest path: pre-computed result for unconditional rules (CASL-like O(1))
  // Two Map.get calls (action → resource) but no string allocation
  const actionMap = idx.precomputed.get(action)
  if (actionMap) {
    const precomputed = actionMap.get(resType)
    if (precomputed !== undefined) return precomputed
  }

  // Primary path: combined action+resource index
  const key = `${action}\0${resType}`
  const exactAR = idx.byActionResource.get(key)
  const wildcardAny = idx.wildcardAny
  const algo = policy.algorithm

  if (algo === 'deny-overrides') {
    let hasAllow = false

    if (exactAR) {
      for (let i = 0; i < exactAR.length; i++) {
        const entry = exactAR[i]!
        // Action+resource already matched by index — only check conditions
        const cond = entry.rule.conditions
        if (('all' in cond || 'any' in cond || 'none' in cond) && !evalConditionGroup(request, cond)) continue
        if (entry.rule.effect === 'deny') return false
        hasAllow = true
      }
    }

    // Check wildcard rules (action:* or resource:*)
    for (let i = 0; i < wildcardAny.length; i++) {
      const entry = wildcardAny[i]!
      if (!matchCandidate(entry, action, resType, resType.includes('.'), request)) continue
      if (entry.rule.effect === 'deny') return false
      hasAllow = true
    }

    return hasAllow ? true : defaultEffect === 'allow'
  }

  if (algo === 'allow-overrides') {
    let hasDeny = false

    if (exactAR) {
      for (let i = 0; i < exactAR.length; i++) {
        const entry = exactAR[i]!
        const cond = entry.rule.conditions
        if (('all' in cond || 'any' in cond || 'none' in cond) && !evalConditionGroup(request, cond)) continue
        if (entry.rule.effect === 'allow') return true
        hasDeny = true
      }
    }

    for (let i = 0; i < wildcardAny.length; i++) {
      const entry = wildcardAny[i]!
      if (!matchCandidate(entry, action, resType, resType.includes('.'), request)) continue
      if (entry.rule.effect === 'allow') return true
      hasDeny = true
    }

    return hasDeny ? false : defaultEffect === 'allow'
  }

  if (algo === 'first-match') {
    if (exactAR) {
      for (let i = 0; i < exactAR.length; i++) {
        const entry = exactAR[i]!
        const cond = entry.rule.conditions
        if (('all' in cond || 'any' in cond || 'none' in cond) && !evalConditionGroup(request, cond)) continue
        return entry.rule.effect === 'allow'
      }
    }
    for (let i = 0; i < wildcardAny.length; i++) {
      const entry = wildcardAny[i]!
      if (matchCandidate(entry, action, resType, resType.includes('.'), request)) {
        return entry.rule.effect === 'allow'
      }
    }
    return defaultEffect === 'allow'
  }

  // highest-priority — need to scan all
  let bestPriority = -Infinity
  let bestEffect: Effect | null = null

  if (exactAR) {
    for (let i = 0; i < exactAR.length; i++) {
      const entry = exactAR[i]!
      const cond = entry.rule.conditions
      if (('all' in cond || 'any' in cond || 'none' in cond) && !evalConditionGroup(request, cond)) continue
      if (entry.rule.priority > bestPriority) {
        bestPriority = entry.rule.priority
        bestEffect = entry.rule.effect
      }
    }
  }
  for (let i = 0; i < wildcardAny.length; i++) {
    const entry = wildcardAny[i]!
    if (!matchCandidate(entry, action, resType, resType.includes('.'), request)) continue
    if (entry.rule.priority > bestPriority) {
      bestPriority = entry.rule.priority
      bestEffect = entry.rule.effect
    }
  }

  return bestEffect !== null ? bestEffect === 'allow' : defaultEffect === 'allow'
}

/**
 * Fast multi-policy evaluation — AND-combines policies, returns plain boolean.
 * Short-circuits on first deny.
 */
export function evaluateFast(policies: Policy[], request: AccessRequest, defaultEffect: Effect = 'deny'): boolean {
  if (policies.length === 0) return defaultEffect === 'allow'

  for (const policy of policies) {
    if (!evaluatePolicyFast(policy, request, defaultEffect)) return false
  }

  return true
}
