import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.RefObject<T>).current = value
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    return refs.forEach((ref) => setRef(ref, node))
  }
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs)
}

export { composeRefs, useComposedRefs }

type UseControllableStateParams<T> = {
  prop?: T | undefined
  defaultProp?: T | undefined
  onChange?: (state: T) => void
}

type SetStateFn<T> = (prevState?: T) => T

function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(
    () => ((...args) => callbackRef.current?.(...args)) as T,
    [],
  )
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, 'prop'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp)
  const [value] = uncontrolledState
  const prevValueRef = React.useRef(value)
  const handleChange = useCallbackRef(onChange)

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T)
      prevValueRef.current = value
    }
  }, [value, prevValueRef, handleChange])

  return uncontrolledState
}
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  })
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp
  const handleChange = useCallbackRef(onChange)

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>
          const value =
            typeof nextValue === 'function' ? setter(prop) : nextValue
          if (value !== prop) handleChange(value as T)
        } else {
          setUncontrolledProp(nextValue)
        }
      },
      [isControlled, prop, setUncontrolledProp, handleChange],
    )

  return [value, setValue] as const
}

import { useEffect, useLayoutEffect } from 'react'
import {
  assignStyle,
  getScale,
  isIOS,
  isSafari,
  isVertical,
  set,
} from './drawer.libs'
import { useDrawerContext } from './drawer'
import {
  BORDER_RADIUS,
  TRANSITIONS,
  VELOCITY_THRESHOLD,
  WINDOW_TOP_OFFSET,
} from './drawer.constants'
import { DrawerDirection } from './drawer.types'

const KEYBOARD_BUFFER = 24

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean
  focusCallback?: () => void
}

function chain(...callbacks: any[]): (...args: any[]) => void {
  return (...args: any[]) => {
    for (let callback of callbacks) {
      if (typeof callback === 'function') {
        callback(...args)
      }
    }
  }
}

// @ts-ignore
const visualViewport = typeof document !== 'undefined' && window.visualViewport

export function isScrollable(node: Element): boolean {
  let style = window.getComputedStyle(node)
  return /(auto|scroll)/.test(
    style.overflow + style.overflowX + style.overflowY,
  )
}

export function getScrollParent(node: Element): Element {
  if (isScrollable(node)) {
    node = node.parentElement as HTMLElement
  }

  while (node && !isScrollable(node)) {
    node = node.parentElement as HTMLElement
  }

  return node || document.scrollingElement || document.documentElement
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset',
])

// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0
let restore: () => void

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}) {
  let { isDisabled } = options

  useIsomorphicLayoutEffect(() => {
    if (isDisabled) {
      return
    }

    preventScrollCount++
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari()
      }
    }

    return () => {
      preventScrollCount--
      if (preventScrollCount === 0) {
        restore?.()
      }
    }
  }, [isDisabled])
}

