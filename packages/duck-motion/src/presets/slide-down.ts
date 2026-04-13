import type { IMotionPreset } from './types'

export const slideDown: IMotionPreset = {
  initial: { opacity: 0, y: -8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -30, filter: 'blur(4px)' },
}
