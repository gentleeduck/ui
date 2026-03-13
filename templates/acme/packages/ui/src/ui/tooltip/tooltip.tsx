'use client'

import { cn } from '@gentleduck/libs/cn'
import * as TooltipPrimitive from '@gentleduck/primitives/tooltip'
import * as React from 'react'

const TooltipProvider = TooltipPrimitive.Provider
TooltipProvider.displayName = 'TooltipProvider'

const Tooltip = TooltipPrimitive.Root
Tooltip.displayName = 'Tooltip'

const TooltipTrigger = TooltipPrimitive.Trigger
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--gentleduck-tooltip-content-transform-origin) animate-in overflow-hidden rounded-md border bg-background px-3 py-1.5 text-base text-foreground data-[state=closed]:animate-out',
        'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
