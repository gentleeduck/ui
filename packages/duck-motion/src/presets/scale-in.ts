import type { IMotionPreset } from './types'

export const scaleIn: IMotionPreset = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.9, filter: 'blur(8px)', transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
}
