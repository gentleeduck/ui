import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import * as PopperPrimitive from '../popper'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePopperScope, useTooltipContext, useTooltipProviderContext } from './tooltip'

const TRIGGER_NAME = 'TooltipTrigger'

type TooltipTriggerElement = React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
export interface TooltipTriggerProps extends PrimitiveButtonProps {}

export const TooltipTrigger = React.forwardRef<TooltipTriggerElement, TooltipTriggerProps>(
  (props: ScopedProps<TooltipTriggerProps>, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props
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
          // We purposefully avoid adding `type=button` here because tooltip triggers are also
          // commonly anchors and the anchor `type` attribute signifies MIME type.
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.stateAttribute}
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
            if (context.open) {
              context.onClose()
            }
            isPointerDownRef.current = true
            document.addEventListener('pointerup', handlePointerUp, { once: true })
          })}
          onFocus={composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen()
          })}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          onClick={composeEventHandlers(props.onClick, context.onClose)}
        />
      </PopperPrimitive.PopperAnchor>
    )
  },
)

TooltipTrigger.displayName = TRIGGER_NAME
