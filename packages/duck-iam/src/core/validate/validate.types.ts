/**
 * A single issue found during validation.
 *
 * Errors cause `ValidationResult.valid` to be `false`. Warnings are
 * informational and do not affect the `valid` flag.
 */
export interface ValidationIssue {
  /** Severity: `'error'` blocks usage, `'warning'` is informational. */
  readonly type: 'error' | 'warning'
  /** Machine-readable issue code (e.g. `'DUPLICATE_ROLE_ID'`, `'DANGLING_INHERIT'`). */
  readonly code: string
  /** Human-readable description of the issue. */
  readonly message: string
  /** The role ID involved (for role validation issues). */
  readonly roleId?: string
  /** Dot-path to the offending field (for policy validation issues). */
  readonly path?: string
}

/**
 * The result of a validation operation.
 *
 * `valid` is `true` when there are no error-level issues.
 * Warning-level issues do not affect `valid`.
 */
export interface ValidationResult {
  /** Whether the validated input is free of errors. */
  readonly valid: boolean
  /** All issues found during validation (both errors and warnings). */
  readonly issues: readonly ValidationIssue[]
}
