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
  id,
}: PopoverProps & { id: string }) {
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)

  // Use openProp only as initial state
  const [open, setOpen] = React.useState<boolean>(() => openProp ?? false)

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

    wrapperRef.current?.setAttribute('data-open', String(state))
    triggerRef.current?.setAttribute('data-open', String(state))
    contentRef.current?.setAttribute('data-open', String(state))
  }

  function handleCancel(e: Event) {
    e.preventDefault()
  }

  React.useEffect(() => {
    // Apply initial state only once
    handleOpenChange(open)

    // TEST:
    // By removing this id we make sure it's fully controlled by us
    contentRef.current.id = openProp ? null : id

    contentRef.current?.addEventListener('cancel', handleCancel)
    return () => {
      contentRef.current?.removeEventListener('cancel', handleCancel)
    }
  }, [])

  React.useEffect(() => {
    if (mouseEnter || mouseExist) return

    if (lockScroll) lockScrollbar(open)

    function handleClose(event: Event & { newState: 'open' | 'close' }) {
      if (modal) {
        handleOpenChange(false)
      } else {
        handleOpenChange(event.newState === 'open')
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
  }, [open, lockScroll, modal])

  React.useEffect(() => {
    if (!mouseEnter) return

    let openTimer: any = null
    let closeTimer: any = null

    function openAfterDelay() {
      clearTimeout(closeTimer)
      openTimer = setTimeout(() => handleOpenChange(true), delayDuration)
    }

    function closeAfterDelay() {
      clearTimeout(openTimer)
      closeTimer = setTimeout(() => handleOpenChange(false), skipDelayDuration)
    }

    for (const elm of [triggerRef.current, contentRef.current]) {
      elm?.addEventListener('mouseover', openAfterDelay)
      if (mouseExist) {
        elm?.addEventListener('mouseout', closeAfterDelay)
      }
    }

    return () => {
      for (const elm of [triggerRef.current, contentRef.current]) {
        elm?.removeEventListener('mouseover', openAfterDelay)
        if (mouseExist) {
          elm?.removeEventListener('mouseout', closeAfterDelay)
        }
      }
      cleanLockScrollbar()
    }
  }, [mouseEnter, mouseExist, delayDuration, skipDelayDuration])

  return {
    triggerRef,
    contentRef,
    open,
    onOpenChange: handleOpenChange,
  }
}
