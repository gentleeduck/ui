import { createSlidePreset } from './directional'
import type { IMotionPreset } from './types'

/** Slide up with light blur. Use for text reveals, labels, and list items anchored to the top. */
export const slideUp: IMotionPreset = createSlidePreset('top')
