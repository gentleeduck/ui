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

export function useDuckReducedMotion() {
  return getSnapshot()
}

export function motionTransition<T extends Record<string, unknown>>(reduced: boolean, normal: T): T | { duration: 0 } {
  if (reduced) return { duration: 0 }
  return normal
}

export function onDuckReducedMotionChange(callback: () => void) {
  return subscribe(callback)
}

export function getDuckReducedMotionServerSnapshot() {
  return getServerSnapshot()
}
