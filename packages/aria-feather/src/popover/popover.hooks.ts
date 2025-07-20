import { useAtom, useSetAtom } from '@gentleduck/state/react'
import React from 'react'
import { PopoverContext } from './popover'
import { popoverOpen, popoverRefs } from './popover.atoms'

export function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error('Popover components must be wrapped in <Popover>')
  return ctx
}

export function usePopover({
  openProp,
  onOpenChange,
  skipDelayDuration,
  delayDuration,
  mouseEnter,
  mouseExist,
}: {
  openProp: boolean
  onOpenChange: (open: boolean) => void
  skipDelayDuration: number
  delayDuration: number
  mouseEnter: boolean
  mouseExist: boolean
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const arrowRef = React.useRef<HTMLDivElement>(null)
  const [openValue, setOpen] = useAtom(popoverOpen)
  const setRefs = useSetAtom(popoverRefs)

  React.useLayoutEffect(() => {
    if (!wrapperRef.current) return
    triggerRef.current = wrapperRef?.current.querySelector('[duck-popover-trigger]')
    contentRef.current = wrapperRef?.current.querySelector('[duck-popover-content]')
    arrowRef.current = wrapperRef?.current.querySelector('[duck-popover-arrow]')
    if (!triggerRef.current || !contentRef.current) return

    setRefs({
      trigger: triggerRef.current,
      content: contentRef.current,
      wrapper: wrapperRef.current,
      arrow: arrowRef.current,
    })
    return () => setRefs({ trigger: null, content: null, wrapper: null, arrow: null })
  }, [])

  React.useEffect(() => {
    if (
      // mouseEnter || mouseExist ||
      openProp === undefined
    )
      return
    setOpen(openProp)
    onOpenChange?.(openProp)
  }, [openProp])

  function handleOpenChange(state: boolean) {
    setOpen(() => {
      onOpenChange?.(state)
      console.log(state)
      return state
    })
  }

  React.useEffect(() => {
    // if (mouseEnter || mouseExist) return

    const handleToggle = () => {
      setOpen((s) => {
        onOpenChange?.(!s)
        return !s
      })
    }

    const handleClose = () => handleOpenChange(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
        triggerRef.current?.focus()
      }
    }

    const onClick = (e: MouseEvent) => {
      if (triggerRef.current.contains(e.target as Node)) return
      const clickedInside = contentRef.current?.contains(e.target as Node)
      if (!clickedInside) {
        handleClose()
      }
    }
    triggerRef.current?.addEventListener('click', handleToggle)
    contentRef.current?.addEventListener('keydown', handleEscape)
    document.addEventListener('click', onClick)

    return () => {
      triggerRef.current?.removeEventListener('click', handleToggle)
      contentRef.current?.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', onClick)
    }
  }, [openValue])

  React.useEffect(() => {
    if (!mouseEnter || !mouseExist) return
    let openTimer: NodeJS.Timeout | null = null
    let closeTimer: NodeJS.Timeout | null = null

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
    }
  }, [openValue])

  return {
    open: openValue,
    onOpenChange: handleOpenChange,
    wrapperRef,
    triggerRef,
    contentRef,
    arrowRef,
  }
}
