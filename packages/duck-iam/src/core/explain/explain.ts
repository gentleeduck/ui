import type { AccessControl, Request } from '../types'
import { tracePolicy } from './explain.libs'
import type { Explain } from './explain.types'
/**
 * Produce a detailed evaluation trace for debugging authorization decisions.
 * Every policy is traced (no short-circuit) so callers can see the full picture;
 * `combine` controls which trace produces the final {@link AccessControl.IDecision}.
 *
 * @param policies      All policies to trace.
 * @param request       The access request.
 * @param defaultEffect Effect when no rule fires inside any policy.
 * @param subjectInfo   Subject metadata (id, roles, scoped roles applied).
 * @param combine       Cross-policy combine strategy (defaults to `'and'`).
 * @returns A full {@link Explain.IResult} describing every policy trace and the final decision.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function explainEvaluation(
  policies: AccessControl.IPolicy[],
  request: Request.IAccessRequest,
  defaultEffect: AccessControl.Effect,
  subjectInfo: Explain.ISubjectInfo,
  combine: AccessControl.PolicyCombine = 'and',
): Explain.IResult {
  const start = performance.now()

  const policyTraces = policies.map((p) => tracePolicy(p, request, defaultEffect))

  let finalEffect: AccessControl.Effect = defaultEffect
  let finalReason = 'No policies configured'
  let finalPolicy: string | undefined
  let finalRule: AccessControl.IRule | undefined

  if (policies.length > 0) {
    const decided = decideFinal(policyTraces, defaultEffect, combine)
    finalEffect = decided.effect
    finalReason = decided.reason
    finalPolicy = decided.policy
    finalRule = decided.rule
  }

  const decision: AccessControl.IDecision = {
    allowed: finalEffect === 'allow',
    effect: finalEffect,
    rule: finalRule,
    policy: finalPolicy,
    reason: finalReason,
    duration: performance.now() - start,
    timestamp: Date.now(),
  }

  const summary = buildSummary(decision, policyTraces, subjectInfo, request)

  return {
    decision,
    request: {
      action: request.action,
      resourceType: request.resource.type,
      resourceId: request.resource.id,
      scope: request.scope,
    },
    subject: {
      id: subjectInfo.subjectId,
      roles: subjectInfo.originalRoles,
      scopedRolesApplied: subjectInfo.scopedRolesApplied,
      attributes: request.subject.attributes,
    },
    policies: policyTraces,
    summary,
  }
}

/** Resolve the final decision across all policy traces under the given combine mode. */
function decideFinal(
  traces: readonly Explain.IPolicyTrace[],
  defaultEffect: AccessControl.Effect,
  combine: AccessControl.PolicyCombine,
): { effect: AccessControl.Effect; reason: string; policy?: string; rule?: AccessControl.IRule } {
  // NotApplicable traces (targets didn't match) are skipped in every mode  -
  // they contribute nothing to the cross-policy combine.
  const applicable = traces.filter((t) => t.targetMatch)

  if (combine === 'and') {
    let lastAllow: Explain.IPolicyTrace | null = null
    for (const pt of applicable) {
      if (pt.result !== 'allow') {
        return { effect: 'deny', reason: pt.reason, policy: pt.policyId, rule: pt.decidingRule }
      }
      lastAllow = pt
    }
    if (lastAllow) {
      return { effect: 'allow', reason: lastAllow.reason, policy: lastAllow.policyId, rule: lastAllow.decidingRule }
    }
  } else if (combine === 'allow-overrides') {
    let lastDeny: Explain.IPolicyTrace | null = null
    for (const pt of applicable) {
      if (pt.result === 'allow') {
        return { effect: 'allow', reason: pt.reason, policy: pt.policyId, rule: pt.decidingRule }
      }
      lastDeny = pt
    }
    if (lastDeny) {
      return { effect: 'deny', reason: lastDeny.reason, policy: lastDeny.policyId, rule: lastDeny.decidingRule }
    }
  } else {
    // first-applicable
    for (const pt of applicable) {
      if (pt.decidingRule) {
        return { effect: pt.result, reason: pt.reason, policy: pt.policyId, rule: pt.decidingRule }
      }
    }
  }
  return {
    effect: defaultEffect,
    reason:
      applicable.length === 0
        ? `No applicable policy across ${traces.length} policies -> ${defaultEffect}`
        : `No matching rules across ${applicable.length} applicable policies -> ${defaultEffect}`,
  }
}

/** Build a human-readable multi-line summary of the evaluation trace. */
function buildSummary(
  decision: AccessControl.IDecision,
  policyTraces: Explain.IPolicyTrace[],
  info: Explain.ISubjectInfo,
  req: Request.IAccessRequest,
): string {
  const verb = decision.allowed ? 'ALLOWED' : 'DENIED'
  const parts: string[] = []

  // Header
  parts.push(
    `${verb}: "${info.subjectId}" -> ${req.action} on ${req.resource.type}${req.scope ? ` [scope: ${req.scope}]` : ''}`,
  )

  // Roles
  const roles = [...info.originalRoles]
  if (info.scopedRolesApplied.length > 0) {
    parts.push(`  Roles: [${roles.join(', ')}] + scoped: [${info.scopedRolesApplied.join(', ')}]`)
  } else {
    parts.push(`  Roles: [${roles.join(', ')}]`)
  }

  // Per-policy summary
  for (const pt of policyTraces) {
    const matched = pt.rules.filter((r) => r.matched).length
    const total = pt.rules.length

    if (!pt.targetMatch) {
      parts.push(`  ${pt.policyId}: targets don't match (${pt.result})`)
    } else if (pt.decidingRuleId) {
      parts.push(`  ${pt.policyId} [${pt.algorithm}]: ${pt.reason} (${matched}/${total} rules matched)`)
    } else {
      parts.push(`  ${pt.policyId} [${pt.algorithm}]: no matching rules -> ${pt.result} (0/${total} rules evaluated)`)
    }
  }

  // Final
  parts.push(`  Result: ${decision.reason}`)

  return parts.join('\n')
}
