'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer'
import { useMediaQuery } from '@/hooks/use-media-query'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// DialogWrapper Component
export interface DialogWrapperProps {
  wrapper?: React.ComponentPropsWithoutRef<typeof Dialog>
  trigger?: React.ComponentPropsWithoutRef<typeof DialogTrigger>
  content?: React.ComponentPropsWithoutRef<typeof DialogContent>
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({ content, trigger, wrapper }) => {
  const { className: triggerClassName, key: triggerKey, children: triggerChildren, ...triggerProps } = trigger ?? {}
  const { className: contentClassName, key: contentKey, children: contentChildren, ...contentProps } = content ?? {}

  return (
    <Dialog {...wrapper}>
      <DialogTrigger
        className={cn('', triggerClassName)}
        {...triggerProps}
      >
        {triggerChildren}
      </DialogTrigger>
      <DialogContent
        className={cn('w-80', contentClassName)}
        {...contentProps}
      >
        {contentChildren}
      </DialogContent>
    </Dialog>
  )
}

DialogWrapper.displayName = 'DialogWrapper'

export interface DialogResponsiveProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

const DialogResponsive: React.FC<DialogResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>
  }

  return <Drawer {...props}>{children}</Drawer>
}

DialogResponsive.displayName = 'DialogResponsive'

export interface DialogTriggerResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {}

const DialogTriggerResponsive: React.FC<DialogTriggerResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

DialogTriggerResponsive.displayName = 'DialogTriggerResponsive'

export interface DialogContentResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {}

const DialogContentResponsive: React.FC<DialogContentResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogContent {...props}>{children}</DialogContent>
  }

  return <DrawerContent {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}>{children}</DrawerContent>
}

DialogContentResponsive.displayName = 'DialogContentResponsive'

export interface DialogHeaderResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogHeader> {}

const DialogHeaderResponsive: React.FC<DialogHeaderResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>
}

DialogHeaderResponsive.displayName = 'DialogHeaderResponsive'

export interface DialogFooterResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogFooter> {}

const DialogFooterResponsive: React.FC<DialogFooterResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>
}

DialogFooterResponsive.displayName = 'DialogFooterResponsive'

export interface DialogTitleResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogTitle> {}

const DialogTitleResponsive: React.FC<DialogTitleResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>
}

DialogTitleResponsive.displayName = 'DialogTitleResponsive'

export interface DialogDescriptionResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogDescription> {}

const DialogDescriptionResponsive: React.FC<DialogDescriptionResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>
}

DialogDescriptionResponsive.displayName = 'DialogDescriptionResponsive'

export interface DialogCloseResponsiveProps extends React.ComponentPropsWithoutRef<typeof DialogClose> {}

const DialogCloseResponsive: React.FC<DialogCloseResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogClose {...props}>{children}</DialogClose>
  }

  return <DrawerClose {...props}>{children}</DrawerClose>
}

export {
  DialogResponsive,
  DialogTriggerResponsive,
  DialogContentResponsive,
  DialogHeaderResponsive,
  DialogFooterResponsive,
  DialogTitleResponsive,
  DialogDescriptionResponsive,
  DialogCloseResponsive,
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogWrapper,
}
