import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import * as PopperPrimitive from '../popper'
import { useTooltipProviderContext } from './provider'
import { createTooltipContext, type ScopedProps, TOOLTIP_OPEN, usePopperScope } from './tooltip.libs'

export { createTooltipScope, type ScopedProps, TOOLTIP_OPEN, usePopperScope } from './tooltip.libs'

const TOOLTIP_NAME = 'Tooltip'

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
  dir: IDirection.Kind
}

export const [TooltipContextProvider, useTooltipContext] = createTooltipContext<TooltipContextValue>(TOOLTIP_NAME)

export interface ITooltipProps {
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
  dir?: IDirection.Kind
}

export const Tooltip: React.FC<ITooltipProps> = (props: ScopedProps<ITooltipProps>) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp,
    dir,
  } = props
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip)
  const popperScope = usePopperScope(__scopeTooltip)
  const direction = useDirection(dir)
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
        disableHoverableContent={disableHoverableContent}
        dir={direction}>
        {children}
      </TooltipContextProvider>
    </PopperPrimitive.Popper>
  )
}

Tooltip.displayName = TOOLTIP_NAME
