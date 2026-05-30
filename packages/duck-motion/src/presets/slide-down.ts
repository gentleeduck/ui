import { createSlidePreset } from './directional'
import type { IMotionPreset } from './types'

/** Slide down with light blur. Use for text reveals, labels, and list items anchored to the bottom. */
export const slideDown: IMotionPreset = createSlidePreset('bottom')
