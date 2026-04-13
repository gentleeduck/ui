import type { IMotionPreset } from './types'

export const fadeIn: IMotionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
}
