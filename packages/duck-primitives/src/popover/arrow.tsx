import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { type ScopedProps, usePopperScope } from './popover'

const ARROW_NAME = 'PopoverArrow'

export interface IPopoverArrowProps extends React.ComponentPropsWithRef<typeof PopperPrimitive.PopperAnchor> {}

/** Renders the popover arrow indicator. Delegates to PopperArrow for positioning. */
export const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopperPrimitive.PopperAnchor>,
  ScopedProps<IPopoverArrowProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...arrowProps } = props
  const popperScope = usePopperScope(__scopePopover)

  return <PopperPrimitive.PopperAnchor data-slot="popover-arrow" {...popperScope} {...arrowProps} ref={forwardedRef} />
})

PopoverArrow.displayName = ARROW_NAME
