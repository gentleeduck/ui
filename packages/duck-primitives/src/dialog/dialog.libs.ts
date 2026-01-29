'use client'

let prevBodyOverflow: string | null = null
let prevScrollbarGutter: string | null = null
let didLock = false

function isPageScrollable(): boolean {
  if (typeof document === 'undefined') return false
  const { documentElement, body } = document

  const scrollEl = document.scrollingElement ?? documentElement
  const hasScrollableContent =
    scrollEl.scrollHeight > scrollEl.clientHeight || scrollEl.scrollWidth > scrollEl.clientWidth

  const bodyScrollable = body.scrollHeight > body.clientHeight || body.scrollWidth > body.clientWidth

  return hasScrollableContent || bodyScrollable
}

export function lockScrollbar(isLocked: boolean) {
  if (typeof document === 'undefined') return
  const { documentElement, body } = document

  if (isLocked) {
    // Don't remove scroll if there isn't any scroll to begin with
    if (!isPageScrollable()) return

    if (!didLock) {
      prevScrollbarGutter = documentElement.style.scrollbarGutter
      prevBodyOverflow = body.style.overflow
      didLock = true
    }

    // Reserve scrollbar space so width doesn't change
    documentElement.style.scrollbarGutter = 'stable'
    body.style.overflow = 'hidden'
  } else {
    if (!didLock) return

    documentElement.style.scrollbarGutter = prevScrollbarGutter ?? ''
    body.style.overflow = prevBodyOverflow ?? ''

    prevScrollbarGutter = null
    prevBodyOverflow = null
    didLock = false
  }
}

export function cleanLockScrollbar() {
  if (typeof document === 'undefined') return
  if (!didLock) return

  const { documentElement, body } = document
  documentElement.style.scrollbarGutter = prevScrollbarGutter ?? ''
  body.style.overflow = prevBodyOverflow ?? ''

  prevScrollbarGutter = null
  prevBodyOverflow = null
  didLock = false
}
