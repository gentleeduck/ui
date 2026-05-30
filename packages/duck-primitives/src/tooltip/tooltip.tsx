import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { useId } from '../hooks/use-id'
import * as PopperPrimitive from '../popper'
import { useTooltipProviderContext } from './provider'
import { createTooltipContext, TOOLTIP_OPEN, usePopperScope } from './tooltip.libs'
import type { ITooltip } from './tooltip.types'

export { createTooltipScope, TOOLTIP_OPEN, usePopperScope } from './tooltip.libs'

const TOOLTIP_NAME = 'Tooltip'

export const [TooltipContextProvider, useTooltipContext] = createTooltipContext<ITooltip.IContext>(TOOLTIP_NAME)

export const Tooltip: React.FC<ITooltip.IProps> = (props: ITooltip.IScoped<ITooltip.IProps>) => {
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
  // Use a null sentinel rather than 0 because window.setTimeout in jsdom can return 0
  // as a legitimate timer id, which would be indistinguishable from "no timer".
  const openTimerRef = React.useRef<number | null>(null)
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent
  const delayDuration = delayDurationProp ?? providerContext.delayDuration
  const wasOpenDelayedRef = React.useRef(false)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open) => {
      if (open) {
        providerContext.onOpen()
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
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current)
    openTimerRef.current = null
    wasOpenDelayedRef.current = false
    setOpen(true)
  }, [setOpen])

  const handleClose = React.useCallback(() => {
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current)
    openTimerRef.current = null
    setOpen(false)
  }, [setOpen])

  const handleDelayedOpen = React.useCallback(() => {
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current)
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true
      setOpen(true)
      openTimerRef.current = null
    }, delayDuration)
  }, [delayDuration, setOpen])

  React.useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current)
        openTimerRef.current = null
      }
    }
  }, [])

  const onTriggerEnter = React.useCallback(() => {
    if (providerContext.isOpenDelayedRef.current) handleDelayedOpen()
    else handleOpen()
  }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen])

  const onTriggerLeave = React.useCallback(() => {
    if (disableHoverableContent) {
      handleClose()
    } else {
      if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [handleClose, disableHoverableContent])

  return (
    <PopperPrimitive.Popper {...popperScope}>
      <TooltipContextProvider
        scope={__scopeTooltip}
        contentId={contentId}
        open={open}
        stateAttribute={stateAttribute}
        trigger={trigger}
        onTriggerChange={setTrigger}
        onTriggerEnter={onTriggerEnter}
        onTriggerLeave={onTriggerLeave}
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
