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
import {
  DialogCloseResponsiveProps,
  DialogContentResponsiveProps,
  DialogDescriptionResponsiveProps,
  DialogFooterResponsiveProps,
  DialogHeaderResponsiveProps,
  DialogResponsiveProps,
  DialogTitleResponsiveProps,
  DialogTriggerResponsiveProps,
  DialogWrapperProps,
} from './dialog.types'

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

const DialogResponsive: React.FC<DialogResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>
  }

  return <Drawer {...props}>{children}</Drawer>
}

DialogResponsive.displayName = 'DialogResponsive'

const DialogTriggerResponsive: React.FC<DialogTriggerResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

DialogTriggerResponsive.displayName = 'DialogTriggerResponsive'

const DialogContentResponsive: React.FC<DialogContentResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogContent {...props}>{children}</DialogContent>
  }

  return <DrawerContent {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}>{children}</DrawerContent>
}

DialogContentResponsive.displayName = 'DialogContentResponsive'

const DialogHeaderResponsive: React.FC<DialogHeaderResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>
}

DialogHeaderResponsive.displayName = 'DialogHeaderResponsive'

const DialogFooterResponsive: React.FC<DialogFooterResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>
}

DialogFooterResponsive.displayName = 'DialogFooterResponsive'

const DialogTitleResponsive: React.FC<DialogTitleResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>
}

DialogTitleResponsive.displayName = 'DialogTitleResponsive'

const DialogDescriptionResponsive: React.FC<DialogDescriptionResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>
}

DialogDescriptionResponsive.displayName = 'DialogDescriptionResponsive'

const DialogCloseResponsive: React.FC<DialogCloseResponsiveProps> = ({ children, ...props }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogClose {...props}>{children}</DialogClose>
  }

  return <DrawerClose {...props}>{children}</DrawerClose>
}

function DialogWrapper({ trigger, content, duckHook }: DialogWrapperProps) {
  const { className: subContentClassName, children: subcontentChildren, _header, _footer, ...subContentProps } = content
  const {
    className: subHeaderClassName,
    _description: subDescription,
    _title: subTitle,
    ...subHeaderProps
  } = _header ?? {}
  const { className: subFooterClassName, _submit: _subSubmit, _cancel: _subCancel, ...subFooterProps } = _footer ?? {}

  return (
    <DialogResponsive
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
    >
      <DialogTriggerResponsive {...trigger} />
      <DialogContentResponsive
        className={cn('flex flex-col w-full h-full', subContentClassName)}
        {...subContentProps}
      >
        <div
          data-role-wrapper
          className="flex flex-col gap-4 w-full h-full"
        >
          {_header && (
            <DialogHeaderResponsive {...subHeaderProps}>
              {subHeaderProps.children ? (
                subHeaderProps.children
              ) : (
                <>
                  <DialogTitleResponsive {...subTitle} />
                  <DialogDescriptionResponsive {...subDescription} />
                </>
              )}
            </DialogHeaderResponsive>
          )}
          {subcontentChildren}
          <DialogFooterResponsive
            className={cn('gap-2', subFooterClassName)}
            {...subFooterProps}
          >
            <DialogCloseResponsive
              asChild
              {..._subCancel}
            />
            <div
              {..._subSubmit}
              className={cn('ml-0', _subSubmit?.className)}
              onClick={e => {
                duckHook?.setState({ shape: false, alert: false })
                _subSubmit?.onClick?.(e)
              }}
            />
          </DialogFooterResponsive>
        </div>
      </DialogContentResponsive>
    </DialogResponsive>
  )
}
DialogWrapper.displayName = 'SheetWrapper'

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
