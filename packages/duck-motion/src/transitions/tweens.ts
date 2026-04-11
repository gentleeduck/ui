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

/** Standard cubic-bezier ease for tween transitions. Shared across fast/normal/slow tweens. */
export const standardEase = [0.4, 0, 0.2, 1] as const

/** Ultra-fast tween for tap press/release feedback (15ms ease-out). Used by `whileTap` handlers. */
export const TAP_SCALE_TRANSITION = { type: 'tween' as const, duration: 0.015, ease: 'easeOut' as const }

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

/** Expo-out tween for expand/collapse animations. Use for accordion, collapsible, and height reveals. */
export const tweenExpand: MotionTransitionConfig = { duration: 0.25, ease: [0.16, 1, 0.3, 1] }

/** Ultra-fast tween for tooltips and micro-interactions. 100ms ease-out. */
export const tweenMicro: MotionTransitionConfig = { duration: 0.1, ease: [0, 0, 0.2, 1] }

/** Tween for error shake feedback. Use for disabled buttons, invalid inputs. */
export const tweenShake: MotionTransitionConfig = { duration: 0.4 }

/** Horizontal shake keyframes for error feedback. */
export const shakeKeyframes = [0, -4, 4, -3, 3, -1, 1, 0]
