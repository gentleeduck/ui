import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { useVisuallyHiddenContentContext } from './content'
import { type ScopedProps, usePopperScope } from './tooltip.libs'

const ARROW_NAME = 'TooltipArrow'

type TooltipArrowElement = React.ComponentRef<typeof PopperPrimitive.PopperAnchor>
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>
export interface ITooltipArrowProps extends PopperArrowProps {}

export const TooltipArrow = React.forwardRef<TooltipArrowElement, ITooltipArrowProps>(
  (props: ScopedProps<ITooltipArrowProps>, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeTooltip)
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(ARROW_NAME, __scopeTooltip)
    // if the arrow is inside the `VisuallyHidden`, we don't want to render it all to
    // prevent issues in positioning the arrow due to the duplicate
    return visuallyHiddenContentContext.isInside ? null : (
      <PopperPrimitive.PopperAnchor data-slot="tooltip-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
    )
  },
)

TooltipArrow.displayName = ARROW_NAME
