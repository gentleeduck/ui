import type { Effect, Rule } from '../types'

/**
 * Signature for a combining algorithm implementation.
 *
 * A combiner takes an array of matched rules (each paired with its effect)
 * and a default effect, then returns the final decision including the
 * winning rule (if any), the resulting effect, and a human-readable reason.
 */
export type Combiner = (
  matched: Array<{ rule: Rule; effect: Effect }>,
  defaultEffect: Effect,
) => { rule?: Rule; effect: Effect; reason: string }
