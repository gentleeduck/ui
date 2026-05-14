import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { createContextScope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'
import type { IHoverCard } from './hover-card.types'

const HOVERCARD_NAME = 'HoverCard'

export const [createHoverCardContext, createHoverCardScope] = createContextScope(HOVERCARD_NAME, [createPopperScope])

export const usePopperScope = createPopperScope()

export const [HoverCardProvider, useHoverCardContext] = createHoverCardContext<IHoverCard.IContext>(HOVERCARD_NAME)

export const HoverCard: React.FC<IHoverCard.IProps> = (props: IHoverCard.IScoped<IHoverCard.IProps>) => {
  const {
    __scopeHoverCard,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
    dir,
  } = props
  const popperScope = usePopperScope(__scopeHoverCard)
  const direction = useDirection(dir)
  const openTimerRef = React.useRef(0)
  const closeTimerRef = React.useRef(0)
  const hasSelectionRef = React.useRef(false)
  const isPointerDownOnContentRef = React.useRef(false)

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: HOVERCARD_NAME,
  })

  const handleOpen = React.useCallback(() => {
    clearTimeout(closeTimerRef.current)
    openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay)
  }, [openDelay, setOpen])

  const handleClose = React.useCallback(() => {
    clearTimeout(openTimerRef.current)
    if (!hasSelectionRef.current && !isPointerDownOnContentRef.current) {
      closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay)
    }
  }, [closeDelay, setOpen])

  const handleDismiss = React.useCallback(() => setOpen(false), [setOpen])

  React.useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current)
      clearTimeout(closeTimerRef.current)
    }
  }, [])

  return (
    <HoverCardProvider
      scope={__scopeHoverCard}
      open={open}
      onOpenChange={setOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      onDismiss={handleDismiss}
      hasSelectionRef={hasSelectionRef}
      isPointerDownOnContentRef={isPointerDownOnContentRef}
      dir={direction}>
      <PopperPrimitive.Root {...popperScope}>{children}</PopperPrimitive.Root>
    </HoverCardProvider>
  )
}

HoverCard.displayName = HOVERCARD_NAME
