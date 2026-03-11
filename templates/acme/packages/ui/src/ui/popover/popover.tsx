'use client'

import { cn } from '@gentleduck/libs/cn'
import * as PopoverPrimitive from '@gentleduck/primitives/popover'
import * as React from 'react'

const Popover = PopoverPrimitive.Root
Popover.displayName = 'Popover'

const PopoverTrigger: typeof PopoverPrimitive.Trigger = PopoverPrimitive.Trigger
PopoverTrigger.displayName = 'PopoverTrigger'

const PopoverAnchor: typeof PopoverPrimitive.Anchor = PopoverPrimitive.Anchor
PopoverAnchor.displayName = 'PopoverAnchor'

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--gentleduck-popover-content-transform-origin) rounded-md border bg-popover p-4 text-start text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
        'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export const PopoverClose: typeof PopoverPrimitive.Close = PopoverPrimitive.Close
PopoverClose.displayName = 'PopoverClose'

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
