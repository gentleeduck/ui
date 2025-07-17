'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimTooltipVariants } from '@gentleduck/motion/anim'
import type React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import PopoverPrimitive, { usePopoverContext } from '@gentleduck/aria-feather/popover'

function Tooltip({
  skipDelayDuration = 300,
  delayDuration = 300,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Popover>, 'mouseEnter' | 'mouseExist'>) {
  return (
    <Popover
      // skipDelayDuration={skipDelayDuration}
      // delayDuration={delayDuration}
      // mouseEnter={true}
      // mouseExist={true}
      {...props}
    />
  )
}

function TooltipTrigger({ className, children, ...props }: React.ComponentPropsWithRef<typeof PopoverTrigger>) {
  return (
    <PopoverTrigger variant={'nothing'} className={cn('h-auto rounded-none p-0', className)} {...props}>
      {children}
    </PopoverTrigger>
  )
}

function TooltipContent({
  className,
  children,
  side = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>): React.JSX.Element {
  return (
    <PopoverContent
      side={'right'}
      role="tooltip"
      className={cn(
        'select-none text-balance rounded-md border-border bg-background px-3 py-1.5 text-accent-foreground shadow-none',
        className,
      )}
      {...props}>
      {children}
    </PopoverContent>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
