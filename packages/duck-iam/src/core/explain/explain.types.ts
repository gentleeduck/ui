import type { AttributeValue, CombiningAlgorithm, Decision, Effect, Operator } from '../types'

/**
 * Trace of a single leaf condition evaluation.
 *
 * Shows the field that was tested, the operator, what value was expected,
 * what value was actually found on the request, and whether the condition passed.
 */
export interface ConditionLeafTrace {
  /** Discriminator for condition trace nodes. */
  readonly type: 'condition'
  /** The dot-path field that was evaluated. */
  readonly field: string
  /** The operator that was applied. */
  readonly operator: Operator
  /** The value the condition expected (right-hand side). */
  readonly expected: AttributeValue
  /** The value actually found on the request (left-hand side). */
  readonly actual: AttributeValue
  /** Whether this condition passed. */
  readonly result: boolean
}

/**
 * Trace of a condition group (`all`, `any`, or `none`) evaluation.
 *
 * Contains the child traces and the group's overall result.
 */
export interface ConditionGroupTrace {
  /** Discriminator for condition trace nodes. */
  readonly type: 'group'
  /** The boolean logic used to combine children. */
  readonly logic: 'all' | 'any' | 'none'
  /** Whether this group as a whole passed. */
  readonly result: boolean
  /** Traces of each child condition or nested group. */
  readonly children: ReadonlyArray<ConditionLeafTrace | ConditionGroupTrace>
}

/**
 * A union of leaf and group condition traces.
 * Used as the recursive element type in explain output.
 */
export type ConditionTrace = ConditionLeafTrace | ConditionGroupTrace

/**
 * Trace of a single rule evaluation within a policy.
 *
 * Shows whether the rule's action and resource matchers fired, whether
 * its conditions were met, and whether it ultimately matched.
 */
export interface RuleTrace {
  /** The rule's unique ID. */
  readonly ruleId: string
  /** The rule's description, if set. */
  readonly description?: string
  /** The rule's effect (`'allow'` or `'deny'`). */
  readonly effect: Effect
  /** The rule's priority value. */
  readonly priority: number
  /** Whether the request's action matched the rule's action list. */
  readonly actionMatch: boolean
  /** Whether the request's resource matched the rule's resource list. */
  readonly resourceMatch: boolean
  /** Whether all conditions in the rule's condition tree were met. */
  readonly conditionsMet: boolean
  /** Full trace of the rule's condition tree evaluation. */
  readonly conditions: ConditionGroupTrace
  /** Whether this rule matched overall (action + resource + conditions all true). */
  readonly matched: boolean
}

/**
 * Trace of a single policy evaluation.
 *
 * Shows whether the policy's targets matched, traces for each rule,
 * and the final result produced by the policy's combining algorithm.
 */
export interface PolicyTrace {
  /** The policy's unique ID. */
  readonly policyId: string
  /** The policy's display name. */
  readonly policyName: string
  /** The combining algorithm used to resolve rule conflicts. */
  readonly algorithm: CombiningAlgorithm
  /** Whether the request matched the policy's target constraints. */
  readonly targetMatch: boolean
  /** Traces for every rule in the policy (not just matching ones). */
  readonly rules: readonly RuleTrace[]
  /** The final effect produced by this policy. */
  readonly result: Effect
  /** Human-readable explanation of why this result was produced. */
  readonly reason: string
  /** The ID of the rule that decided the outcome (if any). */
  readonly decidingRuleId?: string
}

/**
 * Complete evaluation trace returned by `engine.explain()`.
 *
 * Provides a full picture of how an authorization decision was reached:
 * the final decision, the request that was evaluated, the subject's roles
 * and attributes, traces for every policy, and a human-readable summary.
 */
export interface ExplainResult {
  /** The final authorization decision. */
  readonly decision: Decision
  /** Summary of the request that was evaluated. */
  readonly request: {
    /** The action that was checked. */
    readonly action: string
    /** The resource type that was checked. */
    readonly resourceType: string
    /** The specific resource ID, if provided. */
    readonly resourceId?: string
    /** The scope, if provided. */
    readonly scope?: string
  }
  /** Information about the subject whose access was evaluated. */
  readonly subject: {
    /** The subject's ID. */
    readonly id: string
    /** The subject's effective roles (after inheritance resolution). */
    readonly roles: readonly string[]
    /** Additional roles applied from scoped assignments for this request. */
    readonly scopedRolesApplied: readonly string[]
    /** The subject's attributes at evaluation time. */
    readonly attributes: Readonly<Record<string, AttributeValue>>
  }
  /** Traces for every policy that was evaluated (including non-matching ones). */
  readonly policies: readonly PolicyTrace[]
  /** Human-readable summary of the evaluation (multi-line). */
  readonly summary: string
}

/**
 * Subject metadata passed to {@link explainEvaluation} for building the explain trace.
 *
 * Separates original roles from scoped roles so the trace can show
 * which roles were applied due to scope matching.
 */
export interface ExplainSubjectInfo {
  /** The subject's unique ID. */
  subjectId: string
  /** The subject's base roles (before scope enrichment). */
  originalRoles: readonly string[]
  /** Additional roles applied from scoped assignments for this request. */
  scopedRolesApplied: readonly string[]
}
