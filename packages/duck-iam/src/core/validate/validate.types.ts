export namespace Validate {
  /**
   * Closed set of machine-readable codes the validator can emit. Switch on this
   * to drive UI / telemetry; the compiler enforces exhaustiveness.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type ValidationCode =
    | 'BROAD_ALLOW'
    | 'CIRCULAR_INHERIT'
    | 'DANGLING_INHERIT'
    | 'DUPLICATE_ROLE_ID'
    | 'DUPLICATE_RULE_ID'
    | 'EMPTY_ROLE'
    | 'INHERITANCE_TOO_DEEP'
    | 'INVALID_ALGORITHM'
    | 'INVALID_CONDITION'
    | 'INVALID_EFFECT'
    | 'INVALID_OPERATOR'
    | 'INVALID_RULE'
    | 'INVALID_TYPE'
    | 'LIMIT_EXCEEDED'
    | 'MISSING_FIELD'
    | 'UNRESOLVABLE_FIELD'
    | 'UNRESOLVABLE_VALUE'

  /**
   * A single issue produced by validation.
   *
   * Errors flip {@link IResult.valid} to `false`; warnings do not.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IIssue {
    /** `'error'` blocks usage, `'warning'` is informational. */
    readonly type: 'error' | 'warning'
    /** Machine-readable code - see {@link ValidationCode}. */
    readonly code: ValidationCode
    /** Human-readable description. */
    readonly message: string
    /** Role ID involved, when emitted by role validation. */
    readonly roleId?: string
    /** Dot-path into the offending field, when emitted by policy validation. */
    readonly path?: string
  }

  /**
   * The result of a validation operation.
   *
   * `valid` is `true` when there are no error-level issues.
   * Warning-level issues do not affect `valid`.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IResult {
    /** Whether the validated input is free of errors. */
    readonly valid: boolean
    /** All issues found during validation (both errors and warnings). */
    readonly issues: readonly IIssue[]
  }
}
