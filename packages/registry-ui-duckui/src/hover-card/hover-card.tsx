'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import * as HoverCardPrimitive from '@gentleduck/primitives/hover-card'
import type React from 'react'
import { Button } from '../button'

function HoverCard({
  skipDelayDuration,
  delayDuration,
  placement = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      delayDuration={delayDuration}
      placement={placement}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
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
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Content>): React.JSX.Element {
  return (
    <HoverCardPrimitive.Content
      aria-modal="false"
      className={cn(
        AnimVariants(),
        'relative z-50 h-fit w-fit overflow-hidden text-balance rounded-lg border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100',
        className,
      )}
      data-slot="hover-card-content"
      role="dialog"
      {...props}>
      {children}
    </HoverCardPrimitive.Content>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
