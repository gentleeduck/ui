import { getComputedStyle } from '../../utils/dom'

export function isRTL(element: Element) {
  return getComputedStyle(element).direction === 'rtl'
}
