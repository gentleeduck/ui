/**
 * Schedule `callback` after the element's CSS transition duration (read
 * from `getComputedStyle`), falling back to `timeout` ms when the element
 * is missing, disconnected, or has no transition. Returns a cleanup that
 * cancels the timer.
 *
 * This is a plain timer factory, NOT a React hook — safe to call from
 * effects, event handlers, or anywhere else.
 */
export function scheduleTransitionTimeout(
  element: HTMLElement | null,
  callback: () => void,
  timeout: number = 300,
): () => void {
  let duration = timeout

  if (!element?.isConnected) {
    const timer = setTimeout(callback, duration)
    return () => clearTimeout(timer)
  }

  const computedDuration = getComputedStyle(element).transitionDuration
  if (computedDuration && computedDuration !== '0s') {
    const parsed = Number.parseFloat(computedDuration) * 1000
    if (parsed > 0 && Number.isFinite(parsed)) {
      duration = parsed
    }
  }

  const timer = setTimeout(callback, duration)
  return () => clearTimeout(timer)
}
