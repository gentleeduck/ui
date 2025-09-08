'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import PopoverPrimitive from '@gentleduck/primitives/popover'
import type * as React from 'react'

const Popover = PopoverPrimitive.Root

function PopoverTrigger({ children, ...props }: React.ComponentPropsWithRef<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props}>{children}</PopoverPrimitive.Trigger>
}

function PopoverContent({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof PopoverPrimitive.Content>): React.JSX.Element {
  return (
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(AnimVariants(), AnimDialogVariants(), 'w-fit min-w-[300px] p-4', className)}
      {...props}>
      {children}
    </PopoverPrimitive.Content>
  )
}

const PopoverClose = PopoverTrigger

const PopoverPortal = PopoverPrimitive.Portal

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverPortal }
