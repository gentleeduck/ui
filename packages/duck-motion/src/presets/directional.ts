import { blurLight, blurMedium } from '../transitions/blur'
import { BLUR_CLEAR, getAxis, getSign } from './_utils'
import type { Direction, IMotionPreset } from './types'

/**
 * Directional enter/exit preset used by menus, popovers, and slide reveals.
 * Default scale (0.95 → 1 → 0.9) matches the menu/popover variant. Pass
 * `initialScale`/`exitScale` of `1` for a pure slide without scale (used by
 * `slideUp`/`slideDown`/`slideFromLeft`/`slideFromRight`).
 */
export function createDirectionalPreset(
  direction: Direction,
  enterOffset = 8,
  exitOffset = 30,
  blur: number = blurMedium,
  initialScale = 0.95,
  exitScale = 0.9,
): IMotionPreset {
  const axis = getAxis(direction)
  const sign = getSign(direction)
  const blurFilter = `blur(${blur}px)`

  return {
    initial: {
      opacity: 0,
      scale: initialScale,
      [axis]: sign * enterOffset,
      filter: blurFilter,
    },
    animate: {
      opacity: 1,
      scale: 1,
      [axis]: 0,
      filter: BLUR_CLEAR,
    },
    exit: {
      opacity: 0,
      scale: exitScale,
      [axis]: sign * exitOffset,
      filter: blurFilter,
    },
  }
}

/** Pure slide preset (no scale). Use for text reveals and slide-* presets. */
export function createSlidePreset(direction: Direction, enterOffset = 8, exitOffset = 30): IMotionPreset {
  return createDirectionalPreset(direction, enterOffset, exitOffset, blurLight, 1, 1)
}
