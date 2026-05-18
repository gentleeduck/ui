/** biome-ignore-all lint/style/noNonNullAssertion: hot-path index iteration is guarded by `i < arr.length`. */

import { evalConditionGroup } from '../conditions'
import { matchesAction, matchesResource, matchesResourceHierarchical } from '../resolve'
import type { AccessControl, Request } from '../types'
import { combiners, indexPolicy, policyApplies, ruleApplies } from './evaluate.libs'
import type { Evaluate } from './evaluate.types'

/**
 * Yield parent prefixes of a resource type, longest-first.
 *
 * A literal pattern `'org'` parent-matches request type `'org:project:doc'` via
 * `matchesResource` (colon separator) or `'org.users'` via
 * `matchesResourceHierarchical` (dot separator). The fast path's literal index
 * is keyed by the rule's pattern, not the request's, so on miss we look up
 * each parent prefix to find such rules.
 *
 * Separator choice matches `ruleApplies`: dot when either side contains `.`,
 * otherwise colon.
 */
function parentPrefixes(resType: string): string[] {
  const sep = resType.includes('.') ? '.' : ':'
  const out: string[] = []
  let i = resType.lastIndexOf(sep)
  while (i > 0) {
    out.push(resType.slice(0, i))
    i = resType.lastIndexOf(sep, i - 1)
  }
  return out
}

/**
 * Inline candidate matching - checks resource + conditions without allocating.
 * Action is already narrowed by the index lookup.
 */
