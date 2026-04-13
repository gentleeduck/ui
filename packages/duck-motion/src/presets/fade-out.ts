import type { IMotionPreset } from './types'

export const fadeOut: IMotionPreset = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  exit: { opacity: 1 },
}
