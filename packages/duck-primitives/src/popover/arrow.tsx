import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { usePopperScope } from './popover'
import type { IPopover } from './popover.types'

const ARROW_NAME = 'PopoverArrow'

export const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopperPrimitive.PopperAnchor>,
  IPopover.IScoped<IPopover.IArrowProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...arrowProps } = props
  const popperScope = usePopperScope(__scopePopover)

  return <PopperPrimitive.PopperAnchor data-slot="popover-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
})

PopoverArrow.displayName = ARROW_NAME
