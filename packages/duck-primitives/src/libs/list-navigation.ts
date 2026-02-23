/**
 * Shared list-navigation utilities used by Select and Command primitives.
 */

export const NAVIGATION_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End'] as const

/**
 * Focuses the first candidate element that accepts focus, scrolling it into view.
 */
export function focusFirst(candidates: Array<HTMLElement | null>) {
  const previouslyFocused = document.activeElement
  for (const candidate of candidates) {
    if (candidate === previouslyFocused) return
    candidate?.scrollIntoView({ block: 'nearest' })
    candidate?.focus({ preventScroll: true })
    if (document.activeElement !== previouslyFocused) return
  }
}

/**
 * Computes the ordered list of navigation candidates for arrow-key movement.
 * Reverses order for ArrowUp/End, slices from current element for ArrowUp/ArrowDown.
 */
export function getNavigationCandidates(
  items: HTMLElement[],
  key: string,
  activeElement: Element | null,
): HTMLElement[] {
  let candidates = items.slice()
  if (key === 'ArrowUp' || key === 'End') {
    candidates = candidates.reverse()
  }
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    const currentIndex = candidates.indexOf(activeElement as HTMLElement)
    candidates = candidates.slice(currentIndex + 1)
  }
  return candidates
}
