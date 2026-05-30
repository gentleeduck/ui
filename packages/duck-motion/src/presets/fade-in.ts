import type { IMotionPreset } from './types'

/** Pure opacity fade. The engine assembles the transition; no inline exit transition. */
export const fadeIn: IMotionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
