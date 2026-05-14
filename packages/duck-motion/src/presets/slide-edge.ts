import { BLUR_CLEAR, BLUR_LIGHT, type DirectionalSide, getAxis } from './_utils'
import type { IMotionPreset } from './types'

/** Slide preset for edge-anchored panels (sheets/drawers). Slides in from 100% off-screen on `side`. */
export function createSlideEdge(side: DirectionalSide): IMotionPreset {
  const axis = getAxis(side)
  const offset = side === 'right' || side === 'bottom' ? '100%' : '-100%'

  return {
    initial: { [axis]: offset, opacity: 0, filter: BLUR_LIGHT },
    animate: { [axis]: 0, opacity: 1, filter: BLUR_CLEAR },
    exit: { [axis]: offset, opacity: 0, filter: BLUR_LIGHT },
  }
}
