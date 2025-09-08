'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
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
      skipDelayDuration={skipDelayDuration}
      delayDuration={delayDuration}
      placement={placement}
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
    <HoverCardPrimitive.Trigger asChild>
      <Button {...props} variant={variant} asChild={asChild}>
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
      role="hover-card"
      className={cn(AnimVariants(), AnimDialogVariants(), className)}
      {...props}>
      {children}
    </HoverCardPrimitive.Content>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
