'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cn } from '@/lib/utils'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

// HoverCardCustomView
export interface HoverCardCustomViewProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof HoverCard>
  trigger?: React.ComponentPropsWithoutRef<typeof HoverCardTrigger>
  content?: React.ComponentPropsWithoutRef<typeof HoverCardContent>
}

const HoverCardCustomView: React.FC<HoverCardCustomViewProps> = ({ content, trigger, wrapper }) => {
  const { className: triggerClassName, key: triggerKey, children: triggerChildren, ...triggerProps } = trigger ?? {}
  const { className: contentClassName, key: contentKey, children: contentChildren, ...contentProps } = content ?? {}

  return (
    <HoverCard {...wrapper}>
      <HoverCardTrigger
        className={cn('', triggerClassName)}
        {...triggerProps}
      >
        {triggerChildren}
      </HoverCardTrigger>
      <HoverCardContent
        className={cn('w-80', contentClassName)}
        {...contentProps}
      >
        {contentChildren}
      </HoverCardContent>
    </HoverCard>
  )
}
HoverCardCustomView.displayName = 'HoverCardCustomView'

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardCustomView }
