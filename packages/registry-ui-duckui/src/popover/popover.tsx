'use client'
import PopoverPrimitive from '@gentleduck/duck-primitives/popover'
import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import type { VariantProps } from '@gentleduck/variants'
import type * as React from 'react'

const Popover = PopoverPrimitive.Root

function PopoverTrigger({ children, ...props }: React.ComponentPropsWithRef<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props}>{children}</PopoverPrimitive.Trigger>
}

function PopoverContent({
  children,
  className,
  animation = 'default',
  ref,
  overlay = 'nothing',
  ...props
}: React.ComponentPropsWithRef<typeof PopoverPrimitive.Content> & {
  animation?: VariantProps<typeof AnimDialogVariants>['animation']
  overlay?: VariantProps<typeof AnimVariants>['overlay']
}): React.JSX.Element {
  return (
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        'absolute z-50 max-h-fit w-fit max-w-[300px] border border-border bg-popover p-4 text-popover-foreground',
        className,
      )}
      {...props}>
      {children}
    </PopoverPrimitive.Content>
  )
}

const PopoverClose = PopoverTrigger

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }
