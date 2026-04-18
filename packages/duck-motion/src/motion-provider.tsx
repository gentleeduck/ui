import type { FeatureBundle, Transition } from 'motion/react'
import { LazyMotion, MotionConfig } from 'motion/react'
import * as React from 'react'
import { loadDomAnimation } from './motion-features'
import { useDuckReducedMotion } from './react'

const DEFAULT_TRANSITION = { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const } as const
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
 * Wraps `LazyMotion` + `MotionConfig` with duck-ui defaults.
 * Integrates with `useDuckReducedMotion` to override transitions
 * when the user prefers reduced motion.
 *
 * Supports separate `enterTransition` and `exitTransition` for fine-grained
 * control. The `exitTransition` is exposed via `useMotionConfig()` so
 * `useMotionMount` can auto-derive exit duration.
 *
 * @example
 * ```tsx
 * import { MotionProvider } from '@gentleduck/motion/motion-provider'
 *
 * function App() {
 *   return (
 *     <MotionProvider exitTransition={{ duration: 0.32 }}>
 *       <m.div animate={{ opacity: 1 }} />
 *     </MotionProvider>
 *   )
 * }
 * ```
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
    () => ({ exitTransition: resolvedExitTransition }),
    // biome-ignore lint/correctness/useExhaustiveDependencies: serialized for stable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(resolvedExitTransition)],
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
