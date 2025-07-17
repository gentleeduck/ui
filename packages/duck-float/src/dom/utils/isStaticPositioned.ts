import { getComputedStyle } from '../../utils/dom'

export function isStaticPositioned(element: Element): boolean {
  return getComputedStyle(element).position === 'static'
}
