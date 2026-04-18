import * as React from 'react'

/** @internal */
function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = () => callback()
  mediaQuery.addEventListener('change', handler)

  return () => mediaQuery.removeEventListener('change', handler)
}

/** @internal */
function getSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** @internal */
function getServerSnapshot() {
  return false
}

/**
 * Returns whether the user prefers reduced motion.
 * Uses useSyncExternalStore to subscribe to media query changes
 * without calling window.matchMedia() on every render.
 */
export function useDuckReducedMotion(): boolean {
  try {
    // biome-ignore lint/correctness/useHookAtTopLevel: guarded for non-React environments
    return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  } catch {
    return getSnapshot()
  }
}

export interface IReducedMotionFallback {
  duration: 0
}

export function motionTransition<T extends Record<string, unknown>>(
  reduced: boolean,
  normal: T,
): T | IReducedMotionFallback {
  if (reduced) return { duration: 0 }
  return normal
}

export function onDuckReducedMotionChange(callback: () => void) {
  return subscribe(callback)
}

export function getDuckReducedMotionServerSnapshot() {
  return getServerSnapshot()
}
