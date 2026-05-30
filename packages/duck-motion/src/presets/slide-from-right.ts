import { createSlidePreset } from './directional'
import type { IMotionPreset } from './types'

/** Slide from the right with light blur. Use for sidebar reveals and trailing actions. */
export const slideFromRight: IMotionPreset = createSlidePreset('right')
