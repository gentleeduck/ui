'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { fadeIn } from '@gentleduck/motion/presets/fade-in'
import { createSlideEdge } from '@gentleduck/motion/presets/slide-edge'
import { tweenSlow } from '@gentleduck/motion/transitions/tweens'
import { MotionRootContext, useMotionContent, useMotionMount, useMotionRoot } from '@gentleduck/motion/use-motion-root'
import * as SheetPrimitive from '@gentleduck/primitives/sheet'
import type { VariantProps } from '@gentleduck/variants'
import { X } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { sheetVariants } from './sheet.constants'

const OVERLAY_OPTIONS = {} as const

const Sheet = SheetPrimitive.Root
Sheet.displayName = 'Sheet'

const SheetTrigger = SheetPrimitive.Trigger
SheetTrigger.displayName = 'SheetTrigger'

const SheetClose = SheetPrimitive.Close
SheetClose.displayName = 'SheetClose'

const SheetPortal = SheetPrimitive.Portal
SheetPortal.displayName = 'SheetPortal'

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
      'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps & { closeText?: string }
>(({ side = 'right', className, children, closeText = 'Close', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close className="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">{closeText}</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-start', className)} {...props} />
  ),
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  ),
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('font-semibold text-foreground text-lg', className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

/* ------------------------------------------------------------------ */
/*  MotionSheet + MotionSheetContent                                   */
/* ------------------------------------------------------------------ */

function MotionSheet({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) {
  const { rootProps, contextValue } = useMotionRoot({ open, defaultOpen, onOpenChange })
  return (
    <MotionRootContext.Provider value={contextValue}>
      <SheetPrimitive.Root {...rootProps} {...rest}>
        {children}
      </SheetPrimitive.Root>
    </MotionRootContext.Provider>
  )
}
MotionSheet.displayName = 'MotionSheet'

const MotionSheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps & { closeText?: string; hideClose?: boolean }
>(({ side = 'right', className, children, closeText = 'Close', hideClose = false, ...props }, ref) => {
  const { isOpen } = useMotionContent()
  const overlay = useMotionPreset(fadeIn, OVERLAY_OPTIONS)
  const slide = React.useMemo(() => createSlideEdge(side ?? 'right'), [side])
  // Sheet uses tweenSlow (300ms) for its slide, so give the exit a bit more
  // room before unmounting.
  const shouldRender = useMotionMount(isOpen, 320)

  const positionClasses: Record<string, string> = {
    top: 'inset-x-0 top-0 border-b',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
  }

  if (!shouldRender) return null

  return (
    <LazyMotion features={loadDomAnimation}>
      <SheetPortal forceMount>
        <SheetPrimitive.Overlay forceMount asChild>
          <m.div
            className="fixed inset-0 z-50 bg-black/80"
            initial={overlay.initial}
            animate={isOpen ? overlay.animate : { ...overlay.exit, pointerEvents: 'none' }}
            transition={overlay.transition}
          />
        </SheetPrimitive.Overlay>
        <SheetPrimitive.Content ref={ref} forceMount asChild {...props}>
          <m.div
            className={cn('fixed z-50 gap-4 bg-background p-6 shadow-lg', positionClasses[side ?? 'right'], className)}
            initial={slide.initial}
            animate={isOpen ? slide.animate : { ...slide.exit, pointerEvents: 'none' }}
            transition={tweenSlow}>
            {children}
            {!hideClose && (
              <SheetPrimitive.Close className="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">{closeText}</span>
              </SheetPrimitive.Close>
            )}
          </m.div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </LazyMotion>
  )
})
MotionSheetContent.displayName = 'MotionSheetContent'

export {
  MotionSheet,
  MotionSheetContent,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
