export const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1],
}
export const isVertical = (direction: 'left' | 'right' | 'top' | 'bottom') => {
  switch (direction) {
    case 'top':
    case 'bottom':
      return true
    case 'left':
    case 'right':
      return false
    default:
      return direction satisfies never
  }
}

export function getTranslate(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom'): number | null {
  if (!element) {
    return null
  }
  const style = window.getComputedStyle(element)
  const transform =
    // @ts-ignore
    style.transform || style.webkitTransform || style.mozTransform
  let mat = transform.match(/^matrix3d\((.+)\)$/)
  if (mat) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
    return Number.parseFloat(mat[1].split(', ')[isVertical(direction) ? 13 : 12])
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  mat = transform.match(/^matrix\((.+)\)$/)
  return mat ? Number.parseFloat(mat[1].split(', ')[isVertical(direction) ? 5 : 4]) : null
}
