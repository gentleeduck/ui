import React from 'react'
import { useComputedTimeoutTransition } from '../use-computed-timeout-transition'
import type { IUseOnOpenChange } from './use-on-open-change.types'

export type { IUseOnOpenChange } from './use-on-open-change.types'

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
): IUseOnOpenChange.IReturn<T> {
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
        // biome-ignore lint/correctness/useHookAtTopLevel: utility is misnamed — it schedules a timeout, not a hook
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
    // biome-ignore lint/correctness/useHookAtTopLevel: utility is misnamed — it schedules a timeout, not a hook
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
