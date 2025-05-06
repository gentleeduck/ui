import { WINDOW_TOP_OFFSET } from './drawer.constants'
import { AnyFunction, DrawerDirection } from './drawer.types'

export function isMobileFirefox(): boolean | undefined {
  const userAgent = navigator.userAgent
  return (
    typeof window !== 'undefined' &&
    ((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
      /FxiOS/.test(userAgent)) // iOS Firefox
  )
}

export function isMac(): boolean | undefined {
  return testPlatform(/^Mac/)
}

export function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/)
}

export function isSafari(): boolean | undefined {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  )
}

export function isIOS(): boolean | undefined {
  return isIPhone() || isIPad()
}

export function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== 'undefined' && window.navigator != null ? re.test(window.navigator.platform) : undefined
}

interface Style {
  [key: string]: string
}

const cache = new WeakMap()

export function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  if (!window.visualViewport) return false

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= window.visualViewport.height - 40 &&
    rect.right <= window.visualViewport.width
  )
}

export function set(el: Element | HTMLElement | null | undefined, styles: Style, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement)) return
  const originalStyles: Style = {}

  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('--')) {
      el.style.setProperty(key, value)
      return
    }

    originalStyles[key] = (el.style as any)[key]
    ;(el.style as any)[key] = value
  })

  if (ignoreCache) return

  cache.set(el, originalStyles)
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement)) return
  const originalStyles = cache.get(el)

  if (!originalStyles) {
    return
  }

  if (prop) {
    ;(el.style as any)[prop] = originalStyles[prop]
  } else {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(originalStyles).forEach(([key, value]) => {
      ;(el.style as any)[key] = value
    })
  }
}

export const isVertical = (direction: DrawerDirection) => {
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

export function getTranslate(element: HTMLElement, direction: DrawerDirection): number | null {
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

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2)
}

export function assignStyle(element: HTMLElement | null | undefined, style: Partial<CSSStyleDeclaration>) {
  if (!element) return () => {}

  const prevStyle = element.style.cssText
  Object.assign(element.style, style)

  return () => {
    element.style.cssText = prevStyle
  }
}

/**
 * Receives functions as arguments and returns a new function that calls all.
 */
export function chain<T>(...fns: T[]) {
  return (...args: T extends AnyFunction ? Parameters<T> : never) => {
    for (const fn of fns) {
      if (typeof fn === 'function') {
        fn(...args)
      }
    }
  }
}

////

export function onDrag(
  event: React.PointerEvent<HTMLDivElement>,
  isDragging: boolean,
  direction: DrawerDirection,
  pointerStart: any,
  activeSnapPointIndex: number | null,
  snapPoints: boolean,
  dismissible: boolean,
  drawerRef: React.RefObject<HTMLDivElement>,
  drawerHeightRef: React.RefObject<HTMLDivElement>,
  drawerWidthRef: React.RefObject<HTMLDivElement>,
  overlayRef: React.RefObject<HTMLDivElement>,
  isAllowedToDrag: React.RefObject<boolean>,
  shouldScaleBackground: boolean,
) {
  if (!drawerRef.current) {
    return
  }

  // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
  if (isDragging) {
    const directionMultiplier = direction === 'bottom' || direction === 'right' ? 1 : -1
    const draggedDistance =
      (pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX)) * directionMultiplier
    const isDraggingInDirection = draggedDistance > 0

    // Pre condition for disallowing dragging in the close direction.
    const noCloseSnapPointsPreCondition = snapPoints && !dismissible && !isDraggingInDirection

    // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
    if (noCloseSnapPointsPreCondition && activeSnapPointIndex === 0) return

    // We need to capture last time when drag with scroll was triggered and have a timeout between
    const absDraggedDistance = Math.abs(draggedDistance)
    const wrapper = document.querySelector('[data-vaul-drawer-wrapper]')
    const drawerDimension =
      direction === 'bottom' || direction === 'top' ? drawerHeightRef.current : drawerWidthRef.current

    // Calculate the percentage dragged, where 1 is the closed position
    let percentageDragged = absDraggedDistance / drawerDimension
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection)

    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged
    }

    // Disallow close dragging beyond the smallest snap point.
    if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
      return
    }

    if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection)) return
    drawerRef.current.classList.add(DRAG_CLASS)
    // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
    isAllowedToDrag.current = true
    set(drawerRef.current, {
      transition: 'none',
    })

    set(overlayRef.current, {
      transition: 'none',
    })

    if (snapPoints) {
      onDragSnapPoints({ draggedDistance })
    }

    // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
    if (isDraggingInDirection && !snapPoints) {
      const dampenedDraggedDistance = dampenValue(draggedDistance)

      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier
      set(drawerRef.current, {
        transform: isVertical(direction)
          ? `translate3d(0, ${translateValue}px, 0)`
          : `translate3d(${translateValue}px, 0, 0)`,
      })
      return
    }

    const opacityValue = 1 - percentageDragged

    if (shouldFade || (fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1)) {
      onDragProp?.(event, percentageDragged)

      set(
        overlayRef.current,
        {
          opacity: `${opacityValue}`,
          transition: 'none',
        },
        true,
      )
    }

    if (wrapper && overlayRef.current && shouldScaleBackground) {
      // Calculate percentageDragged as a fraction (0 to 1)
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1)
      const borderRadiusValue = 8 - percentageDragged * 8

      const translateValue = Math.max(0, 14 - percentageDragged * 14)

      set(
        wrapper,
        {
          borderRadius: `${borderRadiusValue}px`,
          transform: isVertical(direction)
            ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`
            : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
          transition: 'none',
        },
        true,
      )
    }

    if (!snapPoints) {
      const translateValue = absDraggedDistance * directionMultiplier

      set(drawerRef.current, {
        transform: isVertical(direction)
          ? `translate3d(0, ${translateValue}px, 0)`
          : `translate3d(${translateValue}px, 0, 0)`,
      })
    }
  }
}

export function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
}
