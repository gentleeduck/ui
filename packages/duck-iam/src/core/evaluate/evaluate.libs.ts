/** biome-ignore-all lint/style/noNonNullAssertion: hot-path index iteration is guarded by `i < arr.length`. */
import { evalConditionGroup } from '../conditions'
import { matchesAction, matchesResource, matchesResourceHierarchical } from '../resolve'
import type { AccessControl, Request } from '../types'
import type { Evaluate } from './evaluate.types'
/**
 * Checks whether a single rule applies to the given access request.
 *
 * A rule applies when its action patterns match the requested action,
 * its resource patterns match the requested resource type, and all
 * conditions (if any) evaluate to true.
 *
 * @param rule - The rule to test
 * @param req  - The incoming access request
 * @returns `true` if the rule matches the request
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function ruleApplies(rule: AccessControl.IRule, req: Request.IAccessRequest): boolean {
  const actionMatch = rule.actions.some((a) => matchesAction(a, req.action))
  if (!actionMatch) return false

  // Hoist the dot check - compute once before the .some() loop
  const resourceHasDot = req.resource.type.includes('.')

  const resourceMatch = rule.resources.some((r) => {
    // Use dot-based matching if either pattern or resource type contains a dot
    if (resourceHasDot || r.includes('.')) {
      return matchesResourceHierarchical(r, req.resource.type)
    }
    return matchesResource(r, req.resource.type)
  })
  if (!resourceMatch) return false

  return evalConditionGroup(req, rule.conditions)
}

/**
 * Checks whether a policy's target constraints match the given access request.
 *
 * If the policy has no targets defined, it applies to all requests.
 * Otherwise, each target dimension (actions, resources, roles) is checked
 * independently - all specified dimensions must match.
 *
 * @param policy - The policy whose targets to check
 * @param req    - The incoming access request
 * @returns `true` if the policy should be evaluated for this request
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function policyApplies(policy: AccessControl.IPolicy, req: Request.IAccessRequest): boolean {
  if (!policy.targets) return true

  const { actions, resources, roles } = policy.targets

  if (actions?.length && !actions.some((a) => matchesAction(a, req.action))) {
    return false
  }

  if (resources?.length && !resources.some((r) => matchesResource(r, req.resource.type))) {
    return false
  }

  if (roles?.length && !roles.some((role) => req.subject.roles.includes(role))) {
    return false
  }

  return true
}

/**
 * Combining-algorithm implementations. Each picks one matched rule's effect:
 *
 * - `deny-overrides`   - any deny wins; otherwise first allow wins.
 * - `allow-overrides`  - any allow wins; otherwise first deny wins.
 * - `first-match`      - highest-priority match wins; ties resolved by source order.
 * - `highest-priority` - highest-priority match wins (alias of `first-match` once ties tie-break by priority alone).
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const combiners: Record<AccessControl.CombiningAlgorithm, Evaluate.Combiner> = {
  'deny-overrides': (matched, defaultEffect) => {
    const deny = matched.find((m) => m.effect === 'deny')
    if (deny) {
      return {
        rule: deny.rule,
        effect: 'deny',
        reason: `Denied by rule "${deny.rule.id}"`,
      }
    }
    const allow = matched.find((m) => m.effect === 'allow')
    if (allow) {
      return {
        rule: allow.rule,
        effect: 'allow',
        reason: `Allowed by rule "${allow.rule.id}"`,
      }
    }
    return { effect: defaultEffect, reason: `No matching rules. Defaulted to ${defaultEffect}` }
  },

  'allow-overrides': (matched, defaultEffect) => {
    const allow = matched.find((m) => m.effect === 'allow')
    if (allow) {
      return {
        rule: allow.rule,
        effect: 'allow',
        reason: `Allowed by rule "${allow.rule.id}"`,
      }
    }
    const deny = matched.find((m) => m.effect === 'deny')
    if (deny) {
      return {
        rule: deny.rule,
        effect: 'deny',
        reason: `Denied by rule "${deny.rule.id}"`,
      }
    }
    return { effect: defaultEffect, reason: `No matching rules. Defaulted to ${defaultEffect}` }
  },

  'first-match': (matched, defaultEffect) => {
    if (matched.length === 0) {
      return { effect: defaultEffect, reason: `No matching rules. Defaulted to ${defaultEffect}` }
    }
    // Highest priority first; stable on ties preserves source order
    let first = matched[0]!
    for (let i = 1; i < matched.length; i++) {
      const cur = matched[i]!
      if (cur.rule.priority > first.rule.priority) first = cur
    }
    return {
      rule: first.rule,
      effect: first.effect,
      reason: `First match: rule "${first.rule.id}" (${first.effect})`,
    }
  },

  'highest-priority': (matched, defaultEffect) => {
    if (matched.length > 0) {
      const top = matched.reduce((best, cur) => (cur.rule.priority > best.rule.priority ? cur : best))
      return {
        rule: top.rule,
        effect: top.effect,
        reason: `Highest priority: rule "${top.rule.id}" (p=${top.rule.priority})`,
      }
    }
    return { effect: defaultEffect, reason: `No matching rules. Defaulted to ${defaultEffect}` }
  },
}

/**
 * True when a pattern matches more than its own literal value (`'*'`, `'foo:*'`,
 * `'foo.*'`). Such patterns can't be served by the literal-keyed `byActionResource`
 * map and must be checked via the wildcardAny scan.
 */
