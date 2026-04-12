import { TAP_SCALE_TRANSITION } from '../transitions/tweens'
import { BLUR_CLEAR, BLUR_LIGHT, BLUR_MEDIUM } from './_utils'

/** Spin in/out with scale, rotate, and blur. Use for icon swaps, loading spinners, status indicators. */
export const spinIn = {
  initial: { opacity: 0, scale: 0, filter: BLUR_LIGHT, rotate: -90 },
  animate: { opacity: 1, scale: 1, filter: BLUR_CLEAR, rotate: 0 },
  exit: { opacity: 0, scale: 0, filter: BLUR_LIGHT, rotate: 90 },
}

/** Slide up with blur fade. Use for text reveals, labels, descriptions. */
export const slideUpBlur = {
  initial: { opacity: 0, y: 8, filter: BLUR_LIGHT },
  animate: { opacity: 1, y: 0, filter: BLUR_CLEAR },
  exit: { opacity: 0, y: -8, filter: BLUR_LIGHT },
}

/** Fade up with blur. Subtler than slideUpBlur. Use for content mount, tags, chips, toggle children. */
export const fadeUp = {
  initial: { opacity: 0, y: 6, filter: BLUR_LIGHT },
  animate: { opacity: 1, y: 0, filter: BLUR_CLEAR },
  exit: { opacity: 0, y: -6, filter: BLUR_LIGHT },
}

/** Scale in with medium blur. Use for images, media, aspect-ratio containers. */
export const scaleBlur = {
  initial: { opacity: 0, scale: 0.95, filter: BLUR_MEDIUM },
  animate: { opacity: 1, scale: 1, filter: BLUR_CLEAR },
}

/** Pure opacity + blur fade. No position shift. Use for buttons, containers, overlays. */
export const fadeBlur = {
  initial: { opacity: 0, filter: BLUR_LIGHT },
  animate: { opacity: 1, filter: BLUR_CLEAR },
  exit: { opacity: 0, filter: BLUR_LIGHT },
}

/** Width collapse with fade + blur. Use for text/icon collapse inside buttons. */
export const collapseX = {
  initial: { opacity: 0, filter: BLUR_LIGHT },
  animate: { opacity: 1, filter: BLUR_CLEAR },
  exit: { opacity: 0, filter: BLUR_LIGHT, width: 0 },
}

/** Fade+blur enter, scale-to-zero exit. Use for collapsible button children with popLayout. */
export const fadeBlurPopOut = {
  initial: { opacity: 0, filter: BLUR_LIGHT },
  animate: { opacity: 1, filter: BLUR_CLEAR },
  exit: { opacity: 0, scale: 0 },
}

/** Blur-only mount. No opacity change. Use when CSS handles opacity (e.g. disabled states). */
export const blurMount = {
  initial: { filter: BLUR_LIGHT },
  animate: { filter: BLUR_CLEAR },
}

/**
 * Tap press feedback with a built-in 15ms ease-out transition.
 * Use as `whileTap={tapScale}` on buttons, toggles, and interactive elements.
 * The 15ms scoped tween keeps the scale animation fast and deterministic so
 * the full press-release cycle fits inside a single click (~30ms) and rapid
 * click-spam feels crisp without interpolating mid-spring.
 */
export const tapScale = {
  scale: 0.97,
  transition: TAP_SCALE_TRANSITION,
} as const

/** Bounce keyframes for toggle controls. Use for checkboxes, radio buttons, switches. */
export const checkerBounce = { scale: [1, 0.88, 1.08, 1], rotate: [0, -3, 2, 0] }

/** Content transition. 250ms expo-out for smooth reveals. */
export const contentTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const

/** Fast content transition. 150ms expo-out for button content swaps. */
export const contentTransitionFast = { duration: 0.15, ease: [0.16, 1, 0.3, 1] } as const
