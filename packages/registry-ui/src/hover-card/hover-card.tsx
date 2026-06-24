'use client'

import { cn } from '@gentleduck/libs/cn'
import * as HoverCardPrimitive from '@gentleduck/primitives/hover-card'
import type { Variants } from '@gentleduck/variants'
import * as React from 'react'
import { buttonVariants } from '../button'

const HoverCard = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root> & {
    delayDuration?: number
    skipDelayDuration?: number
    placement?: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>['side']
  }
>(({ closeDelay, openDelay, placement = 'top', delayDuration, skipDelayDuration, ...props }, _ref) => {
  void skipDelayDuration

  return (
    <HoverCardPrimitive.Root
      closeDelay={closeDelay}
      data-slot="hover-card"
      openDelay={openDelay ?? delayDuration}
      {...props}
    />
  )
})
HoverCard.displayName = 'HoverCard'

const HoverCardTrigger = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> & Variants.VariantProps<typeof buttonVariants>
>(({ children, className, variant = 'outline', size = 'default', border = 'default', ...props }, ref) => {
  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      className={cn(buttonVariants({ variant, size, border }), className)}
      data-slot="hover-card-trigger"
      {...props}>
      {children}
    </HoverCardPrimitive.Trigger>
  )
})
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName

const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, children, side = 'top', align = 'center', sideOffset = 4, style, ...props }, ref) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        className={cn(
          'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative origin-(--gentleduck-hover-card-content-transform-origin) data-[state=closed]:animate-out data-[state=open]:animate-in',
          className,
        )}
        data-slot="hover-card-content"
        side={side}
        sideOffset={sideOffset}
        style={
          {
            '--hover-card-border-color': 'var(--border)',
            borderColor: 'var(--hover-card-border-color)',
            ...style,
          } as React.CSSProperties
        }
        {...props}>
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

const HoverCardArrow = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Arrow>
>(({ className, style, ...props }, ref) => (
  <HoverCardPrimitive.Arrow
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
        stroke="var(--hover-card-border-color)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M 0,-2 L 30,-2 L 30,0 C 24,0 16.5,10 15,10 C 13.5,10 6,0 0,0 Z" />
    </g>
  </HoverCardPrimitive.Arrow>
))
HoverCardArrow.displayName = 'HoverCardArrow'

export { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger }
