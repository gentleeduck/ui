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

/**
 * Always-fast tween for the `scale` property. Merged into every returned
 * transition so `whileTap={tapScale}` feels instant on both press and release
 * (motion/react uses the parent transition for the tap-release direction).
 */
const TAP_SCALE_TRANSITION = { type: 'tween' as const, duration: 0.015, ease: 'easeOut' as const }

function buildResult(preset: MotionPreset, reduced: boolean, options?: UseMotionPresetOptions): MotionPresetResult {
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
  options?: UseMotionPresetOptions,
): Promise<MotionPresetResult> {
  const preset = options?.direction ? await loadDirectionalPreset(options.direction) : await loadPreset(name)
  return buildResult(preset, false, options)
}

/**
 * Sync hook for React components. Memoizes the result to avoid creating new
 * objects on every render.
 *
 * Accepts either a preset name (string lookup — convenient but bundles all
 * presets) or a preset object directly (tree-shakeable — only the imported
 * preset is bundled). Prefer the object form for optimal bundle size:
 *
 * ```tsx
 * import { scaleIn } from '@gentleduck/motion/presets/scale-in'
 * const content = useMotionPreset(scaleIn, { transition: springBouncy })
 * ```
 */
export function useMotionPreset(
  nameOrPreset: MotionPresetName | MotionPreset,
  options?: UseMotionPresetOptions,
): MotionPresetResult {
  const reduced = useDuckReducedMotion()
  const preset =
    options?.direction
      ? createDirectionalPreset(options.direction)
      : typeof nameOrPreset === 'string'
        ? presetMap[nameOrPreset]
        : nameOrPreset
  const result = buildResult(preset, reduced, options)

  // biome-ignore lint/correctness/useHookAtTopLevel: guarded for non-React environments (tests)
  if (typeof React.useMemo === 'function') {
    try {
      return React.useMemo(
        () => buildResult(preset, reduced, options),
        [
          nameOrPreset,
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
