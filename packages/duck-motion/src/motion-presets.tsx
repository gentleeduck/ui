import * as React from 'react'
import { createDirectionalPreset } from './presets/directional'
import { fadeIn } from './presets/fade-in'
import { fadeOut } from './presets/fade-out'
import { scaleIn } from './presets/scale-in'
import { slideDown } from './presets/slide-down'
import { slideFromLeft } from './presets/slide-from-left'
import { slideFromRight } from './presets/slide-from-right'
import { slideUp } from './presets/slide-up'
import type {
  Direction,
  MotionAnimationState,
  MotionPreset,
  MotionPresetName,
  MotionPresetResult,
  MotionTransitionConfig,
} from './presets/types'
import { useDuckReducedMotion } from './react'
import { springDefault } from './transitions/springs'

export type {
  Direction,
  MotionAnimationState,
  MotionPreset,
  MotionPresetName,
  MotionPresetResult,
  MotionTransitionConfig,
}

const presetMap: Record<MotionPresetName, MotionPreset> = {
  fadeIn,
  fadeOut,
  scaleIn,
  slideUp,
  slideDown,
  slideFromLeft,
  slideFromRight,
}

export interface UseMotionPresetOptions {
  transition?: MotionTransitionConfig
  enterTransition?: MotionTransitionConfig
  exitTransition?: MotionTransitionConfig
  delay?: number
  direction?: Direction
}

/** Lazy-load a single preset by name. Only fetches the module you ask for. */
export function loadPreset(name: MotionPresetName): Promise<MotionPreset> {
  const loaders: Record<MotionPresetName, () => Promise<MotionPreset>> = {
    fadeIn: () => import('./presets/fade-in').then((m) => m.fadeIn),
    fadeOut: () => import('./presets/fade-out').then((m) => m.fadeOut),
    scaleIn: () => import('./presets/scale-in').then((m) => m.scaleIn),
    slideUp: () => import('./presets/slide-up').then((m) => m.slideUp),
    slideDown: () => import('./presets/slide-down').then((m) => m.slideDown),
    slideFromLeft: () => import('./presets/slide-from-left').then((m) => m.slideFromLeft),
    slideFromRight: () => import('./presets/slide-from-right').then((m) => m.slideFromRight),
  }
  return loaders[name]()
}

/** Lazy-load a directional preset. Only fetches the directional module when called. */
export function loadDirectionalPreset(
  direction: Direction,
  enterOffset?: number,
  exitOffset?: number,
  blur?: number,
): Promise<MotionPreset> {
  return import('./presets/directional').then((m) =>
    m.createDirectionalPreset(direction, enterOffset, exitOffset, blur),
  )
}

function buildResult(preset: MotionPreset, reduced: boolean, options?: UseMotionPresetOptions): MotionPresetResult {
  const baseTransition: MotionTransitionConfig = options?.transition ?? { ...springDefault }
  const enterTransition: MotionTransitionConfig = reduced
    ? { duration: 0 }
    : { ...(options?.enterTransition ?? baseTransition), ...(options?.delay ? { delay: options.delay } : {}) }
  const exitTransition: MotionTransitionConfig = reduced ? { duration: 0 } : (options?.exitTransition ?? baseTransition)

  return {
    initial: { ...preset.initial },
    animate: { ...preset.animate, transition: enterTransition },
    exit: { ...preset.exit, transition: exitTransition },
    transition: enterTransition,
  }
}

/** Async resolver — lazy-loads the preset module then returns the animation config. */
export async function resolveMotionPreset(
  name: MotionPresetName,
  options?: UseMotionPresetOptions,
): Promise<MotionPresetResult> {
  const preset = options?.direction ? await loadDirectionalPreset(options.direction) : await loadPreset(name)
  return buildResult(preset, false, options)
}

/** Sync hook for React components. Memoizes the result to avoid creating new objects on every render. */
export function useMotionPreset(name: MotionPresetName, options?: UseMotionPresetOptions): MotionPresetResult {
  const reduced = useDuckReducedMotion()
  const preset = options?.direction ? createDirectionalPreset(options.direction) : presetMap[name]
  const result = buildResult(preset, reduced, options)

  // biome-ignore lint/correctness/useHookAtTopLevel: guarded for non-React environments (tests)
  if (typeof React.useMemo === 'function') {
    try {
      return React.useMemo(
        () => buildResult(preset, reduced, options),
        [
          name,
          reduced,
          options?.direction,
          options?.delay,
          options?.transition,
          options?.enterTransition,
          options?.exitTransition,
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
  options?: Omit<UseMotionPresetOptions, 'direction'>,
): MotionPresetResult {
  return useMotionPreset('scaleIn', { ...options, direction })
}
