import { blurLight } from '../transitions/blur'
import type { MotionPreset } from './types'

type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Creates a slide preset for edge-anchored panels (sheets, drawers).
 * The panel slides in from 100% off-screen on the given side
 * with a blur and opacity fade.
 *
 * @param side - Which edge the panel is anchored to
 */
export function createSlideEdge(side: Side): MotionPreset {
  const axis = side === 'left' || side === 'right' ? 'x' : 'y'
  const offset = side === 'right' || side === 'bottom' ? '100%' : '-100%'

  return {
    initial: { [axis]: offset, opacity: 0, filter: `blur(${blurLight}px)` },
    animate: { [axis]: 0, opacity: 1, filter: 'blur(0px)' },
    exit: { [axis]: offset, opacity: 0, filter: `blur(${blurLight}px)` },
  }
}
