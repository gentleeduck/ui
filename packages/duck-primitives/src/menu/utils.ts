/** Pure utility functions, types, and constants for the Menu primitive. */
import type * as React from 'react'
import type { Polygon } from '../libs/shared-utils'
import { isPointInPolygon, wrapArray } from '../libs/shared-utils'

export type { Direction } from '../hooks/use-direction'
export type { Point, Polygon } from '../libs/shared-utils'
export { focusFirst, isPointInPolygon, wrapArray } from '../libs/shared-utils'

export type CheckedState = boolean | 'indeterminate'
export type Side = 'left' | 'right'
export type GraceIntent = { area: Polygon; side: Side }

export const SELECTION_KEYS = ['Enter', ' ']
export const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
export const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]
export const SUB_OPEN_KEYS: Record<'ltr' | 'rtl', string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
}
export const SUB_CLOSE_KEYS: Record<'ltr' | 'rtl', string[]> = {
  ltr: ['ArrowLeft'],
  rtl: ['ArrowRight'],
}

export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

export function getCheckedState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

/**
 * This is the "meat" of the typeahead matching logic. It takes in all the values,
 * the search and the current match, and returns the next match (or undefined).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match.
 * This is so we always look forward from the current match, and picking the first
 * match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current match from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current match still matches.
 */
export function getNextMatch(values: string[], search: string, currentMatch?: string) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0])
  const normalizedSearch = isRepeated ? search[0]! : search
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0))
  const excludeCurrentMatch = normalizedSearch.length === 1
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch)
  const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()))
  return nextMatch !== currentMatch ? nextMatch : undefined
}

export function isPointerInGraceArea(event: React.PointerEvent, area?: Polygon) {
  if (!area) return false
  const cursorPos = { x: event.clientX, y: event.clientY }
  return isPointInPolygon(cursorPos, area)
}

export function whenMouse<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType === 'mouse' ? handler(event) : undefined)
}
