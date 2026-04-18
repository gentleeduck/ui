import type { IDuckMotion } from './types'

/** Pop in with scale. Use for badges, chips, notification dots, and count indicators. */
export const popIn: IDuckMotion.IPreset = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
}
