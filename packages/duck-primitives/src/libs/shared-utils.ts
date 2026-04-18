/** @internal Shared utility functions and types used across multiple primitives. */

export interface IPoint {
  x: number
  y: number
}
export type Polygon = IPoint[]

/**
 * Wraps an array around itself at a given start index.
 * Example: wrapArray(['a', 'b', 'c', 'd'], 2) returns ['c', 'd', 'a', 'b']
 */
export function wrapArray<T>(array: T[], startIndex: number) {
  // biome-ignore lint/style/noNonNullAssertion: modulo guarantees the index is always within bounds
  return array.map<T>((_, index) => array[(startIndex + index) % array.length]!)
}

/**
 * Focuses the first candidate element that successfully receives focus.
 * Stops as soon as focus has actually moved from the previously focused element.
 */
export function focusFirst(candidates: HTMLElement[], preventScroll = false) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    if (candidate === previouslyFocusedElement) return
    candidate.focus({ preventScroll })
    if (document.activeElement !== previouslyFocusedElement) return
  }
}

/**
 * Determines if a point is inside of a polygon.
 * Based on https://github.com/substack/point-in-polygon
 */
export function isPointInPolygon(point: IPoint, polygon: Polygon) {
  const { x, y } = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    // biome-ignore lint/style/noNonNullAssertion: loop indices i and j are always within polygon bounds
    const ii = polygon[i]!
    // biome-ignore lint/style/noNonNullAssertion: loop indices i and j are always within polygon bounds
    const jj = polygon[j]!
    const xi = ii.x
    const yi = ii.y
    const xj = jj.x
    const yj = jj.y

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}
