function useComputedTimeoutTransition(
  el: HTMLElement | null | undefined,
  callback: () => void,
): ReturnType<typeof setTimeout> | undefined {
  if (!el || !(el instanceof HTMLElement)) return
  const duration = getComputedStyle(el).transitionDuration
  const ms = parseFloat(duration) * 1000 || 0
  return setTimeout(callback, ms)
}

export { useComputedTimeoutTransition }
