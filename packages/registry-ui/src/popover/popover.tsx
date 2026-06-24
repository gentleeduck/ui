'use client'

import { cn } from '@gentleduck/libs/cn'
import * as PopoverPrimitive from '@gentleduck/primitives/popover'
import type { IPopover } from '@gentleduck/primitives/popover'
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
>(({ className, align = 'center', sideOffset = 4, style, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-72 origin-(--gentleduck-popover-content-transform-origin) rounded-md border bg-popover p-4 text-start text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      style={
        {
          '--popover-border-color': 'var(--border)',
          borderColor: 'var(--popover-border-color)',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverArrow = React.forwardRef<SVGSVGElement, IPopover.IArrowProps>(
  ({ className, style, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    asChild
    width={14}
    height={7}
    className={cn('fill-popover', className)}
    {...props}
    overflow="visible"
    style={style}>
    <g>
      <path
        d="M 0,0 C 6,0 13.5,10 15,10 C 16.5,10 24,0 30,0"
        fill="none"
        stroke="var(--popover-border-color)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M 0,-2 L 30,-2 L 30,0 C 24,0 16.5,10 15,10 C 13.5,10 6,0 0,0 Z" />
    </g>
  </PopoverPrimitive.Arrow>
))
PopoverArrow.displayName = 'PopoverArrow'

export const PopoverClose: typeof PopoverPrimitive.Close = PopoverPrimitive.Close
PopoverClose.displayName = 'PopoverClose'

export { Popover, PopoverAnchor, PopoverArrow, PopoverContent, PopoverTrigger }
