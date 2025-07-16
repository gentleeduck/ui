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

  React.useEffect(() => {
    if (mouseEnter || mouseExist || openProp === undefined) return
    if (lockScroll) lockScrollbar(open)

    const state = openProp === true ? true : false
    handleOpenChange(state)
  }, [openProp])

  function handleOpenChange(state: boolean) {
    if (!contentRef.current) return

    try {
      // if (modal) {
      state ? contentRef.current.showPopover() : contentRef.current.hidePopover()
      // } else {
      //   state ? contentRef.current.showModal() : contentRef.current.close()
      // }
    } catch (e) {
      console.warn('Popover failed to toggle', e)
    }

    setOpen(state)
    onOpenChange?.(state)
  }

  React.useEffect(() => {
    if (mouseEnter || mouseExist) return
    if (lockScroll) lockScrollbar(open)

    function handleClose(event: Event & { newState: 'open' | 'close' }) {
      const newState = event.newState
      console.log(newState)
      handleOpenChange(event.newState === 'open')
    }

    contentRef.current?.addEventListener('toggle', handleClose)
    // contentRef.current?.addEventListener('beforetoggle', handleClose)

    return () => {
      contentRef.current?.removeEventListener('toggle', handleClose)
      // contentRef.current?.removeEventListener('beforetoggle', handleClose)
    }
  }, [])

  React.useEffect(() => {
    // If it's a controlled component, we don't need to do anything
    if (openProp === true || openProp === false) return

    let openTimer = null
    let closeTimer = null

    function openAfterDelay() {
      clearTimeout(closeTimer)
      openTimer = setTimeout(() => handleOpenChange(true), delayDuration)
    }

    function closeAfterDelay() {
      clearTimeout(openTimer)
      closeTimer = setTimeout(() => handleOpenChange(false), skipDelayDuration)
    }

    if (mouseEnter) {
      for (const elm of [triggerRef.current, contentRef.current]) {
        elm?.addEventListener('mouseover', openAfterDelay)
        if (mouseExist) {
          elm?.addEventListener('mouseout', closeAfterDelay)
        }
      }
    }

    return () => {
      if (mouseEnter) {
        for (const elm of [triggerRef.current, contentRef.current]) {
          elm?.removeEventListener('mouseover', openAfterDelay)
          if (mouseExist) {
            elm?.removeEventListener('mouseout', closeAfterDelay)
          }
        }
      }
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
