'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springStiff } from '@gentleduck/motion/transitions/springs'
import { MotionRootContext, useMotionContent, useMotionRoot } from '@gentleduck/motion/use-motion-root'
import * as AlertDialogPrimitive from '@gentleduck/primitives/alert-dialog'
import { AnimatePresence, LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { buttonVariants } from '../button'

const AlertDialog = AlertDialogPrimitive.Root
AlertDialog.displayName = 'AlertDialog'

const AlertDialogTrigger = AlertDialogPrimitive.Trigger
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

const AlertDialogPortal = AlertDialogPrimitive.Portal
AlertDialogPortal.displayName = 'AlertDialogPortal'

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
      'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg',
        'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-start', className)} {...props} />
  ),
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)} {...props} />
  ),
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('font-semibold text-lg', className)} {...props} />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

function MotionAlertDialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>) {
  const { rootProps, contextValue } = useMotionRoot({ open, defaultOpen, onOpenChange })
  return (
    <MotionRootContext.Provider value={contextValue}>
      <AlertDialogPrimitive.Root {...rootProps} {...rest}>
        {children}
      </AlertDialogPrimitive.Root>
    </MotionRootContext.Provider>
  )
}
MotionAlertDialog.displayName = 'MotionAlertDialog'

const MotionAlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setShowContent } = useMotionContent()
  const overlay = useMotionPreset('fadeIn')
  const content = useMotionPreset('scaleIn', {
    transition: springStiff,
  })

  return (
    <LazyMotion features={loadDomAnimation}>
      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen && (
          <AlertDialogPortal forceMount>
            <AlertDialogPrimitive.Overlay forceMount asChild>
              <m.div
                className={cn('fixed inset-0 z-50 bg-black/80')}
                initial={overlay.initial}
                animate={overlay.animate}
                exit={{ ...overlay.exit, pointerEvents: 'none' }}
                transition={overlay.transition}
              />
            </AlertDialogPrimitive.Overlay>
            <AlertDialogPrimitive.Content ref={ref} forceMount asChild {...props}>
              <m.div
                className={cn(
                  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
                  className,
                )}
                initial={content.initial}
                animate={content.animate}
                exit={{ ...content.exit, pointerEvents: 'none' }}
                transition={content.transition}>
                {children}
              </m.div>
            </AlertDialogPrimitive.Content>
          </AlertDialogPortal>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
})
MotionAlertDialogContent.displayName = 'MotionAlertDialogContent'

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  MotionAlertDialog,
  MotionAlertDialogContent,
}
