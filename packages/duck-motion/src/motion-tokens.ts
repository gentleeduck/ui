/**
 * Re-exports from transitions module for backwards compatibility.
 * Prefer importing directly from @gentleduck/motion/transitions for tree-shaking.
 */
export {
  blurHeavy as duckBlurHeavy,
  blurLight as duckBlurLight,
  blurMedium as duckBlurMedium,
  springDefault as duckSpringDefault,
  springGentle as duckSpringGentle,
  springInstant as duckSpringInstant,
  springSnappy as duckSpringSnappy,
  springStiff as duckSpringStiff,
  tweenExit as duckExitTween,
} from './transitions'

export {
  duckMotionDuration,
  duckMotionEasing,
  tweenFast,
  tweenInstant,
  tweenNormal,
  tweenSlow,
} from './transitions/tweens'

/**
 * Pre-built motion Transition objects combining duration and easing.
 * @deprecated Use individual exports from @gentleduck/motion/transitions instead.
 */
export const duckMotionTransition = {
  instant: { duration: 0 },
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  spring: { duration: 0.2, ease: [1, 0.23995, 0, 1.65] },
} as const
