export type { IMotionConfigContextValue, IMotionProviderProps } from './motion-provider'
export { MotionProvider, useMotionConfig } from './motion-provider'
export type { IDuckMotion } from './presets/types'
export type { IReducedMotionFallback } from './react'
export {
  getDuckReducedMotionServerSnapshot,
  motionTransition,
  onDuckReducedMotionChange,
  useDuckReducedMotion,
} from './react'
export { createStagger, getStaggerDelay, staggerChildren } from './stagger'
export { duckDuration, duckEasing, duckMotionCssVar } from './tokens'
export { duckMotionDuration, duckMotionEasing } from './transitions'
export { AnimVariants, checkersStylePattern } from './variants'
