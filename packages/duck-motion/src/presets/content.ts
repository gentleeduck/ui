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

/** Content transition. 250ms expo-out for smooth reveals. */
export const contentTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const
