'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { createTooltipPreset } from '@gentleduck/motion/presets/tooltip'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { MotionRootContext, useMotionContent, useMotionMount, useMotionRoot } from '@gentleduck/motion/use-motion-root'
import * as TooltipPrimitive from '@gentleduck/primitives/tooltip'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const TooltipProvider = TooltipPrimitive.Provider
TooltipProvider.displayName = 'TooltipProvider'

const Tooltip = TooltipPrimitive.Root
Tooltip.displayName = 'Tooltip'

const TooltipTrigger = TooltipPrimitive.Trigger
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--gentleduck-tooltip-content-transform-origin) animate-in overflow-hidden rounded-md border bg-background px-3 py-1.5 text-base text-foreground data-[state=closed]:animate-out',
        'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/* ------------------------------------------------------------------ */
/*  MotionTooltip + MotionTooltipContent                               */
/* ------------------------------------------------------------------ */

function MotionTooltip({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  const { rootProps, contextValue } = useMotionRoot({ open, defaultOpen, onOpenChange })
  return (
    <MotionRootContext.Provider value={contextValue}>
      <TooltipPrimitive.Root {...rootProps} {...rest}>
        {children}
      </TooltipPrimitive.Root>
    </MotionRootContext.Provider>
  )
}
MotionTooltip.displayName = 'MotionTooltip'

const MotionTooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, side = 'top', children, ...props }, ref) => {
  const { isOpen } = useMotionContent()
  const preset = React.useMemo(() => createTooltipPreset(side ?? 'top'), [side])
  const shouldRender = useMotionMount(isOpen)

  if (!shouldRender) return null

  return (
    <LazyMotion features={loadDomAnimation}>
      <TooltipPrimitive.Portal forceMount>
        <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} side={side} forceMount asChild {...props}>
          <m.div
            className={cn(
              'z-50 origin-(--gentleduck-tooltip-content-transform-origin) overflow-hidden rounded-md border bg-background px-3 py-1.5 text-base text-foreground',
              className,
            )}
            initial={preset.initial}
            animate={isOpen ? preset.animate : { ...preset.exit, pointerEvents: 'none' }}
            transition={springBouncy}>
            {children}
          </m.div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </LazyMotion>
  )
})
MotionTooltipContent.displayName = 'MotionTooltipContent'

export { MotionTooltip, MotionTooltipContent, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
