'use client'
import PopoverPrimitive from '@gentleduck/aria-feather/popover'
import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import type { VariantProps } from '@gentleduck/variants'
import type * as React from 'react'
import { Button } from '../button'

const Popover = PopoverPrimitive.Root

function PopoverTrigger({
  children,
  variant = 'outline',
  asChild = false,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <PopoverPrimitive.Trigger asChild>
      <Button {...props} variant={variant} asChild={asChild} className={cn('justify-between', className)}>
        {children}
      </Button>
    </PopoverPrimitive.Trigger>
  )
}

function PopoverContent({
  children,
  className,
  animation = 'default',
  overlay = 'nothing',
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  animation?: VariantProps<typeof AnimDialogVariants>['animation']
  overlay?: VariantProps<typeof AnimVariants>['overlay']
}): React.JSX.Element {
  return (
    <PopoverPrimitive.Content
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        'absolute z-50 max-h-fit w-fit border-border bg-popover p-4 text-popover-foreground',
        className,
      )}
      {...props}>
      {children}
    </PopoverPrimitive.Content>
  )
}

const PopoverClose = PopoverTrigger

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }
