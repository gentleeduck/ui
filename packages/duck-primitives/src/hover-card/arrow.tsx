import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { usePopperScope } from './hover-card'
import type { IHoverCard } from './hover-card.types'

const ARROW_NAME = 'HoverCardArrow'

type HoverCardArrowElement = React.ComponentRef<typeof PopperPrimitive.Arrow>

/** Renders the hover card arrow indicator, delegating to PopperArrow for positioning. */
export const HoverCardArrow = React.forwardRef<HoverCardArrowElement, IHoverCard.IArrowProps>(
  (props: IHoverCard.IScoped<IHoverCard.IArrowProps>, forwardedRef) => {
    const { __scopeHoverCard, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeHoverCard)
    return <PopperPrimitive.Arrow data-slot="hover-card-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
  },
)

HoverCardArrow.displayName = ARROW_NAME
