import type { MotionPreset } from './types'

type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Creates a slide preset for edge-anchored panels (sheets, drawers).
 * The panel slides in from 100% off-screen on the given side.
 *
 * @param side - Which edge the panel is anchored to
 */
export function createSlideEdge(side: Side): MotionPreset {
  const axis = side === 'left' || side === 'right' ? 'x' : 'y'
  const offset = side === 'right' || side === 'bottom' ? '100%' : '-100%'

  return {
    initial: { [axis]: offset },
    animate: { [axis]: 0 },
    exit: { [axis]: offset },
  }
}