// Mobile Safari is a whole different beast. Even with overflow: hidden,
// it still scrolls the page in many situations:
//
// 1. When the bottom toolbar and address bar are collapsed, page scrolling is always allowed.
// 2. When the keyboard is visible, the viewport does not resize. Instead, the keyboard covers part of
//    it, so it becomes scrollable.
// 3. When tapping on an input, the page always scrolls so that the input is centered in the visual viewport.
//    This may cause even fixed position elements to scroll off the screen.
// 4. When using the next/previous buttons in the keyboard to navigate between inputs, the whole page always
//    scrolls, even if the input is inside a nested scrollable element that could be scrolled instead.
//
// In order to work around these cases, and prevent scrolling without jankiness, we do a few things:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable element. This prevents touch scrolling
//    on the window.
// 2. Prevent default on `touchmove` events inside a scrollable element when the scroll position is at the
//    top or bottom. This avoids the whole page scrolling instead, but does prevent overscrolling.
// 3. Prevent default on `touchend` events on input elements and handle focusing the element ourselves.
// 4. When focusing an input, apply a transform to trick Safari into thinking the input is at the top
//    of the page, which prevents it from scrolling the page. After the input is focused, scroll the element
//    into view ourselves, without scrolling the whole page.
// 5. Offset the body by the scroll position using a negative margin and scroll to the top. This should appear the
//    same visually, but makes the actual scroll position always zero. This is required to make all of the
//    above work or Safari will still try to scroll the page when focusing an input.
// 6. As a last resort, handle window scroll events, and scroll back to the top. This can happen when attempting
//    to navigate to an input with the next/previous buttons that's outside a modal.
function preventScrollMobileSafari() {
  let scrollable: Element
  let lastY = 0
  let onTouchStart = (e: TouchEvent) => {
    // Store the nearest scrollable parent element from the element that the user touched.
    scrollable = getScrollParent(e.target as Element)
    if (
      scrollable === document.documentElement &&
      scrollable === document.body
    ) {
      return
    }

    //FIX:
    lastY = e.changedTouches[0]!.pageY
  }

  let onTouchMove = (e: TouchEvent) => {
    // Prevent scrolling the window.
    if (
      !scrollable ||
      scrollable === document.documentElement ||
      scrollable === document.body
    ) {
      e.preventDefault()
      return
    }

    // Prevent scrolling up when at the top and scrolling down when at the bottom
    // of a nested scrollable area, otherwise mobile Safari will start scrolling
    // the window instead. Unfortunately, this disables bounce scrolling when at
    // the top but it's the best we can do.
    let y = e.changedTouches[0]?.pageY
    let scrollTop = scrollable.scrollTop
    let bottom = scrollable.scrollHeight - scrollable.clientHeight

    if (bottom === 0) {
      return
    }

    if ((scrollTop <= 0 && y! > lastY) || (scrollTop >= bottom && y! < lastY)) {
      e.preventDefault()
    }

    //FIX:
    lastY = y!
  }

  let onTouchEnd = (e: TouchEvent) => {
    let target = e.target as HTMLElement

    // Apply this change if we're not already focused on the target element
    if (isInput(target) && target !== document.activeElement) {
      e.preventDefault()

      // Apply a transform to trick Safari into thinking the input is at the top of the page
      // so it doesn't try to scroll it into view. When tapping on an input, this needs to
      // be done before the "focus" event, so we have to focus the element ourselves.
      target.style.transform = 'translateY(-2000px)'
      target.focus()
      requestAnimationFrame(() => {
        target.style.transform = ''
      })
    }
  }

  let onFocus = (e: FocusEvent) => {
    let target = e.target as HTMLElement
    if (isInput(target)) {
      // Transform also needs to be applied in the focus event in cases where focus moves
      // other than tapping on an input directly, e.g. the next/previous buttons in the
      // software keyboard. In these cases, it seems applying the transform in the focus event
      // is good enough, whereas when tapping an input, it must be done before the focus event. 🤷
      target.style.transform = 'translateY(-2000px)'
      requestAnimationFrame(() => {
        target.style.transform = ''

        // This will have prevented the browser from scrolling the focused element into view,
        // so we need to do this ourselves in a way that doesn't cause the whole page to scroll.
        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            // If the keyboard is already visible, do this after one additional frame
            // to wait for the transform to be removed.
            requestAnimationFrame(() => {
              scrollIntoView(target)
            })
          } else {
            // Otherwise, wait for the visual viewport to resize before scrolling so we can
            // measure the correct position to scroll to.
            visualViewport.addEventListener(
              'resize',
              () => scrollIntoView(target),
              { once: true },
            )
          }
        }
      })
    }
  }

  let onWindowScroll = () => {
    // Last resort. If the window scrolled, scroll it back to the top.
    // It should always be at the top because the body will have a negative margin (see below).
    window.scrollTo(0, 0)
  }

  // Record the original scroll position so we can restore it.
  // Then apply a negative margin to the body to offset it by the scroll position. This will
  // enable us to scroll the window to the top, which is required for the rest of this to work.
  let scrollX = window.pageXOffset
  let scrollY = window.pageYOffset

  let restoreStyles = chain(
    setStyle(
      document.documentElement,
      'paddingRight',
      `${window.innerWidth - document.documentElement.clientWidth}px`,
    ),
    // setStyle(document.documentElement, 'overflow', 'hidden'),
    // setStyle(document.body, 'marginTop', `-${scrollY}px`),
  )

  // Scroll to the top. The negative margin on the body will make this appear the same.
  window.scrollTo(0, 0)

  let removeEvents = chain(
    addEvent(document, 'touchstart', onTouchStart, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'touchmove', onTouchMove, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'touchend', onTouchEnd, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'focus', onFocus, true),
    addEvent(window, 'scroll', onWindowScroll),
  )

  return () => {
    // Restore styles and scroll the page back to where it was.
    restoreStyles()
    removeEvents()
    window.scrollTo(scrollX, scrollY)
  }
}