function matchCandidate(
  entry: Evaluate.IIndexedRule,
  action: string,
  resType: string,
  resHasDot: boolean,
  req: Request.IAccessRequest,
): boolean {
  // Action - already narrowed by index, but handle prefix patterns
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

  if (!entry.hasConditions) return true
  return evalConditionGroup(req, entry.rule.conditions)
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
 * @returns An {@link AccessControl.IDecision} with the evaluation result
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function evaluatePolicy(
  policy: AccessControl.IPolicy,
  request: Request.IAccessRequest,
  defaultEffect: AccessControl.Effect = 'deny',
): AccessControl.IDecision {
  const start = performance.now()

  if (!policyApplies(policy, request)) {
    // NotApplicable: policy is neutral - the cross-policy combine must skip it,
    // not fold it as the default effect.
    return {
      allowed: defaultEffect === 'allow',
      effect: defaultEffect,
      policy: policy.id,
      reason: `Policy "${policy.id}" targets do not match. Not applicable.`,
      duration: performance.now() - start,
      timestamp: Date.now(),
      applicable: false,
    }
  }

  const matched: Array<{ rule: AccessControl.IRule; effect: AccessControl.Effect }> = []

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
 * Combine decisions across multiple policies according to `combine`.
 *
 * - `'and'` (default): every policy must allow. First deny short-circuits.
 * - `'allow-overrides'`: any allowing policy wins, regardless of denies elsewhere.
 * - `'first-applicable'`: first policy whose targets+rules fired a non-default
 *   decision wins. Useful when policies are ordered by specificity.
 *
 * @param policies      All policies to evaluate.
 * @param request       The access request.
 * @param defaultEffect Effect when no rule fires within a policy.
 * @param combine       Cross-policy combine strategy (defaults to `'and'`).
 * @param onPolicyError Invoked when a single policy throws; the offending policy
 *   is treated as NotApplicable so the rest still evaluate.
 * @returns The merged {@link AccessControl.IDecision} across all policies.
 * @example
 * ```ts
 * const decision = evaluate(policies, request, 'deny', 'and')
 * if (!decision.allowed) console.warn(decision.reason)
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function evaluate(
  policies: AccessControl.IPolicy[],
  request: Request.IAccessRequest,
  defaultEffect: AccessControl.Effect = 'deny',
  combine: AccessControl.PolicyCombine = 'and',
  onPolicyError?: (err: Error, policy: AccessControl.IPolicy) => void,
): AccessControl.IDecision {
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

  /**
   * Same fail-skip contract as {@link evaluateFast}: one rotten policy must
   * not break the whole evaluation. Synthesise a NotApplicable decision so
   * the combiner skips it cleanly.
   */
  const safeEval = (policy: AccessControl.IPolicy): AccessControl.IDecision => {
    try {
      return evaluatePolicy(policy, request, defaultEffect)
    } catch (err) {
      onPolicyError?.(err instanceof Error ? err : new Error(String(err)), policy)
      return {
        allowed: defaultEffect === 'allow',
        effect: defaultEffect,
        reason: 'Policy evaluation error - skipped',
        applicable: false,
        duration: 0,
        timestamp: Date.now(),
      }
    }
  }

  if (combine === 'and') {
    let lastAllow: AccessControl.IDecision | null = null
    let anyApplicable = false
    for (const policy of policies) {
      const decision = safeEval(policy)
      if (decision.applicable === false) continue
      anyApplicable = true
      if (!decision.allowed) return { ...decision, duration: performance.now() - start }
      lastAllow = decision
    }
    if (!anyApplicable) {
      return {
        allowed: defaultEffect === 'allow',
        effect: defaultEffect,
        reason: `No policy applicable. Defaulted to ${defaultEffect}`,
        duration: performance.now() - start,
        timestamp: Date.now(),
      }
    }
    return { ...(lastAllow as AccessControl.IDecision), duration: performance.now() - start }
  }

  if (combine === 'allow-overrides') {
    let lastDeny: AccessControl.IDecision | null = null
    let anyApplicable = false
    for (const policy of policies) {
      const decision = safeEval(policy)
      if (decision.applicable === false) continue
      anyApplicable = true
      if (decision.allowed) return { ...decision, duration: performance.now() - start }
      lastDeny = decision
    }
    if (!anyApplicable) {
      return {
        allowed: defaultEffect === 'allow',
        effect: defaultEffect,
        reason: `No policy applicable. Defaulted to ${defaultEffect}`,
        duration: performance.now() - start,
        timestamp: Date.now(),
      }
    }
    return { ...(lastDeny as AccessControl.IDecision), duration: performance.now() - start }
  }

  for (const policy of policies) {
    const decision = safeEval(policy)
    if (decision.applicable === false) continue
    if (decision.rule !== undefined) return { ...decision, duration: performance.now() - start }
  }
  return {
    allowed: defaultEffect === 'allow',
    effect: defaultEffect,
    reason: `No policy was applicable. Defaulted to ${defaultEffect}`,
    duration: performance.now() - start,
    timestamp: Date.now(),
  }
}

/**
 * Fast (production-mode) single-policy evaluation.
 *
 * Returns `true` / `false` when the policy applies; returns `null` when the
 * policy's targets don't match the request (NotApplicable - the cross-policy
 * combine treats it as neutral, not as the default effect).
 *
 * Avoids the trace path's per-call allocations (no `matched[]`, no
 * `{ rule, effect }` objects, no intermediate arrays). Condition evaluation
 * itself can still allocate; "zero-allocation" applies to the combiner shell.
 *
 * @param policy        The policy to evaluate.
 * @param request       The access request.
 * @param defaultEffect Effect to use when no rules match (defaults to `'deny'`).
 * @returns `true` / `false` for an applicable allow / deny, `null` when the
 *   policy is NotApplicable for this request.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function evaluatePolicyFast(
  policy: AccessControl.IPolicy,
  request: Request.IAccessRequest,
  defaultEffect: AccessControl.Effect = 'deny',
): boolean | null {
  // Inline policyApplies - avoid function call overhead
  const targets = policy.targets
  if (targets) {
    if (targets.actions?.length && !targets.actions.some((a) => matchesAction(a, request.action))) return null
    if (targets.resources?.length && !targets.resources.some((r) => matchesResource(r, request.resource.type))) {
      return null
    }
    if (targets.roles?.length && !targets.roles.some((role) => request.subject.roles.includes(role))) return null
  }

  const idx = indexPolicy(policy)
  const action = request.action
  const resType = request.resource.type

  // Fastest path: pre-computed result for unconditional rules (CASL-like O(1))
  // Walks parent prefixes so a literal pattern `'org'` precomputed result is
  // returned for a request of `'org:project'`.
  const actionMap = idx.precomputed.get(action)
  if (actionMap) {
    let precomputed = actionMap.get(resType)
    if (precomputed === undefined) {
      for (const parent of parentPrefixes(resType)) {
        const v = actionMap.get(parent)
        if (v !== undefined) {
          precomputed = v
          break
        }
      }
    }
    if (precomputed !== undefined) return precomputed
  }

  // Literal buckets the request matches by either exact key or parent prefix.
  // Each entry inside has action+resource already matched at index level;
  // only conditions remain to verify.
  const literalBuckets: Evaluate.IIndexedRule[][] = []
  const exactAR = idx.byActionResource.get(`${action}\0${resType}`)
  if (exactAR) literalBuckets.push(exactAR)
  for (const parent of parentPrefixes(resType)) {
    const b = idx.byActionResource.get(`${action}\0${parent}`)
    if (b) literalBuckets.push(b)
  }
  const wildcardAny = idx.wildcardAny
  const resHasDot = resType.includes('.')
  const algo = policy.algorithm

  if (algo === 'deny-overrides') {
    let hasAllow = false
    for (let bi = 0; bi < literalBuckets.length; bi++) {
      const bucket = literalBuckets[bi]!
      for (let i = 0; i < bucket.length; i++) {
        const entry = bucket[i]!
        if (entry.hasConditions && !evalConditionGroup(request, entry.rule.conditions)) continue
        if (entry.rule.effect === 'deny') return false
        hasAllow = true
      }
    }
    for (let i = 0; i < wildcardAny.length; i++) {
      const entry = wildcardAny[i]!
      if (!matchCandidate(entry, action, resType, resHasDot, request)) continue
      if (entry.rule.effect === 'deny') return false
      hasAllow = true
    }
    return hasAllow ? true : defaultEffect === 'allow'
  }

  if (algo === 'allow-overrides') {
    let hasDeny = false
    for (let bi = 0; bi < literalBuckets.length; bi++) {
      const bucket = literalBuckets[bi]!
      for (let i = 0; i < bucket.length; i++) {
        const entry = bucket[i]!
        if (entry.hasConditions && !evalConditionGroup(request, entry.rule.conditions)) continue
        if (entry.rule.effect === 'allow') return true
        hasDeny = true
      }
    }
    for (let i = 0; i < wildcardAny.length; i++) {
      const entry = wildcardAny[i]!
      if (!matchCandidate(entry, action, resType, resHasDot, request)) continue
      if (entry.rule.effect === 'allow') return true
      hasDeny = true
    }
    return hasDeny ? false : defaultEffect === 'allow'
  }

  // first-match (priority-aware) + highest-priority share the scan loop.
  let bestPriority = -Infinity
  let bestEffect: AccessControl.Effect | null = null
  for (let bi = 0; bi < literalBuckets.length; bi++) {
    const bucket = literalBuckets[bi]!
    for (let i = 0; i < bucket.length; i++) {
      const entry = bucket[i]!
      if (entry.hasConditions && !evalConditionGroup(request, entry.rule.conditions)) continue
      if (entry.rule.priority > bestPriority) {
        bestPriority = entry.rule.priority
        bestEffect = entry.rule.effect
      }
    }
  }
  for (let i = 0; i < wildcardAny.length; i++) {
    const entry = wildcardAny[i]!
    if (!matchCandidate(entry, action, resType, resHasDot, request)) continue
    if (entry.rule.priority > bestPriority) {
      bestPriority = entry.rule.priority
      bestEffect = entry.rule.effect
    }
  }
  return bestEffect !== null ? bestEffect === 'allow' : defaultEffect === 'allow'
}

/**
 * Fast multi-policy evaluation - returns a plain boolean.
 *
 * Mirrors {@link evaluate}'s `combine` modes. `'first-applicable'` is not
 * supported here (the policy-fast path returns a tri-state but cannot
 * distinguish "rule fired" from "default applied" - the `Engine` constructor
 * refuses the combination at boot).
 *
 * @param policies      All policies to evaluate.
 * @param request       The access request.
 * @param defaultEffect Effect to use when no rules fire (defaults to `'deny'`).
 * @param combine       Cross-policy combine strategy (defaults to `'and'`).
 * @param onPolicyError Invoked when a single policy throws; the offending policy
 *   is treated as NotApplicable so the rest still evaluate.
 * @returns `true` when the final verdict is allow, `false` otherwise.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function evaluateFast(
  policies: AccessControl.IPolicy[],
  request: Request.IAccessRequest,
  defaultEffect: AccessControl.Effect = 'deny',
  combine: AccessControl.PolicyCombine = 'and',
  onPolicyError?: (err: Error, policy: AccessControl.IPolicy) => void,
): boolean {
  if (policies.length === 0) return defaultEffect === 'allow'

  /**
   * A single rotten row (NaN priority, malformed condition, etc.) must not
   * poison the whole evaluation - treat the offending policy as NotApplicable
   * and route the error to `onPolicyError` so the operator can alert.
   */
  const safeEval = (policy: AccessControl.IPolicy): boolean | null => {
    try {
      return evaluatePolicyFast(policy, request, defaultEffect)
    } catch (err) {
      onPolicyError?.(err instanceof Error ? err : new Error(String(err)), policy)
      return null
    }
  }

  if (combine === 'allow-overrides') {
    let anyApplicable = false
    for (const policy of policies) {
      const r = safeEval(policy)
      if (r === null) continue
      anyApplicable = true
      if (r) return true
    }
    return anyApplicable ? false : defaultEffect === 'allow'
  }

  // 'and' (and 'first-applicable' fall-through, which Engine ctor blocks for prod).
  let anyApplicable = false
  for (const policy of policies) {
    const r = safeEval(policy)
    if (r === null) continue
    anyApplicable = true
    if (!r) return false
  }
  return anyApplicable ? true : defaultEffect === 'allow'
}
