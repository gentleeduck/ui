import type { MotionPreset } from './types'

export const slideFromRight: MotionPreset = {
  initial: { opacity: 0, x: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: 30, filter: 'blur(4px)' },
}
