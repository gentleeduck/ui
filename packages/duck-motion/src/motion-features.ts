import type { FeatureBundle } from 'motion/react'

/**
 * Lazily load `domAnimation` features (~5KB).
 * Covers: animate, exit, variants, hover, tap, focus.
 * Use with `<LazyMotion features={loadDomAnimation}>`.
 */
export const loadDomAnimation = () => import('motion/react').then((mod) => mod.domAnimation) as Promise<FeatureBundle>

/**
 * Lazily load `domMax` features (~34KB).
 * Adds: layout animations, drag, pan, viewport detection.
 * Use with `<LazyMotion features={loadDomMax}>`.
 */
export const loadDomMax = () => import('motion/react').then((mod) => mod.domMax) as Promise<FeatureBundle>

/**
 * Unified feature loader. Defaults to `'animation'` for the lighter bundle.
 *
 * @example
 * ```tsx
 * <LazyMotion features={loadMotionFeatures('max')} strict>
 *   <m.div animate={{ opacity: 1 }} />
 * </LazyMotion>
 * ```
 */
export function loadMotionFeatures(level: 'animation' | 'max' = 'animation') {
  return level === 'max' ? loadDomMax : loadDomAnimation
}
