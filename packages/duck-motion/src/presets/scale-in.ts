import { BLUR_CLEAR, BLUR_MEDIUM } from './_utils'
import type { IMotionPreset } from './types'

/** Scale in with medium blur and asymmetric exit (0.9 vs 0.95). Use for overlays and content reveals. */
export const scaleIn: IMotionPreset = {
  initial: { opacity: 0, scale: 0.95, filter: BLUR_MEDIUM },
  animate: { opacity: 1, scale: 1, filter: BLUR_CLEAR },
  exit: { opacity: 0, scale: 0.9, filter: BLUR_MEDIUM },
}
