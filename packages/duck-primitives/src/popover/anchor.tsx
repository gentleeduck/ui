import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { type ScopedProps, usePopoverContext, usePopperScope } from './popover'

const ANCHOR_NAME = 'PopoverAnchor'

export interface IPopoverAnchorProps extends React.ComponentPropsWithRef<typeof PopperPrimitive.PopperAnchor> {}

/**
 * Registers a custom anchor element with the popover context.
 * When present, the trigger will not act as the positioning anchor.
 */
export const PopoverAnchor = React.forwardRef<
  React.ComponentRef<typeof PopperPrimitive.PopperAnchor>,
  ScopedProps<IPopoverAnchorProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...anchorProps } = props
  const context = usePopoverContext(ANCHOR_NAME, __scopePopover)
  const popperScope = usePopperScope(__scopePopover)
  const { onCustomAnchorAdd, onCustomAnchorRemove } = context

  // Notify the popover context that a custom anchor is present
  React.useEffect(() => {
    onCustomAnchorAdd()
    return () => onCustomAnchorRemove()
  }, [onCustomAnchorAdd, onCustomAnchorRemove])

  return (
    <PopperPrimitive.PopperAnchor data-slot="popover-anchor" {...popperScope} {...anchorProps} ref={forwardedRef} />
  )
})

PopoverAnchor.displayName = ANCHOR_NAME
