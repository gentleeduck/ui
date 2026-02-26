export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function animateIfAllowed(
  element: Element | null,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: KeyframeAnimationOptions,
  reducedMotion = prefersReducedMotion(),
) {
  if (!element || reducedMotion) return null
  return element.animate(keyframes, options)
}

