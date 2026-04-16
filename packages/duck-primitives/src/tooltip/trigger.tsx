import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import * as PopperPrimitive from '../popper'
import { Primitive } from '../primitive-elements'
import { useTooltipProviderContext } from './provider'
import { useTooltipContext } from './tooltip'
import { usePopperScope } from './tooltip.libs'
import type { ITooltip } from './tooltip.types'

const TRIGGER_NAME = 'TooltipTrigger'

type TooltipTriggerElement = React.ComponentRef<typeof Primitive.button>

export const TooltipTrigger = React.forwardRef<TooltipTriggerElement, ITooltip.ITriggerProps>(
  (props: ITooltip.IScoped<ITooltip.ITriggerProps>, forwardedRef) => {
    const { __scopeTooltip, disableCloseOnClick = false, ...triggerProps } = props
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip)
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip)
    const popperScope = usePopperScope(__scopeTooltip)
    const ref = React.useRef<TooltipTriggerElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange)
    const isPointerDownRef = React.useRef(false)
    const hasPointerMoveOpenedRef = React.useRef(false)
    const handlePointerUp = React.useCallback(() => (isPointerDownRef.current = false), [])

    React.useEffect(() => {
      return () => document.removeEventListener('pointerup', handlePointerUp)
    }, [handlePointerUp])

    return (
      <PopperPrimitive.PopperAnchor asChild {...popperScope}>
        <Primitive.button
          {...(disableCloseOnClick ? {} : { 'data-slot': 'tooltip-trigger', 'data-state': context.stateAttribute })}
          {...(!disableCloseOnClick ? {} : { 'data-tooltip-state': context.stateAttribute })}
          // We purposefully avoid adding `type=button` here because tooltip triggers are also
          // commonly anchors and the anchor `type` attribute signifies MIME type.
          aria-describedby={context.open ? context.contentId : undefined}
          dir={context.dir}
          {...triggerProps}
          ref={composedRefs}
          onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === 'touch') return
            if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
              context.onTriggerEnter()
              hasPointerMoveOpenedRef.current = true
            }
          })}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave()
            hasPointerMoveOpenedRef.current = false
          })}
          onPointerDown={composeEventHandlers(props.onPointerDown, () => {
            if (!disableCloseOnClick && context.open) {
              context.onClose()
            }
            isPointerDownRef.current = true
            document.addEventListener('pointerup', handlePointerUp, { once: true })
          })}
          onFocus={composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen()
          })}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          {...(disableCloseOnClick ? {} : { onClick: composeEventHandlers(props.onClick, context.onClose) })}
        />
      </PopperPrimitive.PopperAnchor>
    )
  },
)

TooltipTrigger.displayName = TRIGGER_NAME