// Sets a CSS property on an element, and returns a function to revert it to the previous value.
function setStyle(
  element: HTMLElement,
  style: keyof React.CSSProperties,
  value: string,
) {
  // https://github.com/microsoft/TypeScript/issues/17827#issuecomment-391663310
  // @ts-ignore
  let cur = element.style[style]
  // @ts-ignore
  element.style[style] = value

  return () => {
    // @ts-ignore
    element.style[style] = cur
  }
}

// Adds an event listener to an element, and returns a function to remove it.
function addEvent<K extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  event: K,
  handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  // @ts-ignore
  target.addEventListener(event, handler, options)

  return () => {
    // @ts-ignore
    target.removeEventListener(event, handler, options)
  }
}

function scrollIntoView(target: Element) {
  let root = document.scrollingElement || document.documentElement
  while (target && target !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not already in view.
    let scrollable = getScrollParent(target)
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== target
    ) {
      let scrollableTop = scrollable.getBoundingClientRect().top
      let targetTop = target.getBoundingClientRect().top
      let targetBottom = target.getBoundingClientRect().bottom
      // Buffer is needed for some edge cases
      const keyboardHeight =
        scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER

      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop
      }
    }

    // @ts-ignore
    target = scrollable.parentElement
  }
}

export function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement &&
      !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

/**
 * This hook is necessary to prevent buggy behavior on iOS devices (need to test on Android).
 * I won't get into too much detail about what bugs it solves, but so far I've found that setting the body to `position: fixed` is the most reliable way to prevent those bugs.
 * Issues that this hook solves:
 * https://github.com/emilkowalski/vaul/issues/435
 * https://github.com/emilkowalski/vaul/issues/433
 * And more that I discovered, but were just not reported.
 */

let previousBodyPosition: Record<string, string> | null = null

