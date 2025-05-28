export function useComputedTimeoutTransition(element: HTMLElement | null, callback: () => void) {
  const duration =
    element?.style.transitionDuration !== undefined
      ? Number.parseFloat(getComputedStyle(element).transitionDuration || '0') * 1000
      : 300
  const timer = setTimeout(() => {
    callback()
  }, duration)
  return () => clearTimeout(timer)
}
