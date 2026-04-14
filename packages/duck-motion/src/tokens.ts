export const duckEasing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(1, 0.23995, 0, 1.65)',
} as const

export const duckDuration = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
} as const

export const duckMotionCssVar = {
  duration: 'var(--gentleduck-motion-dur, 150ms)',
  easing: 'var(--gentleduck-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))',
} as const
