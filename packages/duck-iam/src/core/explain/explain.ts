import type { AccessRequest, Decision, Effect, Policy, Rule } from '../types'
import { tracePolicy } from './explain.libs'
import type { ExplainResult, ExplainSubjectInfo, PolicyTrace } from './explain.types'

/**
 * Produce a detailed evaluation trace for debugging authorization decisions.
 *
 * Unlike `evaluate()`, this function does NOT short-circuit — every policy and
 * rule is traced so the caller can see the full picture.
 */
export function explainEvaluation(
  policies: Policy[],
  request: AccessRequest,
  defaultEffect: Effect,
  subjectInfo: ExplainSubjectInfo,
): ExplainResult {
  const start = performance.now()

  // Trace ALL policies (no short-circuit -- show everything)
  const policyTraces = policies.map((p) => tracePolicy(p, request, defaultEffect))

  // Determine final decision using same AND-combination as evaluate():
  // walk policies in order, first non-allow result = overall deny
  let finalEffect: Effect = defaultEffect
  let finalReason = 'No policies configured'
  let finalPolicy: string | undefined
  let finalRule: Rule | undefined

  if (policies.length > 0) {
    let lastAllow: PolicyTrace | null = null
    let denyingTrace: PolicyTrace | null = null

    for (const pt of policyTraces) {
      if (pt.result !== 'allow') {
        denyingTrace = pt
        break
      }
      lastAllow = pt
    }

    if (denyingTrace) {
      finalEffect = 'deny'
      finalReason = denyingTrace.reason
      finalPolicy = denyingTrace.policyId
    } else if (lastAllow) {
      finalEffect = 'allow'
      finalReason = lastAllow.reason
      finalPolicy = lastAllow.policyId
    } else {
      finalEffect = defaultEffect
      finalReason = `No matching rules across ${policies.length} policies -> ${defaultEffect}`
    }
  }

  const decision: Decision = {
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

/** Build a human-readable multi-line summary of the evaluation trace. */
function buildSummary(
  decision: Decision,
  policyTraces: PolicyTrace[],
  info: ExplainSubjectInfo,
  req: AccessRequest,
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
