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
>(({ className, sideOffset = 4, style, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 origin-(--gentleduck-tooltip-content-transform-origin) animate-in rounded-lg border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out',
        className,
      )}
      style={
        {
          '--tooltip-border-color': 'var(--border)',
          borderColor: 'var(--tooltip-border-color)',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipArrow = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, style, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    asChild
    width={14}
    height={7}
    className={cn('fill-popover', className)}
    {...props}
    overflow="visible"
    style={style}>
    <g>
      {/* non-scaling-stroke = true 2px on screen regardless of SVG scale factor */}
      <path
        d="M 0,0 C 6,0 13.5,10 15,10 C 16.5,10 24,0 30,0"
        fill="none"
        stroke="var(--tooltip-border-color)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      {/* fill extends to y=-2 (above viewport via overflow:visible) for flush content join */}
      <path d="M 0,-2 L 30,-2 L 30,0 C 24,0 16.5,10 15,10 C 13.5,10 6,0 0,0 Z" />
    </g>
  </TooltipPrimitive.Arrow>
))
TooltipArrow.displayName = 'TooltipArrow'

export { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger }
