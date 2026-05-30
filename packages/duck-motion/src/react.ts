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

/** `prefers-reduced-motion: reduce`. SSR-safe; `false` on server. */
export function useDuckReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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
