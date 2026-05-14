import { BLUR_CLEAR, BLUR_LIGHT, type DirectionalSide, getAxis, getSign } from './_utils'
import type { IMotionPreset } from './types'

/** Tooltip/hover-card preset that shifts toward the trigger on enter and away on exit. */
export function createTooltipPreset(side: DirectionalSide, offset = 4): IMotionPreset {
  const axis = getAxis(side)
  const sign = getSign(side)

  return {
    initial: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: BLUR_LIGHT },
    animate: { opacity: 1, scale: 1, [axis]: 0, filter: BLUR_CLEAR },
    exit: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: BLUR_LIGHT },
  }
}