export function usePositionFixed({
  isOpen,
  modal,
  nested,
  hasBeenOpened,
  preventScrollRestoration,
  noBodyStyles,
}: {
  isOpen: boolean
  modal: boolean
  nested: boolean
  hasBeenOpened: boolean
  preventScrollRestoration: boolean
  noBodyStyles: boolean
}) {
  const [activeUrl, setActiveUrl] = React.useState(() =>
    typeof window !== 'undefined' ? window.location.href : '',
  )
  const scrollPos = React.useRef(0)

  const setPositionFixed = React.useCallback(() => {
    // All browsers on iOS will return true here.
    if (!isSafari()) return

    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === null && isOpen && !noBodyStyles) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: 'unset',
      }

      // Update the dom inside an animation frame
      const { scrollX, innerHeight } = window

      document.body.style.setProperty('position', 'fixed', 'important')
      Object.assign(document.body.style, {
        top: `${-scrollPos.current}px`,
        left: `${-scrollX}px`,
        right: '0px',
        height: 'auto',
      })

      window.setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight
            if (bottomBarHeight && scrollPos.current >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollPos.current + bottomBarHeight)}px`
            }
          }),
        300,
      )
    }
  }, [isOpen])

  const restorePositionSetting = React.useCallback(() => {
    // All browsers on iOS will return true here.
    if (!isSafari()) return

    if (previousBodyPosition !== null && !noBodyStyles) {
      // Convert the position from "px" to Int
      const y = -Number.parseInt(document.body.style.top, 10)
      const x = -Number.parseInt(document.body.style.left, 10)

      // Restore styles
      Object.assign(document.body.style, previousBodyPosition)

      window.requestAnimationFrame(() => {
        if (preventScrollRestoration && activeUrl !== window.location.href) {
          setActiveUrl(window.location.href)
          return
        }

        window.scrollTo(x, y)
      })

      previousBodyPosition = null
    }
  }, [activeUrl])

  React.useEffect(() => {
    function onScroll() {
      scrollPos.current = window.scrollY
    }

    onScroll()

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  React.useEffect(() => {
    if (!modal) return

    return () => {
      if (typeof document === 'undefined') return

      // Another drawer is opened, safe to ignore the execution
      const hasDrawerOpened = !!document.querySelector('[data-vaul-drawer]')
      if (hasDrawerOpened) return

      restorePositionSetting()
    }
  }, [modal, restorePositionSetting])

  React.useEffect(() => {
    if (nested || !hasBeenOpened) return
    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
    if (isOpen) {
      // avoid for standalone mode (PWA)
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches
      !isStandalone && setPositionFixed()

      if (!modal) {
        window.setTimeout(() => {
          restorePositionSetting()
        }, 500)
      }
    } else {
      restorePositionSetting()
    }
  }, [
    isOpen,
    hasBeenOpened,
    activeUrl,
    modal,
    nested,
    setPositionFixed,
    restorePositionSetting,
  ])

  return { restorePositionSetting }
}

const noop = () => () => {}

export function useScaleBackground() {
  const {
    direction,
    isOpen,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    noBodyStyles,
  } = useDrawerContext()
  const timeoutIdRef = React.useRef<number | null>(null)
  const initialBackgroundColor = React.useMemo(
    () => document.body.style.backgroundColor,
    [],
  )

  React.useEffect(() => {
    if (isOpen && shouldScaleBackground) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
      const wrapper =
        (document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement) ||
        (document.querySelector('[vaul-drawer-wrapper]') as HTMLElement)

      if (!wrapper) return

      chain(
        setBackgroundColorOnScale && !noBodyStyles
          ? assignStyle(document.body, { background: 'black' })
          : noop,
        assignStyle(wrapper, {
          transformOrigin: isVertical(direction) ? 'top' : 'left',
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        }),
      )

      const wrapperStylesCleanup = assignStyle(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        ...(isVertical(direction)
          ? {
              transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
            }
          : {
              transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
            }),
      })

      return () => {
        wrapperStylesCleanup()
        timeoutIdRef.current = window.setTimeout(() => {
          if (initialBackgroundColor) {
            document.body.style.background = initialBackgroundColor
          } else {
            document.body.style.removeProperty('background')
          }
        }, TRANSITIONS.DURATION * 1000)
      }
    }
  }, [isOpen, shouldScaleBackground, initialBackgroundColor])
}

export function useSnapPoints({
  activeSnapPointProp,
  setActiveSnapPointProp,
  snapPoints,
  drawerRef,
  overlayRef,
  fadeFromIndex,
  onSnapPointChange,
  direction = 'bottom',
  container,
  snapToSequentialPoint,
}: {
  activeSnapPointProp?: number | string | null
  setActiveSnapPointProp?(snapPoint: number | null | string): void
  snapPoints?: (number | string)[]
  fadeFromIndex?: number
  drawerRef: React.RefObject<HTMLDivElement>
  overlayRef: React.RefObject<HTMLDivElement>
  onSnapPointChange(activeSnapPointIndex: number): void
  direction?: DrawerDirection
  container?: HTMLElement | null | undefined
  snapToSequentialPoint?: boolean
}) {
  const [activeSnapPoint, setActiveSnapPoint] = useControllableState<
    string | number | null
  >({
    prop: activeSnapPointProp,
    defaultProp: snapPoints?.[0],
    onChange: setActiveSnapPointProp,
  })

  const [windowDimensions, setWindowDimensions] = React.useState(
    typeof window !== 'undefined'
      ? {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        }
      : undefined,
  )

  React.useEffect(() => {
    function onResize() {
      setWindowDimensions({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isLastSnapPoint = React.useMemo(
    () => activeSnapPoint === snapPoints?.[snapPoints.length - 1] || null,
    [snapPoints, activeSnapPoint],
  )

  const activeSnapPointIndex = React.useMemo(
    () =>
      snapPoints?.findIndex((snapPoint) => snapPoint === activeSnapPoint) ??
      null,
    [snapPoints, activeSnapPoint],
  )

  const shouldFade =
    (snapPoints &&
      snapPoints.length > 0 &&
      (fadeFromIndex || fadeFromIndex === 0) &&
      !Number.isNaN(fadeFromIndex) &&
      snapPoints[fadeFromIndex] === activeSnapPoint) ||
    !snapPoints

  const snapPointsOffset = React.useMemo(() => {
    const containerSize = container
      ? {
          width: container.getBoundingClientRect().width,
          height: container.getBoundingClientRect().height,
        }
      : typeof window !== 'undefined'
        ? { width: window.innerWidth, height: window.innerHeight }
        : { width: 0, height: 0 }

    return (
      snapPoints?.map((snapPoint) => {
        const isPx = typeof snapPoint === 'string'
        let snapPointAsNumber = 0

        if (isPx) {
          snapPointAsNumber = Number.parseInt(snapPoint, 10)
        }

        if (isVertical(direction)) {
          const height = isPx
            ? snapPointAsNumber
            : windowDimensions
              ? snapPoint * containerSize.height
              : 0

          if (windowDimensions) {
            return direction === 'bottom'
              ? containerSize.height - height
              : -containerSize.height + height
          }

          return height
        }
        const width = isPx
          ? snapPointAsNumber
          : windowDimensions
            ? snapPoint * containerSize.width
            : 0

        if (windowDimensions) {
          return direction === 'right'
            ? containerSize.width - width
            : -containerSize.width + width
        }

        return width
      }) ?? []
    )
  }, [snapPoints, windowDimensions, container])

  const activeSnapPointOffset = React.useMemo(
    () =>
      activeSnapPointIndex !== null
        ? snapPointsOffset?.[activeSnapPointIndex]
        : null,
    [snapPointsOffset, activeSnapPointIndex],
  )

  const snapToPoint = React.useCallback(
    (dimension: number) => {
      const newSnapPointIndex =
        snapPointsOffset?.findIndex(
          (snapPointDim) => snapPointDim === dimension,
        ) ?? null
      onSnapPointChange(newSnapPointIndex)

      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        transform: isVertical(direction)
          ? `translate3d(0, ${dimension}px, 0)`
          : `translate3d(${dimension}px, 0, 0)`,
      })

      if (
        snapPointsOffset &&
        newSnapPointIndex !== snapPointsOffset.length - 1 &&
        fadeFromIndex !== undefined &&
        newSnapPointIndex !== fadeFromIndex &&
        newSnapPointIndex < fadeFromIndex
      ) {
        set(overlayRef.current, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
          opacity: '0',
        })
      } else {
        set(overlayRef.current, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
          opacity: '1',
        })
      }

      setActiveSnapPoint(snapPoints?.[Math.max(newSnapPointIndex, 0)])
    },
    [
      drawerRef.current,
      snapPoints,
      snapPointsOffset,
      fadeFromIndex,
      overlayRef,
      setActiveSnapPoint,
    ],
  )

  React.useEffect(() => {
    if (activeSnapPoint || activeSnapPointProp) {
      const newIndex =
        snapPoints?.findIndex(
          (snapPoint) =>
            snapPoint === activeSnapPointProp || snapPoint === activeSnapPoint,
        ) ?? -1
      if (
        snapPointsOffset &&
        newIndex !== -1 &&
        typeof snapPointsOffset[newIndex] === 'number'
      ) {
        snapToPoint(snapPointsOffset[newIndex] as number)
      }
    }
  }, [
    activeSnapPoint,
    activeSnapPointProp,
    snapPoints,
    snapPointsOffset,
    snapToPoint,
  ])

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
    dismissible,
  }: {
    draggedDistance: number
    closeDrawer: () => void
    velocity: number
    dismissible: boolean
  }) {
    if (fadeFromIndex === undefined) return

    const currentPosition =
      direction === 'bottom' || direction === 'right'
        ? (activeSnapPointOffset ?? 0) - draggedDistance
        : (activeSnapPointOffset ?? 0) + draggedDistance
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1
    const isFirst = activeSnapPointIndex === 0
    const hasDraggedUp = draggedDistance > 0

    if (isOverlaySnapPoint) {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      })
    }

    if (!snapToSequentialPoint && velocity > 2 && !hasDraggedUp) {
      if (dismissible) closeDrawer()
      else snapToPoint(snapPointsOffset[0]!) // snap to initial point
      return
    }

    if (
      !snapToSequentialPoint &&
      velocity > 2 &&
      hasDraggedUp &&
      snapPointsOffset &&
      snapPoints
    ) {
      snapToPoint(snapPointsOffset[snapPoints.length - 1] as number)
      return
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number') return prev

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition)
        ? curr
        : prev
    })

    const dim = isVertical(direction) ? window.innerHeight : window.innerWidth
    if (
      velocity > VELOCITY_THRESHOLD &&
      Math.abs(draggedDistance) < dim * 0.4
    ) {
      const dragDirection = hasDraggedUp ? 1 : -1 // 1 = up, -1 = down

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint && snapPoints) {
        //FIX:
        snapToPoint(snapPointsOffset[snapPoints.length - 1]!)
        return
      }

      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer()
      }

      if (activeSnapPointIndex === null) return

      //FIX:
      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]!)
      return
    }

    snapToPoint(closestSnapPoint)
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    if (!activeSnapPointOffset || !snapPointsOffset.length) return
    const newValue =
      direction === 'bottom' || direction === 'right'
        ? activeSnapPointOffset - draggedDistance
        : activeSnapPointOffset + draggedDistance

    // Don't do anything if we exceed the last(biggest) snap point
    if (
      (direction === 'bottom' || direction === 'right') &&
      newValue < snapPointsOffset[snapPointsOffset.length - 1]!
    ) {
      return
    }
    if (
      (direction === 'top' || direction === 'left') &&
      newValue > snapPointsOffset[snapPointsOffset.length - 1]!
    ) {
      return
    }

    set(drawerRef.current, {
      transform: isVertical(direction)
        ? `translate3d(0, ${newValue}px, 0)`
        : `translate3d(${newValue}px, 0, 0)`,
    })
  }

  function getPercentageDragged(
    absDraggedDistance: number,
    isDraggingDown: boolean,
  ) {
    if (
      !snapPoints ||
      typeof activeSnapPointIndex !== 'number' ||
      !snapPointsOffset ||
      fadeFromIndex === undefined
    )
      return null

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) return 1
    if (!shouldFade && !isOverlaySnapPoint) return null

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint
      ? activeSnapPointIndex + 1
      : activeSnapPointIndex - 1

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset[targetSnapPointIndex]! -
        snapPointsOffset[targetSnapPointIndex - 1]!
      : snapPointsOffset[targetSnapPointIndex + 1]! -
        snapPointsOffset[targetSnapPointIndex]!

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance)

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged
    } else {
      return percentageDragged
    }
  }

  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    setActiveSnapPoint,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset,
  }
}
