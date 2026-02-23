import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import * as PopperPrimitive from '../popper'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useHoverCardContext, usePopperScope } from './hover-card'

/* -------------------------------------------------------------------------------------------------
 * HoverCardTrigger
 * -------------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'HoverCardTrigger'

type HoverCardTriggerElement = React.ComponentRef<typeof Primitive.a>
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>
export interface HoverCardTriggerProps extends PrimitiveLinkProps {}

/** Anchor element that opens the hover card on pointer enter and focus. */
export const HoverCardTrigger = React.forwardRef<HoverCardTriggerElement, HoverCardTriggerProps>(
  (props: ScopedProps<HoverCardTriggerProps>, forwardedRef) => {
    const { __scopeHoverCard, ...triggerProps } = props
    const context = useHoverCardContext(TRIGGER_NAME, __scopeHoverCard)
    const popperScope = usePopperScope(__scopeHoverCard)
    return (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        <Primitive.a
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onPointerEnter={composeEventHandlers(props.onPointerEnter, excludeTouch(context.onOpen))}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, excludeTouch(context.onClose))}
          onFocus={composeEventHandlers(props.onFocus, context.onOpen)}
          onBlur={composeEventHandlers(props.onBlur, context.onClose)}
          // prevent focus event on touch devices
          onTouchStart={composeEventHandlers(props.onTouchStart, (event) => event.preventDefault())}
        />
      </PopperPrimitive.Anchor>
    )
  },
)

HoverCardTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * excludeTouch
 * -------------------------------------------------------------------------------------------------*/

/** Wraps an event handler so it is skipped for touch pointer events. */
export function excludeTouch<E>(eventHandler: () => void) {
  return (event: React.PointerEvent<E>) => (event.pointerType === 'touch' ? undefined : eventHandler())
}
