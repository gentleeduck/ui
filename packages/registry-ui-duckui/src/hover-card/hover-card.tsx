'use client'

import * as HoverCardPrimitive from '@gentleduck/primitives/tooltip'
import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import { VariantProps } from '@gentleduck/variants'
import type React from 'react'
import { Button } from '../button'

function HoverCard({
  skipDelayDuration,
  delayDuration,
  placement = 'bottom',
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
  animation = 'default',
  overlay = 'nothing',
  ...props
}: React.ComponentPropsWithRef<typeof HoverCardPrimitive.Content> & {
  animation?: VariantProps<typeof AnimDialogVariants>['animation']
  overlay?: VariantProps<typeof AnimVariants>['overlay']
}): React.JSX.Element {
  return (
    <HoverCardPrimitive.Content
      role="HoverCard"
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        'absolute z-50 max-h-fit w-fit max-w-[300px] text-balance border border-border bg-popover p-4 text-popover-foreground',
        className,
      )}
      {...props}>
      {children}
    </HoverCardPrimitive.Content>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
