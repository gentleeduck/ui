import * as React from 'react'
import { createDirectionalPreset } from './presets/directional'
import { fadeIn } from './presets/fade-in'
import { popIn } from './presets/pop-in'
import { rotateIn } from './presets/rotate-in'
import { scaleIn } from './presets/scale-in'
import { slideDown } from './presets/slide-down'
import { slideFromLeft } from './presets/slide-from-left'
import { slideFromRight } from './presets/slide-from-right'
import { slideUp } from './presets/slide-up'
import type {
  Direction,
  IDuckMotion,
  IMotionPreset,
  IMotionPresetResult,
  MotionAnimationState,
  MotionPresetName,
  MotionTransitionConfig,
} from './presets/types'
import { useDuckReducedMotion } from './react'
import { springDefault } from './transitions/springs'
import { TAP_SCALE_TRANSITION } from './transitions/tweens'

export type {
  Direction,
  IDuckMotion,
  IMotionPreset,
  IMotionPresetResult,
  MotionAnimationState,
  MotionPresetName,
  MotionTransitionConfig,
}

const presetMap: Record<MotionPresetName, IMotionPreset> = {
  fadeIn,
  scaleIn,
  slideUp,
  slideDown,
  slideFromLeft,
  slideFromRight,
  rotateIn,
  popIn,
}

export interface IUseMotionPresetOptions extends IDuckMotion.IPresetOptions {}

function buildResult(preset: IMotionPreset, reduced: boolean, options?: IUseMotionPresetOptions): IMotionPresetResult {
  const baseTransition: MotionTransitionConfig = options?.transition ?? springDefault
  const enterTransition: MotionTransitionConfig = reduced
    ? { duration: 0 }
    : { ...(options?.enterTransition ?? baseTransition), ...(options?.delay ? { delay: options.delay } : {}) }
  const exitTransition: MotionTransitionConfig = reduced ? { duration: 0 } : (options?.exitTransition ?? baseTransition)

  // Scale-only override keeps tap press snappy regardless of base spring.
  const enterWithTapScale = reduced ? enterTransition : { ...enterTransition, scale: TAP_SCALE_TRANSITION }

  return {
    initial: { ...preset.initial },
    animate: { ...preset.animate, transition: enterWithTapScale },
    exit: { ...preset.exit, transition: exitTransition },
    transition: enterWithTapScale,
  }
}

/** Accepts preset name or object; object form is tree-shakeable. */
export function useMotionPreset(
  nameOrPreset: MotionPresetName | IMotionPreset,
  options?: IUseMotionPresetOptions,
): IMotionPresetResult {
  const reduced = useDuckReducedMotion()
  const preset = options?.direction
    ? createDirectionalPreset(options.direction)
    : typeof nameOrPreset === 'string'
      ? presetMap[nameOrPreset]
      : nameOrPreset
  return React.useMemo(
    () => buildResult(preset, reduced, options),
    [
      reduced,
      preset,
      options?.delay,
      options?.transition,
      options?.enterTransition,
      options?.exitTransition,
      options?.direction,
    ],
  )
}
