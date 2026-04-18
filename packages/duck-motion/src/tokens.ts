/**
 * Backward-compat re-exports. Prefer importing directly from '@gentleduck/motion/transitions'.
 * - duckEasing  → duckMotionEasingCss  (CSS string form)
 * - duckDuration → duckMotionDurationMs (millisecond integers)
 */
export {
  duckMotionCssVar,
  duckMotionDurationMs as duckDuration,
  duckMotionEasingCss as duckEasing,
} from './transitions/tweens'
