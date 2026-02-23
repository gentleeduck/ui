import * as React from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import { createContextScope, type Scope } from '../libs/create-context'
import * as PopperPrimitive from '../popper'
import { createPopperScope } from '../popper'

const TOOLTIP_NAME = 'Tooltip'

export type ScopedProps<P = {}> = P & { __scopeTooltip?: Scope }

export const [createTooltipContext, createTooltipScope] = createContextScope(TOOLTIP_NAME, [createPopperScope])
export const usePopperScope = createPopperScope()

/* -------------------------------------------------------------------------------------------------
 * TooltipProvider
 * -----------------------------------------------------------------------------------------------*/

const PROVIDER_NAME = 'TooltipProvider'
const DEFAULT_DELAY_DURATION = 700
export const TOOLTIP_OPEN = 'tooltip.open'

type TooltipProviderContextValue = {
  isOpenDelayedRef: React.RefObject<boolean>
  delayDuration: number
  onOpen(): void
  onClose(): void
  onPointerInTransitChange(inTransit: boolean): void
  isPointerInTransitRef: React.RefObject<boolean>
  disableHoverableContent: boolean
}

export const [TooltipProviderContextProvider, useTooltipProviderContext] =
  createTooltipContext<TooltipProviderContextValue>(PROVIDER_NAME)

export interface TooltipProviderProps {
  children: React.ReactNode
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   * @defaultValue 700
   */
  delayDuration?: number
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean
}

export const TooltipProvider: React.FC<TooltipProviderProps> = (props: ScopedProps<TooltipProviderProps>) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children,
  } = props
  const isOpenDelayedRef = React.useRef(true)
  const isPointerInTransitRef = React.useRef(false)
  const skipDelayTimerRef = React.useRef(0)

  React.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current
    return () => window.clearTimeout(skipDelayTimer)
  }, [])

  return (
    <TooltipProviderContextProvider
      scope={__scopeTooltip}
      isOpenDelayedRef={isOpenDelayedRef}
      delayDuration={delayDuration}
      onOpen={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current)
        isOpenDelayedRef.current = false
      }, [])}
      onClose={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current)
        skipDelayTimerRef.current = window.setTimeout(() => (isOpenDelayedRef.current = true), skipDelayDuration)
      }, [skipDelayDuration])}
      isPointerInTransitRef={isPointerInTransitRef}
      onPointerInTransitChange={React.useCallback((inTransit: boolean) => {
        isPointerInTransitRef.current = inTransit
      }, [])}
      disableHoverableContent={disableHoverableContent}>
      {children}
    </TooltipProviderContextProvider>
  )
}

TooltipProvider.displayName = PROVIDER_NAME

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

type TooltipTriggerElement = React.ComponentRef<'button'>

type TooltipContextValue = {
  contentId: string
  open: boolean
  stateAttribute: 'closed' | 'delayed-open' | 'instant-open'
  trigger: TooltipTriggerElement | null
  onTriggerChange(trigger: TooltipTriggerElement | null): void
  onTriggerEnter(): void
  onTriggerLeave(): void
  onOpen(): void
  onClose(): void
  disableHoverableContent: boolean
}

export const [TooltipContextProvider, useTooltipContext] = createTooltipContext<TooltipContextValue>(TOOLTIP_NAME)

export interface TooltipProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened. This will
   * override the prop with the same name passed to Provider.
   * @defaultValue 700
   */
  delayDuration?: number
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean
}

export const Tooltip: React.FC<TooltipProps> = (props: ScopedProps<TooltipProps>) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp,
  } = props
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip)
  const popperScope = usePopperScope(__scopeTooltip)
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null)
  const contentId = useId()
  const openTimerRef = React.useRef(0)
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent
  const delayDuration = delayDurationProp ?? providerContext.delayDuration
  const wasOpenDelayedRef = React.useRef(false)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open) => {
      if (open) {
        providerContext.onOpen()

        // as `onChange` is called within a lifecycle method we
        // avoid dispatching via `dispatchDiscreteCustomEvent`.
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
      } else {
        providerContext.onClose()
      }
      onOpenChange?.(open)
    },
    caller: TOOLTIP_NAME,
  })
  const stateAttribute = React.useMemo(() => {
    return open ? (wasOpenDelayedRef.current ? 'delayed-open' : 'instant-open') : 'closed'
  }, [open])

  const handleOpen = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current)
    openTimerRef.current = 0
    wasOpenDelayedRef.current = false
    setOpen(true)
  }, [setOpen])

  const handleClose = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current)
    openTimerRef.current = 0
    setOpen(false)
  }, [setOpen])

  const handleDelayedOpen = React.useCallback(() => {
    window.clearTimeout(openTimerRef.current)
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true
      setOpen(true)
      openTimerRef.current = 0
    }, delayDuration)
  }, [delayDuration, setOpen])

  React.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current)
        openTimerRef.current = 0
      }
    }
  }, [])

  return (
    <PopperPrimitive.Popper {...popperScope}>
      <TooltipContextProvider
        scope={__scopeTooltip}
        contentId={contentId}
        open={open}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onTriggerEnter={React.useCallback(() => {
          if (providerContext.isOpenDelayedRef.current) handleDelayedOpen()
          else handleOpen()
        }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen])}
        onTriggerLeave={React.useCallback(() => {
          if (disableHoverableContent) {
            handleClose()
          } else {
            // Clear the timer in case the pointer leaves the trigger before the tooltip is opened.
            window.clearTimeout(openTimerRef.current)
            openTimerRef.current = 0
          }
        }, [handleClose, disableHoverableContent])}
        onOpen={handleOpen}
        onClose={handleClose}
        disableHoverableContent={disableHoverableContent}>
        {children}
      </TooltipContextProvider>
    </PopperPrimitive.Popper>
  )
}

Tooltip.displayName = TOOLTIP_NAME
