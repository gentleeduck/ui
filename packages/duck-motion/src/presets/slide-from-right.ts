import type { IMotionPreset } from './types'

export const slideFromRight: IMotionPreset = {
  initial: { opacity: 0, x: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: 30, filter: 'blur(4px)' },
}
