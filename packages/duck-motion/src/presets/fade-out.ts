import type { MotionPreset } from './types'

export const fadeOut: MotionPreset = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  exit: { opacity: 1 },
}
