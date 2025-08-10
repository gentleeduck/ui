'use client'

import * as TooltipPrimitive from '@gentleduck/primitives/tooltip'
import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import { VariantProps } from '@gentleduck/variants'
import type React from 'react'

function Tooltip({
  skipDelayDuration,
  delayDuration,
  ...props
}: React.ComponentPropsWithRef<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root skipDelayDuration={skipDelayDuration} delayDuration={delayDuration} {...props} />
}

function TooltipTrigger({
  children,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TooltipPrimitive.Trigger>, 'size'>) {
  return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>
}

function TooltipContent({
  className,
  children,
  animation = 'default',
  overlay = 'nothing',
  ...props
}: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content> & {
  animation?: VariantProps<typeof AnimDialogVariants>['animation']
  overlay?: VariantProps<typeof AnimVariants>['overlay']
}): React.JSX.Element {
  return (
    <TooltipPrimitive.Content
      role="tooltip"
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        'absolute z-50 max-h-fit w-fit max-w-[300px] text-balance border border-border bg-popover p-4 text-popover-foreground',
        'select-none px-3 py-1.5',
        className,
      )}
      {...props}>
      {children}
    </TooltipPrimitive.Content>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