function isExpansivePattern(p: string): boolean {
  return p.includes('*')
}

/** WeakMap so indexes are GC'd when the policy is no longer referenced. */
const indexCache = new WeakMap<AccessControl.IPolicy, Evaluate.IPolicyRuleIndex>()

/**
 * Build (or retrieve from cache) a rule index for a policy.
 *
 * @param policy - The policy whose rules should be indexed.
 * @returns The cached or freshly built {@link Evaluate.IPolicyRuleIndex}.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function indexPolicy(policy: AccessControl.IPolicy): Evaluate.IPolicyRuleIndex {
  const cached = indexCache.get(policy)
  if (cached) return cached

  const byActionResource = new Map<string, Evaluate.IIndexedRule[]>()
  const wildcardAny: Evaluate.IIndexedRule[] = []

  for (const rule of policy.rules) {
    const actions = new Set(rule.actions as string[])
    const resources = new Set(rule.resources as string[])
    let hasWildcardAction = false
    for (const a of actions) {
      if (isExpansivePattern(a)) {
        hasWildcardAction = true
        break
      }
    }
    let hasWildcardResource = false
    for (const r of resources) {
      if (isExpansivePattern(r)) {
        hasWildcardResource = true
        break
      }
    }
    const c = rule.conditions
    const hasConditions = !!c && ('all' in c || 'any' in c || 'none' in c)
    const entry: Evaluate.IIndexedRule = {
      rule,
      actions,
      resources,
      hasWildcardAction,
      hasWildcardResource,
      hasConditions,
    }

    if (hasWildcardAction || hasWildcardResource) wildcardAny.push(entry)

    // Only rules with literal actions AND resources go into the exact-key index;
    // expansive patterns (`*`, `foo:*`, `foo.*`) are handled by the wildcardAny scan.
    if (!hasWildcardAction && !hasWildcardResource) {
      for (const a of actions) {
        for (const r of resources) {
          const key = `${a}\0${r}`
          let bucket = byActionResource.get(key)
          if (!bucket) {
            bucket = []
            byActionResource.set(key, bucket)
          }
          bucket.push(entry)
        }
      }
    }
  }

  // Pre-compute results for unconditional exact-match rules (CASL-like O(1)).
  // Only when no wildcard rules exist (they could override the result).
  const precomputed = new Map<string, Map<string, boolean>>()
  const algo = policy.algorithm

  if (wildcardAny.length === 0 && (algo === 'deny-overrides' || algo === 'allow-overrides' || algo === 'first-match')) {
    for (const rule of policy.rules) {
      const c = rule.conditions
      if ('all' in c || 'any' in c || 'none' in c) continue
      if (rule.actions.some(isExpansivePattern) || rule.resources.some(isExpansivePattern)) continue

      for (const a of rule.actions) {
        for (const r of rule.resources) {
          const arKey = `${a}\0${r}`
          const entries = byActionResource.get(arKey)
          if (!entries) continue

          // Only precompute when every entry in this bucket is unconditional  -
          // otherwise the result depends on the request and can't be cached.
          let allUnconditional = true
          for (const e of entries) {
            const ec = e.rule.conditions
            if ('all' in ec || 'any' in ec || 'none' in ec) {
              allUnconditional = false
              break
            }
          }
          if (!allUnconditional) continue

          // Simulate combining algorithm
          let result: boolean | undefined
          if (algo === 'deny-overrides') {
            let hasAllow = false
            for (const e of entries) {
              if (e.rule.effect === 'deny') {
                result = false
                break
              }
              if (e.rule.effect === 'allow') hasAllow = true
            }
            if (result === undefined && hasAllow) result = true
          } else if (algo === 'allow-overrides') {
            let hasDeny = false
            for (const e of entries) {
              if (e.rule.effect === 'allow') {
                result = true
                break
              }
              if (e.rule.effect === 'deny') hasDeny = true
            }
            if (result === undefined && hasDeny) result = false
          } else if (algo === 'first-match' && entries.length > 0) {
            let best = entries[0]!
            for (let i = 1; i < entries.length; i++) {
              const cur = entries[i]!
              if (cur.rule.priority > best.rule.priority) best = cur
            }
            result = best.rule.effect === 'allow'
          }

          if (result !== undefined) {
            let actionMap = precomputed.get(a)
            if (!actionMap) {
              actionMap = new Map()
              precomputed.set(a, actionMap)
            }
            actionMap.set(r, result)
          }
        }
      }
    }
  }

  const idx: Evaluate.IPolicyRuleIndex = { byActionResource, wildcardAny, precomputed }
  indexCache.set(policy, idx)
  return idx
}
