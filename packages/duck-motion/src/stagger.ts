import type { IDuckMotion } from './presets/types'

/**
 * Returns the stagger delay (in seconds) for a single item at `index`.
 * Avoids allocating a full array when only one item's delay is needed.
 */
export function getStaggerDelay(index: number, staggerMs: number, delayMs = 0): number {
  return (delayMs + index * staggerMs) / 1000
}

/**
 * Creates an array of `{ delay }` objects (delay in seconds) for staggered
 * enter animations. Use `getStaggerDelay` when only one item's value is needed.
 */
export function createStagger(count: number, staggerMs: number, delayMs = 0): { delay: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    delay: getStaggerDelay(i, staggerMs, delayMs),
  }))
}

/**
 * Returns a transition config for Framer Motion's `staggerChildren` / `delayChildren`.
 * Spread into a parent variant's `transition` field.
 */
export function staggerChildren(staggerMs: number, delayMs = 0): IDuckMotion.ITransitionConfig {
  return {
    staggerChildren: staggerMs / 1000,
    delayChildren: delayMs / 1000,
  }
}
