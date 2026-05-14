import type { IDuckMotion } from './presets/types'

/** Stagger delay (seconds) for item at `index`. */
export function getStaggerDelay(index: number, staggerMs: number, delayMs = 0): number {
  return (delayMs + index * staggerMs) / 1000
}

/** Array of `{ delay }` objects (seconds) for staggered enter animations. */
export function createStagger(count: number, staggerMs: number, delayMs = 0): { delay: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    delay: getStaggerDelay(i, staggerMs, delayMs),
  }))
}

/** Transition config for framer-motion `staggerChildren`/`delayChildren`. Spread into a parent variant's `transition`. */
export function staggerChildren(staggerMs: number, delayMs = 0): IDuckMotion.ITransitionConfig {
  return {
    staggerChildren: staggerMs / 1000,
    delayChildren: delayMs / 1000,
  }
}
