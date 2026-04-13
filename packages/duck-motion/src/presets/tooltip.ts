import { BLUR_CLEAR, BLUR_LIGHT, type DirectionalSide, getAxis, getSign } from './_utils'
import type { IMotionPreset } from './types'

/**
 * Creates a tooltip/hover-card preset with a subtle directional shift.
 * The content shifts toward the trigger on enter and away on exit.
 *
 * @param side - Which side the tooltip appears on relative to the trigger
 * @param offset - Pixel offset for the directional shift (default 4)
 */
export function createTooltipPreset(side: DirectionalSide, offset = 4): IMotionPreset {
  const axis = getAxis(side)
  // Shift toward the trigger: top tooltip shifts down, bottom shifts up, etc.
  const sign = getSign(side)

  return {
    initial: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: BLUR_LIGHT },
    animate: { opacity: 1, scale: 1, [axis]: 0, filter: BLUR_CLEAR },
    exit: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: BLUR_LIGHT },
  }
}
