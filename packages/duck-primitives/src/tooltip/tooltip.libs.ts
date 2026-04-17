import { createContextScope } from '../libs/create-context'
import type { IPoint } from '../libs/shared-utils'
import { createPopperScope } from '../popper'

const TOOLTIP_NAME = 'Tooltip'

const [createTooltipContext, createTooltipScope] = createContextScope(TOOLTIP_NAME, [createPopperScope])
const usePopperScope = createPopperScope()

const TOOLTIP_OPEN = 'tooltip.open'

export { createTooltipContext, createTooltipScope, TOOLTIP_NAME, TOOLTIP_OPEN, usePopperScope }

type Side = 'top' | 'right' | 'bottom' | 'left'

function getExitSideFromRect(point: IPoint, rect: DOMRect): Side {
  const top = Math.abs(rect.top - point.y)
  const bottom = Math.abs(rect.bottom - point.y)
  const right = Math.abs(rect.right - point.x)
  const left = Math.abs(rect.left - point.x)

  switch (Math.min(top, bottom, right, left)) {
    case left:
      return 'left'
    case right:
      return 'right'
    case top:
      return 'top'
    case bottom:
      return 'bottom'
    default:
      throw new Error('unreachable')
  }
}

function getPaddedExitPoints(exitPoint: IPoint, exitSide: Side, padding = 5) {
  const paddedExitPoints: IPoint[] = []
  switch (exitSide) {
    case 'top':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding },
      )
      break
    case 'bottom':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
      )
      break
    case 'left':
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding },
      )
      break
    case 'right':
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
      )
      break
  }
  return paddedExitPoints
}

function getPointsFromRect(rect: DOMRect) {
  const { top, right, bottom, left } = rect
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ]
}

// Returns a new array of points representing the convex hull of the given set of points.
// https://www.nayuki.io/page/convex-hull-algorithm
function getHull<P extends IPoint>(points: Readonly<Array<P>>): Array<P> {
  const newPoints: Array<P> = points.slice()
  newPoints.sort((a: IPoint, b: IPoint) => {
    if (a.x < b.x) return -1
    else if (a.x > b.x) return +1
    else if (a.y < b.y) return -1
    else if (a.y > b.y) return +1
    else return 0
  })
  return getHullPresorted(newPoints)
}

// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
function getHullPresorted<P extends IPoint>(points: Readonly<Array<P>>): Array<P> {
  if (points.length <= 1) return points.slice()

  const upperHull: Array<P> = []
  for (let i = 0; i < points.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: index `i` is always within bounds of `points`
    const p = points[i]!
    while (upperHull.length >= 2) {
      // biome-ignore lint/style/noNonNullAssertion: length >= 2 guarantees these indices exist
      const q = upperHull[upperHull.length - 1]!
      // biome-ignore lint/style/noNonNullAssertion: length >= 2 guarantees these indices exist
      const r = upperHull[upperHull.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop()
      else break
    }
    upperHull.push(p)
  }
  upperHull.pop()

  const lowerHull: Array<P> = []
  for (let i = points.length - 1; i >= 0; i--) {
    // biome-ignore lint/style/noNonNullAssertion: index `i` is always within bounds of `points`
    const p = points[i]!
    while (lowerHull.length >= 2) {
      // biome-ignore lint/style/noNonNullAssertion: length >= 2 guarantees these indices exist
      const q = lowerHull[lowerHull.length - 1]!
      // biome-ignore lint/style/noNonNullAssertion: length >= 2 guarantees these indices exist
      const r = lowerHull[lowerHull.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop()
      else break
    }
    lowerHull.push(p)
  }
  lowerHull.pop()

  if (
    upperHull.length === 1 &&
    lowerHull.length === 1 &&
    upperHull[0]?.x === lowerHull[0]?.x &&
    upperHull[0]?.y === lowerHull[0]?.y
  ) {
    return upperHull
  } else {
    return upperHull.concat(lowerHull)
  }
}

export type { IPoint, Polygon } from '../libs/shared-utils'
export { isPointInPolygon } from '../libs/shared-utils'
export { getExitSideFromRect, getHull, getPaddedExitPoints, getPointsFromRect }
