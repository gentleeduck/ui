import type { MotionPreset } from './types'

export const slideDown: MotionPreset = {
  initial: { opacity: 0, y: -8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -30, filter: 'blur(4px)' },
}
