import React from 'react'

import { useComputedTimeoutTransition } from '../use-computed-timeout-transition'

/** Return value of {@link useOnOpenChange}. */
export interface IUseOnOpenChangeReturn<T extends React.RefObject<HTMLElement | null>> {
  /** Callback to toggle or set the open state. */
  onOpenChange: (state: boolean) => void
  /** Whether the target is currently open. */
  open: boolean
  /** The forwarded ref. */
  ref: T
}

/**
 * Manage open/close state with scroll-locking and CSS-transition-aware timing.
 *
 * Synchronises an optional controlled `openProp` with internal state,
 * locks `document.body` scroll while open, and waits for the element's
 * CSS transition to finish before unlocking.
 */
export function useOnOpenChange<T extends React.RefObject<HTMLElement | null>>(
  ref: T,
  openProp?: boolean,
  onOpenChange?: (state: boolean) => void,
): IUseOnOpenChangeReturn<T> {
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const handleOpenChange = React.useCallback(
    (state: boolean) => {
      if (!ref.current) return
      if (state) {
        document.body.classList.add('scroll-locked')
        setTimeout(() => {
          setOpen(true)
          onOpenChange?.(true)
        }, 100)
      } else {
        useComputedTimeoutTransition(ref.current, () => {
          document.body.classList.remove('scroll-locked')
        })
        setOpen(false)
        onOpenChange?.(false)
      }
    },
    [onOpenChange, ref.current],
  )

  React.useEffect(() => {
    if (!ref.current) return
    useComputedTimeoutTransition(ref.current, () => {
      document.body.classList.toggle('scroll-locked', open)
    })

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }
  }, [handleOpenChange, open, openProp, ref.current])

  return {
    onOpenChange: handleOpenChange,
    open,
    ref,
  }
}
