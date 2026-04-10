export interface MotionAnimationState {
  [key: string]: unknown
  opacity?: number
  scale?: number
  x?: number
  y?: number
  filter?: string
  transition?: MotionTransitionConfig
}

export interface MotionTransitionConfig {
  [key: string]: unknown
  type?: 'spring' | 'tween'
  duration?: number
  delay?: number
  ease?: readonly number[] | number[]
  bounce?: number
  stiffness?: number
  damping?: number
  mass?: number
  visualDuration?: number
}

export interface MotionPreset {
  initial: MotionAnimationState
  animate: MotionAnimationState
  exit: MotionAnimationState
}

export interface MotionPresetResult {
  initial: MotionAnimationState
  animate: MotionAnimationState
  exit: MotionAnimationState
  transition: MotionTransitionConfig
}

export type Direction = 'top' | 'bottom' | 'left' | 'right'

export type MotionPresetName =
  | 'fadeIn'
  | 'fadeOut'
  | 'scaleIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideFromLeft'
  | 'slideFromRight'
