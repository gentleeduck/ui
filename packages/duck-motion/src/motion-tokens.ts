import { duckDuration } from './tokens'

/**
 * Duck duration values converted to seconds for the motion library.
 * Maps directly from `duckDuration` (ms) to seconds.
 */
export const duckMotionDuration = {
  instant: 0,
  fast: duckDuration.fast / 1000,
  normal: duckDuration.normal / 1000,
  slow: duckDuration.slow / 1000,
} as const

/**
 * Duck easing values as cubic-bezier arrays for the motion library.
 * Parsed from the CSS `cubic-bezier()` strings in `duckEasing`.
 */
export const duckMotionEasing = {
  standard: [0.4, 0, 0.2, 1] as const,
  spring: [1, 0.23995, 0, 1.65] as const,
} as const

/**
 * Pre-built motion `Transition` objects combining duration and easing.
 * Ready to spread onto motion components: `<m.div transition={duckMotionTransition.fast} />`
 */
export const duckMotionTransition = {
  instant: { duration: duckMotionDuration.instant },
  fast: { duration: duckMotionDuration.fast, ease: [...duckMotionEasing.standard] },
  normal: { duration: duckMotionDuration.normal, ease: [...duckMotionEasing.standard] },
  slow: { duration: duckMotionDuration.slow, ease: [...duckMotionEasing.standard] },
  spring: { duration: duckMotionDuration.normal, ease: [...duckMotionEasing.spring] },
} as const
