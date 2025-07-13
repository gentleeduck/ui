import React from 'react'
import { cleanLockScrollbar, lockScrollbar } from '../dialog/dialog.libs'
import type { PopoverContextType } from './popover.types'
import { PopoverProps } from './popover.types'

export const PopoverContext = React.createContext<PopoverContextType | null>(null)

export function usePopoverContext(name: string = 'Popover'): PopoverContextType {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error(`usePopoverContext must be used within a ${name}`)
  }
  return context
}

export function usePopover({
  wrapperRef,
  open: openProp,
  onOpenChange,
  lockScroll,
  modal,
  mouseEnter,
  mouseExist,
  skipDelayDuration,
  delayDuration,
}: PopoverProps) {
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp)

  function handleOpenChange(state: boolean) {
    if (!contentRef.current) return

    try {
      state ? contentRef.current.showPopover() : contentRef.current.hidePopover()

      setOpen(state)
      onOpenChange?.(state)
      wrapperRef.current?.setAttribute('data-open', String(state))
      triggerRef.current?.setAttribute('data-open', String(state))
      contentRef.current?.setAttribute('data-open', String(state))
    } catch (e) {
      console.warn('Popover failed to toggle', e)
    }
  }

  function handleClose(event: Event & { newState: 'open' | 'close' }) {
    handleOpenChange(event.newState === 'open')
  }

  React.useEffect(() => {
    if (mouseEnter || mouseExist || openProp === undefined) return
    if (lockScroll) lockScrollbar(open)

    const state = openProp === true ? true : false
    handleOpenChange(state)
  }, [openProp])

  React.useEffect(() => {
    if (mouseEnter || mouseExist) return
    if (lockScroll) lockScrollbar(open)

    contentRef.current?.addEventListener('toggle', handleClose)

    return () => {
      contentRef.current?.removeEventListener('toggle', handleClose)
      cleanLockScrollbar()
    }
  }, [])

  return {
    triggerRef,
    contentRef,
    open,
    onOpenChange: handleOpenChange,
  }
}
