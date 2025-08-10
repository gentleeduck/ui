'use client'
import React from 'react'
import { DialogContext } from './dialog'
import { cleanLockScrollbar, lockScrollbar } from './dialog.libs'
import type { DialogContextType, DialogProps } from './dialog.types'

export function useDialogContext(name: string = 'Dialog'): DialogContextType {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error(`useDialogContext must be used within a ${name}`)
  }
  return context
}

export function useDialog({ open: openProp, onOpenChange, lockScroll, modal, wrapperRef }: DialogProps) {
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  function handleOpenChange(state: boolean) {
    if (!contentRef.current) return

    try {
      if (modal) {
        state ? contentRef.current.showModal() : contentRef.current.close()
      } else {
        state ? contentRef.current.show() : contentRef.current.close()
      }
    } catch (e) {
      console.warn('Dialog failed to toggle', e)
    }

    setOpen(state)
    onOpenChange?.(state)
    wrapperRef.current?.setAttribute('data-open', String(state))
    triggerRef.current?.setAttribute('data-open', String(state))
    contentRef.current?.setAttribute('data-open', String(state))
  }

  React.useEffect(() => {
    if (lockScroll) lockScrollbar(open)

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }

    function handleClose() {
      handleOpenChange(false)
    }

    contentRef.current?.addEventListener('cancel', handleClose)

    return () => {
      contentRef.current?.removeEventListener('cancel', handleClose)
      cleanLockScrollbar()
    }
  }, [open, openProp, onOpenChange])

  return {
    triggerRef,
    contentRef,
    open,
    onOpenChange: handleOpenChange,
  }
}
