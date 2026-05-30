import type { MotionTransitionConfig } from '../presets/types'

/** Duck duration values in milliseconds (integers). Single source of truth for timing tokens. */
export const duckMotionDurationMs = {
  instant: 0,
  fast: 150,
  normal: 200,
  /** Default fallback used by `getTransitionDurationMs` when a transition has no measurable duration. */
  exit: 180,
  slow: 300,
} as const

/** Duck duration values in seconds (for motion libraries). Derived from duckMotionDurationMs. */
export const duckMotionDuration = {
  instant: 0,
  fast: duckMotionDurationMs.fast / 1000,
  normal: duckMotionDurationMs.normal / 1000,
  slow: duckMotionDurationMs.slow / 1000,
} as const

/** Duck easing values as cubic-bezier arrays (for motion libraries). */
export const duckMotionEasing = {
  /** Material standard ease. Symmetric in/out for general-purpose tweens. */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Ease-in cubic. Use for exit animations that should accelerate as they leave. */
  exit: [0.4, 0, 1, 1] as const,
  /** Expo-out. Use for expand/collapse and content reveals — fast start, slow settle. */
  expo: [0.16, 1, 0.3, 1] as const,
  /** Ease-out. Use for micro-interactions and tooltips. */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Overshoot curve mimicking a critically-damped spring. */
  spring: [1, 0.23995, 0, 1.65] as const,
} as const

/** Duck easing values as CSS cubic-bezier strings (for CSS transitions). */
export const duckMotionEasingCss = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  spring: 'cubic-bezier(1, 0.23995, 0, 1.65)',
} as const

/** CSS custom properties for motion, with fallbacks matching the token defaults. */
export const duckMotionCssVar = {
  duration: `var(--gentleduck-motion-dur, ${duckMotionDurationMs.fast}ms)`,
  easing: `var(--gentleduck-motion-ease, ${duckMotionEasingCss.standard})`,
} as const

/**
 * Ultra-fast tween for tap press/release feedback (15ms ease-out). Used by `whileTap` handlers.
 * Intentionally below the `duckMotionDuration*` scale (smallest is `fast = 150ms`) — tap feedback
 * needs to feel like a direct hardware response, not an animated transition. Not tokenized.
 */
export const TAP_SCALE_TRANSITION = { type: 'tween' as const, duration: 0.015, ease: 'easeOut' as const }

/** Normal 200ms tween with standard easing. Use for overlays and content reveals. */
export const tweenNormal: MotionTransitionConfig = {
  duration: duckMotionDuration.normal,
  ease: duckMotionEasing.standard,
}

/** Slow 300ms tween with standard easing. Use for large layout changes and page transitions. */
export const tweenSlow: MotionTransitionConfig = {
  duration: duckMotionDuration.slow,
  ease: duckMotionEasing.standard,
}

/** Fast aggressive tween for exit animations. Use for closing menus and dialogs where the exit should feel snappier. */
export const tweenExit: MotionTransitionConfig = {
  duration: duckMotionDuration.normal,
  ease: duckMotionEasing.exit,
}

/** Expo-out tween for expand/collapse animations. Use for accordion, collapsible, and height reveals. */
export const tweenExpand: MotionTransitionConfig = { duration: 0.25, ease: duckMotionEasing.expo }

/** Tween for error shake feedback. Use for disabled buttons, invalid inputs. */
export const tweenShake: MotionTransitionConfig = { duration: 0.4 }

/** Horizontal shake keyframes for error feedback. */
export const shakeKeyframes = [0, -4, 4, -3, 3, -1, 1, 0]
