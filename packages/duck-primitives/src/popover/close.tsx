'use client'

import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePopoverContext } from './popover'
import type { PopoverTriggerProps } from './trigger'

const CLOSE_NAME = 'PopoverClose'

export interface PopoverCloseProps extends PopoverTriggerProps {}

/** Button that closes the popover when clicked. */
export const PopoverClose = React.forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  ScopedProps<PopoverCloseProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...closeProps } = props
  const context = usePopoverContext(CLOSE_NAME, __scopePopover)

  return (
    <Primitive.button
      type="button"
      {...closeProps}
      ref={forwardedRef}
      // Compose the consumer onClick with the close handler so both fire in order
      onClick={composeEventHandlers(closeProps.onClick, () => context.onOpenChange(false))}
    />
  )
})

PopoverClose.displayName = CLOSE_NAME
