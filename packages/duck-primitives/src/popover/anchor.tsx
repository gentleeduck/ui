import * as React from 'react'
import * as PopperPrimitive from '../popper'
import { usePopoverContext, usePopperScope } from './popover'
import type { IPopover } from './popover.types'

const ANCHOR_NAME = 'PopoverAnchor'

/**
 * Registers a custom anchor element with the popover context.
 * When present, the trigger will not act as the positioning anchor.
 */
export const PopoverAnchor = React.forwardRef<
  React.ComponentRef<typeof PopperPrimitive.PopperAnchor>,
  IPopover.IScoped<IPopover.IAnchorProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...anchorProps } = props
  const context = usePopoverContext(ANCHOR_NAME, __scopePopover)
  const popperScope = usePopperScope(__scopePopover)
  const { onCustomAnchorAdd, onCustomAnchorRemove } = context

  React.useEffect(() => {
    onCustomAnchorAdd()
    return () => onCustomAnchorRemove()
  }, [onCustomAnchorAdd, onCustomAnchorRemove])

  return (
    <PopperPrimitive.PopperAnchor data-slot="popover-anchor" {...popperScope} {...anchorProps} ref={forwardedRef} />
  )
})

PopoverAnchor.displayName = ANCHOR_NAME
