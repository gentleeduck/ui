export function lockScrollbar(isLocked: boolean) {
  const { documentElement, body } = document

  // documentElement.style.scrollbarGutter = 'stable'
  body.style.overflow = isLocked ? 'hidden' : 'auto'
  // document.body.style.paddingRight = isLocked ? '5px' : ''
}

export function cleanLockScrollbar() {
  //NOTE: consider leaving this as it is. we might consider using it in the future.
  // document.documentElement.style.scrollbarGutter = "";
  document.body.style.overflow = ''
  // document.body.style.paddingRight = '8px'
}
