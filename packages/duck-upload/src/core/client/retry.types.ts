/**
 * Output of the retry policy.
 *
 * `delayMs` should be a backoff delay before re-attempting the failed step.
 */
export type RetryDecision = { retryable: false } | { retryable: true; delayMs: number }
