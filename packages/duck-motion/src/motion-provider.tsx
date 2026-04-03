import type { FeatureBundle } from 'motion/react'
import { LazyMotion, MotionConfig } from 'motion/react'
import type * as React from 'react'
import { loadDomAnimation } from './motion-features'
import { duckMotionTransition } from './motion-tokens'
import { useDuckReducedMotion } from './react'

export interface MotionProviderProps {
  children: React.ReactNode
  /** Global default transition. Falls back to `duckMotionTransition.fast`. */
  transition?: Record<string, unknown>
  /**
   * Reduced-motion strategy passed to `MotionConfig`.
   * - `"user"` (default): respects OS `prefers-reduced-motion` setting.
   * - `"always"`: forces reduced motion for all users.
   * - `"never"`: ignores the OS setting.
   */
  reducedMotion?: 'user' | 'always' | 'never'
  /** LazyMotion feature loader. Defaults to `loadDomAnimation` (~5KB). */
  features?: () => Promise<FeatureBundle>
  /** Enable strict mode for LazyMotion (warns on `motion.*` usage). */
  strict?: boolean
}

/**
 * Wraps `LazyMotion` + `MotionConfig` with duck-ui defaults.
 * Integrates with `useDuckReducedMotion` to override transitions
 * when the user prefers reduced motion.
 *
 * @example
 * ```tsx
 * import { MotionProvider } from '@gentleduck/motion/motion-provider'
 *
 * function App() {
 *   return (
 *     <MotionProvider>
 *       <m.div animate={{ opacity: 1 }} />
 *     </MotionProvider>
 *   )
 * }
 * ```
 */
export function MotionProvider({
  children,
  transition,
  reducedMotion = 'user',
  features = loadDomAnimation,
  strict = false,
}: MotionProviderProps) {
  const prefersReduced = useDuckReducedMotion()
  const resolvedTransition = prefersReduced ? { duration: 0 } : (transition ?? { ...duckMotionTransition.fast })

  return (
    <LazyMotion features={features} strict={strict}>
      <MotionConfig transition={resolvedTransition} reducedMotion={reducedMotion}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}

MotionProvider.displayName = 'MotionProvider'
