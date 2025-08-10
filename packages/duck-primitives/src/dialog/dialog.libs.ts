export function lockScrollbar(isLocked: boolean) {
  const { documentElement, body } = document

  if (isLocked) {
    // Reserve scrollbar space so width doesn't change
    documentElement.style.scrollbarGutter = 'stable'
    body.style.overflow = 'hidden'
  } else {
    documentElement.style.scrollbarGutter = ''
    body.style.overflow = ''
  }
}

export function cleanLockScrollbar() {
  document.documentElement.style.scrollbarGutter = ''
  document.body.style.overflow = ''
}
