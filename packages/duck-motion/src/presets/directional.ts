import type { Direction, MotionPreset } from './types'

export function createDirectionalPreset(
  direction: Direction,
  enterOffset = 8,
  exitOffset = 30,
  blur = 8,
): MotionPreset {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const sign = direction === 'top' || direction === 'left' ? 1 : -1

  return {
    initial: {
      opacity: 0,
      scale: 0.95,
      [axis]: sign * enterOffset,
      filter: `blur(${blur}px)`,
    },
    animate: {
      opacity: 1,
      scale: 1,
      [axis]: 0,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      [axis]: sign * exitOffset,
      filter: `blur(${blur}px)`,
    },
  }
}
