import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { useVisuallyHiddenContentContext } from './content'
import { usePopperScope } from './tooltip.libs'
import type { ITooltip } from './tooltip.types'

const ARROW_NAME = 'TooltipArrow'

type TooltipArrowElement = React.ComponentRef<typeof PopperPrimitive.PopperAnchor>

export const TooltipArrow = React.forwardRef<TooltipArrowElement, ITooltip.IArrowProps>(
  (props: ITooltip.IScoped<ITooltip.IArrowProps>, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props
    const popperScope = usePopperScope(__scopeTooltip)
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(ARROW_NAME, __scopeTooltip)
    return visuallyHiddenContentContext.isInside ? null : (
      <PopperPrimitive.PopperAnchor data-slot="tooltip-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
    )
  },
)

TooltipArrow.displayName = ARROW_NAME
