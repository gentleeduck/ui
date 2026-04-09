import { blurLight } from '../transitions/blur'

const blur = `blur(${blurLight}px)`

/** Spin in/out with scale, rotate, and blur. Use for icon swaps, loading spinners, status indicators. */
export const spinIn = {
  initial: { opacity: 0, scale: 0, filter: blur, rotate: -90 },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', rotate: 0 },
  exit: { opacity: 0, scale: 0, filter: blur, rotate: 90 },
}

/** Slide up with blur fade. Use for text reveals, labels, descriptions. */
export const slideUpBlur = {
  initial: { opacity: 0, y: 8, filter: blur },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: blur },
}

/** Fade up with blur. Subtler than slideUpBlur. Use for content mount, tags, chips, toggle children. */
export const fadeUp = {
  initial: { opacity: 0, y: 6, filter: blur },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -6, filter: blur },
}

/** Scale in with medium blur. Use for images, media, aspect-ratio containers. */
export const scaleBlur = {
  initial: { opacity: 0, scale: 0.95, filter: `blur(8px)` },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
}

/** Pure opacity + blur fade. No position shift. Use for buttons, containers, overlays. */
export const fadeBlur = {
  initial: { opacity: 0, filter: blur },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: blur },
}

/** Width collapse with fade + blur. Use for text/icon collapse inside buttons. */
export const collapseX = {
  initial: { opacity: 0, filter: blur },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: blur, width: 0 },
}

/** Fade+blur enter, scale-to-zero exit. Use for collapsible button children with popLayout. */
export const fadeBlurPopOut = {
  initial: { opacity: 0, filter: blur },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0 },
}

/** Blur-only mount. No opacity change. Use when CSS handles opacity (e.g. disabled states). */
export const blurMount = {
  initial: { filter: blur },
  animate: { filter: 'blur(0px)' },
}

/** Tap press feedback. Use for buttons, toggles, interactive elements. */
export const tapScale = { scale: 0.97 }

/** Bounce keyframes for toggle controls. Use for checkboxes, radio buttons, switches. */
export const checkerBounce = { scale: [1, 0.88, 1.08, 1], rotate: [0, -3, 2, 0] }

/** Content transition. 250ms expo-out for smooth reveals. */
export const contentTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const

/** Fast content transition. 150ms expo-out for button content swaps. */
export const contentTransitionFast = { duration: 0.15, ease: [0.16, 1, 0.3, 1] } as const
