import { duckMotionDuration, duckMotionEasing, TAP_SCALE_TRANSITION } from '../transitions/tweens'
import { BLUR_CLEAR, BLUR_LIGHT } from './_utils'

/** Spin in/out with scale, rotate, and blur. Use for icon swaps, loading spinners, status indicators. */
export const spinIn = {
  initial: { opacity: 0, scale: 0, filter: BLUR_LIGHT, rotate: -90 },
  animate: { opacity: 1, scale: 1, filter: BLUR_CLEAR, rotate: 0 },
  exit: { opacity: 0, scale: 0, filter: BLUR_LIGHT, rotate: 90 },
}

/** Tap press feedback (`whileTap={tapScale}`). 15ms ease-out for instant click response. */
export const tapScale = {
  scale: 0.97,
  transition: TAP_SCALE_TRANSITION,
} as const

/** Bounce keyframes for toggle controls. Use for checkboxes, radio buttons, switches. */
export const checkerBounce = { scale: [1, 0.88, 1.08, 1], rotate: [0, -3, 2, 0] }

/** Content transition. 250ms expo-out for smooth reveals. */
export const contentTransition = { duration: 0.25, ease: duckMotionEasing.expo } as const

/** Fast content transition. 150ms expo-out for button content swaps. */
export const contentTransitionFast = { duration: duckMotionDuration.fast, ease: duckMotionEasing.expo } as const
