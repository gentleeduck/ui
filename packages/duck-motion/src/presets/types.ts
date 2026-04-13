import type { TargetAndTransition, Transition } from 'motion/react'

export type MotionAnimationState = TargetAndTransition

export type MotionTransitionConfig = Transition

export interface IMotionPreset {
  initial: MotionAnimationState
  animate: MotionAnimationState
  exit: MotionAnimationState
}

export interface IMotionPresetResult {
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
