/**
 * Smoothly scroll `scrollParent` so `el` is centered, when `el` is currently
 * outside the parent's visible bounds. No-op when already in view or no
 * scroll parent is provided. Used by the TOC and the sidebar to track the
 * active item as the route changes.
 */
export function scrollIntoViewWithin(el: HTMLElement, scrollParent: HTMLElement | null): void {
  if (!scrollParent) return

  const scrollRect = scrollParent.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  if (elRect.top < scrollRect.top || elRect.bottom > scrollRect.bottom) {
    const targetScroll = el.offsetTop - scrollParent.offsetTop - scrollParent.clientHeight / 2 + el.clientHeight / 2
    scrollParent.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }
}
