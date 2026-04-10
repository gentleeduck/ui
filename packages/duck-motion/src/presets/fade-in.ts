import type { MotionPreset } from './types'

export const fadeIn: MotionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
}
