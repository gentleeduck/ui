'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import * as HoverCardPrimitive from '@gentleduck/primitives/hover-card'
import * as React from 'react'
import { Button } from '../button'

const HoverCardPlacementContext =
  React.createContext<React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>['side']>('top')

function HoverCard({
  closeDelay,
  skipDelayDuration,
  delayDuration,
  openDelay,
  placement = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Root> & {
  delayDuration?: number
  skipDelayDuration?: number
  placement?: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>['side']
}) {
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
}

function HoverCardTrigger({
  children,
  variant = 'outline',
  asChild = false,
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Trigger> & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <HoverCardPrimitive.Trigger asChild data-slot="hover-card-trigger">
      <Button {...props} asChild={asChild} variant={variant}>
        {children}
      </Button>
    </HoverCardPrimitive.Trigger>
  )
}

function HoverCardContent({
  className,
  children,
  side,
  style,
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Content>): React.JSX.Element {
  const defaultSide = React.useContext(HoverCardPlacementContext)

  return (
    <HoverCardPrimitive.Content
      aria-modal="false"
      className={cn(
        AnimVariants(),
        'relative h-fit w-fit overflow-hidden text-balance rounded-lg border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100',
        className,
      )}
      data-slot="hover-card-content"
      role="dialog"
      side={side ?? defaultSide}
      style={{
        transitionProperty: 'opacity',
        ...style,
      }}
      {...props}>
      {children}
    </HoverCardPrimitive.Content>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
