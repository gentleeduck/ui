import { duckMotionTransition } from './motion-tokens'
import { useDuckReducedMotion } from './react'

export interface MotionPreset {
  initial: Record<string, unknown>
  animate: Record<string, unknown>
  exit: Record<string, unknown>
  transition: Record<string, unknown>
}

const presets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8, filter: 'blur(5px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.8, filter: 'blur(5px)' },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
} as const

export type MotionPresetName = keyof typeof presets

export interface UseMotionPresetOptions {
  transition?: Record<string, unknown>
}

/**
 * Returns a preset animation config ready to spread onto a motion component.
 *
 * @example
 * ```tsx
 * const fadeIn = useMotionPreset('fadeIn')
 * return <m.div {...fadeIn}>Hello</m.div>
 * ```
 */
export function useMotionPreset(name: MotionPresetName, options?: UseMotionPresetOptions): MotionPreset {
  const reduced = useDuckReducedMotion()
  const preset = presets[name]
  const transition = reduced ? { duration: 0 } : (options?.transition ?? { ...duckMotionTransition.fast })

  return {
    initial: { ...preset.initial },
    animate: { ...preset.animate },
    exit: { ...preset.exit },
    transition,
  }
}
