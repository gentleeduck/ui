'use client'

import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, usePopoverContext } from './popover'
import type { IPopoverTriggerProps } from './trigger'

const CLOSE_NAME = 'PopoverClose'

export interface IPopoverCloseProps extends IPopoverTriggerProps {}

/** Button that closes the popover when clicked. */
export const PopoverClose = React.forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  ScopedProps<IPopoverCloseProps>
>((props, forwardedRef) => {
  const { __scopePopover, ...closeProps } = props
  const context = usePopoverContext(CLOSE_NAME, __scopePopover)

  return (
    <Primitive.button
      data-slot="popover-close"
      type="button"
      dir={context.dir}
      {...closeProps}
      ref={forwardedRef}
      // Compose the consumer onClick with the close handler so both fire in order
      onClick={composeEventHandlers(closeProps.onClick, () => context.onOpenChange(false))}
    />
  )
})

PopoverClose.displayName = CLOSE_NAME
