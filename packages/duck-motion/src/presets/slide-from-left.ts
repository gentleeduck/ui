import { createSlidePreset } from './directional'
import type { IMotionPreset } from './types'

/** Slide from the left with light blur. Use for sidebar reveals and breadcrumb chevrons. */
export const slideFromLeft: IMotionPreset = createSlidePreset('left')
