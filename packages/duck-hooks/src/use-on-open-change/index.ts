import * as React from 'react'
import { scheduleTransitionTimeout } from '../schedule-transition-timeout'
import type { IUseOnOpenChange } from './use-on-open-change.types'

export type { IUseOnOpenChange } from './use-on-open-change.types'

/** ms delay before the open transition starts (matches typical enter animation). */
const OPEN_DELAY_MS = 100

/** Body class toggled while a portal/dialog is open. Consumers can target this in CSS. */
const SCROLL_LOCK_CLASS = 'scroll-locked'

/**
 * Open/close state with body-scroll lock that waits for the element's
 * CSS transition to finish before unlocking.
 */
export function useOnOpenChange(
  ref: React.RefObject<HTMLElement | null>,
  openProp?: boolean,
  onOpenChange?: (state: boolean) => void,
): IUseOnOpenChange.IReturn {
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  // Tracks any pending timers so we can cancel them on unmount or before
  // scheduling a new one. Stored in refs because they are not reactive.
  const openDelayTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionCleanupRef = React.useRef<(() => void) | null>(null)

  const cancelPending = React.useCallback(() => {
    if (openDelayTimeoutRef.current !== null) {
      clearTimeout(openDelayTimeoutRef.current)
      openDelayTimeoutRef.current = null
    }
    if (transitionCleanupRef.current !== null) {
      transitionCleanupRef.current()
      transitionCleanupRef.current = null
    }
  }, [])

  const handleOpenChange = React.useCallback(
    (state: boolean) => {
      if (!ref.current) return
      cancelPending()

      if (state) {
        document.body.classList.add(SCROLL_LOCK_CLASS)
        openDelayTimeoutRef.current = setTimeout(() => {
          openDelayTimeoutRef.current = null
          setOpen(true)
          onOpenChange?.(true)
        }, OPEN_DELAY_MS)
      } else {
        transitionCleanupRef.current = scheduleTransitionTimeout(ref.current, () => {
          transitionCleanupRef.current = null
          document.body.classList.remove(SCROLL_LOCK_CLASS)
        })
        setOpen(false)
        onOpenChange?.(false)
      }
    },
    [onOpenChange, ref, cancelPending],
  )

  // Sync local `open` state with the controlled `openProp`. Gate via a
  // prev-value ref so parent re-renders that don't actually change `openProp`
  // do not re-toggle the body class or re-schedule timers. The ref starts as
  // a sentinel (`null`) so the first commit always fires once.
  const prevOpenPropRef = React.useRef<boolean | null>(null)
  React.useEffect(() => {
    const isControlled = typeof openProp === 'boolean'
    if (!isControlled) {
      prevOpenPropRef.current = null
      return
    }
    if (prevOpenPropRef.current === openProp) return
    prevOpenPropRef.current = openProp
    handleOpenChange(openProp)
  }, [openProp, handleOpenChange])

  // Cancel any pending timers on unmount to avoid setState-after-unmount.
  React.useEffect(() => {
    return () => {
      cancelPending()
    }
  }, [cancelPending])

  return {
    onOpenChange: handleOpenChange,
    open,
    ref,
  }
}
