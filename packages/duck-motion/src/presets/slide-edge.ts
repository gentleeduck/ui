import { BLUR_CLEAR, BLUR_LIGHT, type DirectionalSide, getAxis } from './_utils'
import type { MotionPreset } from './types'

/**
 * Creates a slide preset for edge-anchored panels (sheets, drawers).
 * The panel slides in from 100% off-screen on the given side
 * with a blur and opacity fade.
 *
 * @param side - Which edge the panel is anchored to
 */
export function createSlideEdge(side: DirectionalSide): MotionPreset {
  const axis = getAxis(side)
  const offset = side === 'right' || side === 'bottom' ? '100%' : '-100%'

  return {
    initial: { [axis]: offset, opacity: 0, filter: BLUR_LIGHT },
    animate: { [axis]: 0, opacity: 1, filter: BLUR_CLEAR },
    exit: { [axis]: offset, opacity: 0, filter: BLUR_LIGHT },
  }
}
