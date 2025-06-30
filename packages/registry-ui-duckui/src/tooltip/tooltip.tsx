'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimTooltipVariants } from '@gentleduck/motion/anim'
import type * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

function Tooltip({
  skipDelayDuration = 0,
  delayDuration = 300,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Popover>, 'mouseEnter' | 'mouseExist'>) {
  return (
    <Popover
      skipDelayDuration={skipDelayDuration}
      delayDuration={delayDuration}
      mouseEnter={true}
      mouseExist={true}
      {...props}
    />
  )
}

const TooltipTrigger = PopoverTrigger

function TooltipContent({
  className,
  children,
  side = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>): React.JSX.Element {
  return (
    <PopoverContent side={side as never} role="tooltip" className={cn(AnimTooltipVariants(), className)} {...props}>
      {children}
    </PopoverContent>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
