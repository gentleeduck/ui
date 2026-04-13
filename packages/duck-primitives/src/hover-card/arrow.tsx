import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { type ScopedProps, usePopperScope } from './hover-card'

const ARROW_NAME = 'HoverCardArrow'

type HoverCardArrowElement = React.ComponentRef<typeof PopperPrimitive.Arrow>
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>
export interface IHoverCardArrowProps extends PopperArrowProps {}

/** Renders the hover card arrow indicator, delegating to PopperArrow for positioning. */
export const HoverCardArrow = React.forwardRef<HoverCardArrowElement, IHoverCardArrowProps>(
  (props: ScopedProps<IHoverCardArrowProps>, forwardedRef) => {
    const { __scopeHoverCard, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeHoverCard)
    return <PopperPrimitive.Arrow data-slot="hover-card-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
  },
)

HoverCardArrow.displayName = ARROW_NAME
