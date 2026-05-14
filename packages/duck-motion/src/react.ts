import * as React from 'react'

// SSR-safe: window/matchMedia guarded so subscribe/snapshot work on the server.
function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = () => callback()
  mediaQuery.addEventListener('change', handler)

  return () => mediaQuery.removeEventListener('change', handler)
}

function getSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot() {
  return false
}

/** Whether the user prefers reduced motion. Backed by `useSyncExternalStore`. */
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
