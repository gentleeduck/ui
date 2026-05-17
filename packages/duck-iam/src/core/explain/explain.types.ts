import type { AccessControl, Primitives } from '../types'
export namespace Explain {
  /**
   * Trace of a single leaf condition: field, operator, expected vs actual, and the result.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ILeafTrace {
    readonly type: 'condition'
    readonly field: string
    readonly operator: AccessControl.Operator
    /** The right-hand side value the condition expected. */
    readonly expected: Primitives.AttributeValue
    /** The left-hand side value resolved from the request. */
    readonly actual: Primitives.AttributeValue
    readonly result: boolean
  }

  /**
   * Trace of a condition group (`all` / `any` / `none`): child traces + the group result.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IGroupTrace {
    readonly type: 'group'
    readonly logic: 'all' | 'any' | 'none'
    readonly result: boolean
    readonly children: ReadonlyArray<ILeafTrace | IGroupTrace>
  }

  /**
   * Union of leaf and group traces - the recursive element type in explain output.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Trace = ILeafTrace | IGroupTrace

  /**
   * Trace of a single rule: action / resource / condition match status, plus the conditions tree.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IRuleTrace {
    readonly ruleId: string
    readonly description?: string
    readonly effect: AccessControl.Effect
    readonly priority: number
    readonly actionMatch: boolean
    readonly resourceMatch: boolean
    readonly conditionsMet: boolean
    readonly conditions: IGroupTrace
    readonly matched: boolean
  }

  /**
   * Trace of a single policy evaluation: targets, rule traces, combiner result.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPolicyTrace {
    readonly policyId: string
    readonly policyName: string
    readonly algorithm: AccessControl.CombiningAlgorithm
    readonly targetMatch: boolean
    readonly rules: readonly IRuleTrace[]
    readonly result: AccessControl.Effect
    readonly reason: string
    readonly decidingRuleId?: string
    readonly decidingRule?: AccessControl.IRule
  }

  /**
   * Complete trace returned by `engine.explain()`.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IResult {
    readonly decision: AccessControl.IDecision
    readonly request: {
      readonly action: string
      readonly resourceType: string
      readonly resourceId?: string
      readonly scope?: string
    }
    readonly subject: {
      readonly id: string
      readonly roles: readonly string[]
      readonly scopedRolesApplied: readonly string[]
      readonly attributes: Readonly<Record<string, Primitives.AttributeValue>>
    }
    readonly policies: readonly IPolicyTrace[]
    readonly summary: string
  }

  /**
   * Subject metadata passed to {@link explainEvaluation} for building the explain trace.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ISubjectInfo {
    subjectId: string
    originalRoles: readonly string[]
    scopedRolesApplied: readonly string[]
  }
}
