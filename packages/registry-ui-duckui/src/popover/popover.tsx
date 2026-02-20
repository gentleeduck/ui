'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import * as PopoverPrimitive from '@gentleduck/primitives/popover'
import type * as React from 'react'

const Popover = PopoverPrimitive.Root

const PopoverTrigger: typeof PopoverPrimitive.Trigger = PopoverPrimitive.Trigger

const PopoverAnchor: typeof PopoverPrimitive.Anchor = PopoverPrimitive.Anchor

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-72 origin-[--gentleduck-popover-content-transform-origin] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
          AnimVariants(),
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export const PopoverClose: typeof PopoverPrimitive.Close = PopoverPrimitive.Close

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
