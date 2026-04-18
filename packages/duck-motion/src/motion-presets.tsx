import * as React from 'react'
import { createDirectionalPreset } from './presets/directional'
import { fadeIn } from './presets/fade-in'
import { fadeOut } from './presets/fade-out'
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
  fadeOut,
  scaleIn,
  slideUp,
  slideDown,
  slideFromLeft,
  slideFromRight,
  rotateIn,
  popIn,
}

export interface IUseMotionPresetOptions extends IDuckMotion.IPresetOptions {}

/** Lazy-load a single preset by name. Only fetches the module you ask for. */
export function loadPreset(name: MotionPresetName): Promise<IMotionPreset> {
  const loaders: Record<MotionPresetName, () => Promise<IMotionPreset>> = {
    fadeIn: () => import('./presets/fade-in').then((m) => m.fadeIn),
    fadeOut: () => import('./presets/fade-out').then((m) => m.fadeOut),
    scaleIn: () => import('./presets/scale-in').then((m) => m.scaleIn),
    slideUp: () => import('./presets/slide-up').then((m) => m.slideUp),
    slideDown: () => import('./presets/slide-down').then((m) => m.slideDown),
    slideFromLeft: () => import('./presets/slide-from-left').then((m) => m.slideFromLeft),
    slideFromRight: () => import('./presets/slide-from-right').then((m) => m.slideFromRight),
    rotateIn: () => import('./presets/rotate-in').then((m) => m.rotateIn),
    popIn: () => import('./presets/pop-in').then((m) => m.popIn),
  }
  return loaders[name]()
}

/** Lazy-load a directional preset. Only fetches the directional module when called. */
export function loadDirectionalPreset(
  direction: Direction,
  enterOffset?: number,
  exitOffset?: number,
  blur?: number,
): Promise<IMotionPreset> {
  return import('./presets/directional').then((m) =>
    m.createDirectionalPreset(direction, enterOffset, exitOffset, blur),
  )
}

function buildResult(preset: IMotionPreset, reduced: boolean, options?: IUseMotionPresetOptions): IMotionPresetResult {
  const baseTransition: MotionTransitionConfig = options?.transition ?? { ...springDefault }
  const enterTransition: MotionTransitionConfig = reduced
    ? { duration: 0 }
    : { ...(options?.enterTransition ?? baseTransition), ...(options?.delay ? { delay: options.delay } : {}) }
  const exitTransition: MotionTransitionConfig = reduced ? { duration: 0 } : (options?.exitTransition ?? baseTransition)

  // Override scale specifically so tap press/release is always fast regardless
  // of the base spring used by the preset.
  const enterWithTapScale = reduced ? enterTransition : { ...enterTransition, scale: TAP_SCALE_TRANSITION }

  return {
    initial: { ...preset.initial },
    animate: { ...preset.animate, transition: enterWithTapScale },
    exit: { ...preset.exit, transition: exitTransition },
    transition: enterWithTapScale,
  }
}

/** Async resolver — lazy-loads the preset module then returns the animation config. */
export async function resolveMotionPreset(
  name: MotionPresetName,
  options?: IUseMotionPresetOptions,
): Promise<IMotionPresetResult> {
  const preset = options?.direction ? await loadDirectionalPreset(options.direction) : await loadPreset(name)
  return buildResult(preset, false, options)
}

/**
 * Sync hook for React components. Accepts either a preset name (string) or a
 * preset object directly. The object form enables tree-shaking since unused
 * presets are never imported.
 */
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
  const result = buildResult(preset, reduced, options)

  if (typeof React.useMemo === 'function') {
    try {
      // biome-ignore lint/correctness/useHookAtTopLevel: guarded for non-React environments (tests)
      return React.useMemo(
        () => buildResult(preset, reduced, options),
        [
          reduced,
          options?.direction,
          options?.delay,
          options?.transition,
          options?.enterTransition,
          options?.exitTransition,
          preset,
          options,
        ],
      )
    } catch {
      return result
    }
  }

  return result
}

/** Convenience hook for direction-aware menu/popover animations. */
export function useDirectionalPreset(
  direction: Direction,
  options?: Omit<IUseMotionPresetOptions, 'direction'>,
): IMotionPresetResult {
  return useMotionPreset('scaleIn', { ...options, direction })
}
