import type { FeatureBundle, Transition } from 'motion/react'
import { LazyMotion, MotionConfig } from 'motion/react'
import * as React from 'react'
import { loadDomAnimation } from './motion-features'
import { useDuckReducedMotion } from './react'
import { duckMotionDuration, duckMotionEasing } from './transitions/tweens'

const DEFAULT_TRANSITION = { duration: duckMotionDuration.fast, ease: duckMotionEasing.standard } as const
const REDUCED_TRANSITION = { duration: 0 } as const

export interface IMotionProviderProps {
  children: React.ReactNode
  /** Global default transition. Falls back to a fast tween (150ms, standard ease). */
  transition?: Transition
  /** Override transition used for enter animations only. */
  enterTransition?: Transition
  /** Override transition used for exit animations only. */
  exitTransition?: Transition
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

export interface IMotionConfigContextValue {
  exitTransition?: Transition
}

const MotionConfigContext = React.createContext<IMotionConfigContextValue>({})

export function useMotionConfig(): IMotionConfigContextValue {
  return React.useContext(MotionConfigContext)
}

/**
 * `LazyMotion` + `MotionConfig` with duck-ui defaults. Honors
 * `useDuckReducedMotion`. `exitTransition` is exposed via `useMotionConfig()`
 * so `useMotionMount` can derive exit duration without the caller passing it.
 */
export function MotionProvider({
  children,
  transition,
  enterTransition,
  exitTransition,
  reducedMotion = 'user',
  features = loadDomAnimation,
  strict = false,
}: IMotionProviderProps) {
  const prefersReduced = useDuckReducedMotion()

  const resolvedTransition = prefersReduced ? REDUCED_TRANSITION : (enterTransition ?? transition ?? DEFAULT_TRANSITION)

  const resolvedExitTransition: Transition | undefined = prefersReduced ? REDUCED_TRANSITION : exitTransition

  const contextValue = React.useMemo<IMotionConfigContextValue>(
    () => (resolvedExitTransition !== undefined ? { exitTransition: resolvedExitTransition } : {}),
    [resolvedExitTransition],
  )

  return (
    <LazyMotion features={features} strict={strict}>
      <MotionConfig transition={resolvedTransition} reducedMotion={reducedMotion}>
        <MotionConfigContext.Provider value={contextValue}>{children}</MotionConfigContext.Provider>
      </MotionConfig>
    </LazyMotion>
  )
}

MotionProvider.displayName = 'MotionProvider'
