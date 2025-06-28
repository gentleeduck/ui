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
  hoverable,
  skipDelayDuration,
  delayDuration,
}: PopoverProps & {
  wrapperRef: React.RefObject<HTMLDivElement>
}) {
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    triggerRef.current = wrapperRef.current.querySelector('[duck-popover-trigger]')
    contentRef.current = wrapperRef.current.querySelector('[duck-popover-content]')

    function handleClose(event: Event & { newState: 'open' | 'close' }) {
      if (modal) {
        handleOpenChange(false)
      } else {
        const newState = event.newState
        handleOpenChange(newState === 'open')
      }
    }

    contentRef.current?.addEventListener('close', handleClose)
    if (!modal) {
      contentRef.current?.addEventListener('beforetoggle', handleClose)
    }

    return () => {
      contentRef.current?.removeEventListener('close', handleClose)
      if (!modal) {
        contentRef.current?.removeEventListener('beforetoggle', handleClose)
      }
    }
  }, [])

  function handleOpenChange(state: boolean) {
    if (!contentRef.current) return

    try {
      if (modal) {
        state ? contentRef.current.showModal() : contentRef.current.close()
      } else {
        requestAnimationFrame(() => {
          state ? contentRef.current.showPopover() : contentRef.current.hidePopover()
        })
      }
    } catch (e) {
      console.warn('Popover failed to toggle', e)
    }

    setOpen(state)
    onOpenChange?.(state)
    contentRef.current?.setAttribute('data-open', String(state))
  }

  React.useEffect(() => {
    if (lockScroll) lockScrollbar(open)

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }

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

    if (hoverable) {
      for (const elm of [triggerRef.current, contentRef.current]) {
        elm?.addEventListener('mouseover', openAfterDelay)
        elm?.addEventListener('mouseout', closeAfterDelay)
      }
    }

    return () => {
      if (hoverable) {
        for (const elm of [triggerRef.current, contentRef.current]) {
          elm?.removeEventListener('mouseover', openAfterDelay)
          elm?.removeEventListener('mouseout', closeAfterDelay)
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
