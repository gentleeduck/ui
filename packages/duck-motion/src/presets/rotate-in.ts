import { BLUR_CLEAR, BLUR_MEDIUM } from './_utils'
import type { IDuckMotion } from './types'

/** Rotate in with scale and blur. Use for modals, drawers, dialogs, and contextual panels. */
export const rotateIn: IDuckMotion.IPreset = {
  initial: { opacity: 0, scale: 0.85, rotate: -12, filter: BLUR_MEDIUM },
  animate: { opacity: 1, scale: 1, rotate: 0, filter: BLUR_CLEAR },
  exit: { opacity: 0, scale: 0.9, rotate: 8, filter: BLUR_MEDIUM },
}
