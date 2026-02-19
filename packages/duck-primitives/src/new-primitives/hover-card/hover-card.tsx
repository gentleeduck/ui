import * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import { createContextScope, type Scope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -------------------------------------------------------------------------------------------------*/

const HOVERCARD_NAME = 'HoverCard'

export type ScopedProps<P> = P & { __scopeHoverCard?: Scope }

export const [createHoverCardContext, createHoverCardScope] = createContextScope(HOVERCARD_NAME, [createPopperScope])

export const usePopperScope = createPopperScope()

type HoverCardContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  onOpen(): void
  onClose(): void
  onDismiss(): void
  hasSelectionRef: React.MutableRefObject<boolean>
  isPointerDownOnContentRef: React.MutableRefObject<boolean>
}

export const [HoverCardProvider, useHoverCardContext] = createHoverCardContext<HoverCardContextValue>(HOVERCARD_NAME)

export interface HoverCardProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
}

/** Root HoverCard component that manages open/close state and timing delays. */
export const HoverCard: React.FC<HoverCardProps> = (props: ScopedProps<HoverCardProps>) => {
  const {
    __scopeHoverCard,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
  } = props
  const popperScope = usePopperScope(__scopeHoverCard)
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

  // cleanup any queued state updates on unmount
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
      isPointerDownOnContentRef={isPointerDownOnContentRef}>
      <PopperPrimitive.Root {...popperScope}>{children}</PopperPrimitive.Root>
    </HoverCardProvider>
  )
}

HoverCard.displayName = HOVERCARD_NAME
