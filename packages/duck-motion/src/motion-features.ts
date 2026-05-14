import type { FeatureBundle } from 'motion/react'

/** Lazy `domAnimation` bundle (~5KB): animate, exit, variants, hover, tap, focus. */
export const loadDomAnimation = () => import('motion/react').then((mod) => mod.domAnimation) as Promise<FeatureBundle>

/** Lazy `domMax` bundle (~34KB): adds layout, drag, pan, viewport detection. */
export const loadDomMax = () => import('motion/react').then((mod) => mod.domMax) as Promise<FeatureBundle>

/** Unified feature loader. Defaults to the lighter `'animation'` bundle. */
export function loadMotionFeatures(level: 'animation' | 'max' = 'animation') {
  return level === 'max' ? loadDomMax : loadDomAnimation
}
