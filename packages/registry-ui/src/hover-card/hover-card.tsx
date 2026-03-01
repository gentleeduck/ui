'use client'

import { cn } from '@gentleduck/libs/cn'
import * as HoverCardPrimitive from '@gentleduck/primitives/hover-card'
import type { VariantProps } from '@gentleduck/variants'
import * as React from 'react'
import { buttonVariants } from '../button'

const HoverCardPlacementContext =
  React.createContext<React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>['side']>('top')

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
    <HoverCardPlacementContext.Provider value={placement}>
      <HoverCardPrimitive.Root
        closeDelay={closeDelay}
        data-slot="hover-card"
        openDelay={openDelay ?? delayDuration}
        {...props}
      />
    </HoverCardPlacementContext.Provider>
  )
})
HoverCard.displayName = 'HoverCard'

const HoverCardTrigger = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> & VariantProps<typeof buttonVariants>
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
>(({ className, children, side, align = 'center', sideOffset = 4, ...props }, ref) => {
  const defaultSide = React.useContext(HoverCardPlacementContext)

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        className={cn(
          'z-50 w-64 overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--gentleduck-hover-card-content-transform-origin) data-[state=closed]:animate-out data-[state=open]:animate-in',
          'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
          className,
        )}
        data-slot="hover-card-content"
        side={side ?? defaultSide}
        sideOffset={sideOffset}
        {...props}>
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
