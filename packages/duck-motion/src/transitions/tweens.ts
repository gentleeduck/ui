import type { MotionTransitionConfig } from '../presets/types'
import { duckDuration } from '../tokens'

/** Duck duration values converted to seconds. */
export const duckMotionDuration = {
  instant: 0,
  fast: duckDuration.fast / 1000,
  normal: duckDuration.normal / 1000,
  slow: duckDuration.slow / 1000,
} as const

/** Duck easing values as cubic-bezier arrays. */
export const duckMotionEasing = {
  standard: [0.4, 0, 0.2, 1] as const,
  spring: [1, 0.23995, 0, 1.65] as const,
} as const

const standardEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

/** Instant transition with zero duration. Use for state changes that should appear immediately. */
export const tweenInstant: MotionTransitionConfig = { duration: 0 }

/** Fast 150ms tween with standard easing. Use for hover states, toggles, and tooltips. */
export const tweenFast: MotionTransitionConfig = { duration: duckMotionDuration.fast, ease: standardEase }

/** Normal 200ms tween with standard easing. Use for overlays and content reveals. */
export const tweenNormal: MotionTransitionConfig = { duration: duckMotionDuration.normal, ease: standardEase }

/** Slow 300ms tween with standard easing. Use for large layout changes and page transitions. */
export const tweenSlow: MotionTransitionConfig = { duration: duckMotionDuration.slow, ease: standardEase }

/** Fast aggressive tween for exit animations. Use for closing menus and dialogs where the exit should feel snappier. */
export const tweenExit: MotionTransitionConfig = { duration: 0.2, ease: [0.4, 0, 1, 1] }
