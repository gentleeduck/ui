'use client'

import { cn } from '@gentleduck/libs/cn'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

function HoverCard({
  mouseEnter = true,
  skipDelayDuration = 0,
  delayDuration = 500,
  ...props
}: React.ComponentPropsWithRef<typeof Popover>) {
  return (
    <Popover
      mouseEnter={mouseEnter}
      mouseExist={mouseEnter}
      skipDelayDuration={skipDelayDuration}
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const HoverCardTrigger = PopoverTrigger

function HoverCardContent({
  className,
  children,
  side = 'bottom',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>): React.JSX.Element {
  return (
    <PopoverContent side={side as never} role="tooltip" className={cn('max-w-[20rem]', className)} {...props}>
      {children}
    </PopoverContent>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
