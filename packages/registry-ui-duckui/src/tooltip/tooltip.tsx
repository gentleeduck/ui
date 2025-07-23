'use client'

import { cn } from '@gentleduck/libs/cn'
import type React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

function Tooltip({
  skipDelayDuration = 150,
  delayDuration = 250,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof Popover>, 'mouseEnter' | 'mouseExist'>) {
  return (
    <Popover skipDelayDuration={skipDelayDuration} delayDuration={delayDuration} mouseEnter mouseExist {...props} />
  )
}

function TooltipTrigger({ children, ...props }: React.ComponentPropsWithRef<typeof PopoverTrigger>) {
  return (
    <PopoverTrigger variant={'nothing'} {...props}>
      {children}
    </PopoverTrigger>
  )
}

function TooltipContent({
  className,
  children,
  placement = 'top',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverContent>): React.JSX.Element {
  return (
    <PopoverContent
      placement={placement}
      role="tooltip"
      className={cn('select-none text-balance rounded-md px-3 py-1.5', className)}
      {...props}>
      {children}
    </PopoverContent>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
