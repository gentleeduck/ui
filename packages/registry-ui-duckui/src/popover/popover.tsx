'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import * as PopoverPrimitive from '@gentleduck/primitives/popover'
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
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          AnimVariants(),
          'data-[open=false]:fade-out-0 data-[open=true]:fade-in-0 data-[open=false]:zoom-out-95 data-[open=true]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 pointer-events-none relative z-50 flex h-fit w-72 flex-col overflow-hidden text-balance rounded-md border border-border bg-popover p-4 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100',
          className,
        )}
        ref={ref}
        {...props}>
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

const PopoverClose = PopoverTrigger

const PopoverPortal = PopoverPrimitive.Portal

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverPortal }
