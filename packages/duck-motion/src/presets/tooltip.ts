import { blurLight } from '../transitions/blur'
import type { MotionPreset } from './types'

type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Creates a tooltip/hover-card preset with a subtle directional shift.
 * The content shifts toward the trigger on enter and away on exit.
 *
 * @param side - Which side the tooltip appears on relative to the trigger
 * @param offset - Pixel offset for the directional shift (default 4)
 */
export function createTooltipPreset(side: Side, offset = 4): MotionPreset {
  const axis = side === 'left' || side === 'right' ? 'x' : 'y'
  // Shift toward the trigger: top tooltip shifts down, bottom shifts up, etc.
  const sign = side === 'top' || side === 'left' ? 1 : -1

  return {
    initial: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: `blur(${blurLight}px)` },
    animate: { opacity: 1, scale: 1, [axis]: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.96, [axis]: sign * offset, filter: `blur(${blurLight}px)` },
  }
}
