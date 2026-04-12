import { BLUR_CLEAR, getAxis, getSign } from './_utils'
import type { Direction, MotionPreset } from './types'

export function createDirectionalPreset(
  direction: Direction,
  enterOffset = 8,
  exitOffset = 30,
  blur = 8,
): MotionPreset {
  const axis = getAxis(direction)
  const sign = getSign(direction)
  const blurFilter = `blur(${blur}px)`

  return {
    initial: {
      opacity: 0,
      scale: 0.95,
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
      scale: 0.9,
      [axis]: sign * exitOffset,
      filter: blurFilter,
    },
  }
}
