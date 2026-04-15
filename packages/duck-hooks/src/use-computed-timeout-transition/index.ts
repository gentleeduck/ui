/**
 * Schedule a callback after the element's CSS transition duration,
 * falling back to `timeout` ms when the element is unavailable or
 * has no explicit transition.
 *
 * Returns a cleanup function that cancels the pending timer.
 */
export function useComputedTimeoutTransition(
  element: HTMLElement | null,
  callback: () => void,
  timeout: number = 300,
): () => void {
  let duration = timeout

  if (!element) {
    const timer = setTimeout(callback, timeout)
    return () => clearTimeout(timer)
  }

  try {
    if (element.isConnected && element.style.transitionDuration !== undefined) {
      const computedDuration = getComputedStyle(element).transitionDuration
      if (computedDuration && computedDuration !== '0s') {
        const parsed = Number.parseFloat(computedDuration) * 1000
        if (parsed > 0 && Number.isFinite(parsed)) {
          duration = parsed
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('ComputedTimeout:', err.message)
    }
    duration = timeout
  }

  const timer = setTimeout(callback, duration)

  return () => clearTimeout(timer)
}
