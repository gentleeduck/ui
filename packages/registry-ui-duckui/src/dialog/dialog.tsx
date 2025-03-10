'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@duck/libs/cn'
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

//FIX: remmote this import from any file.
import { DialogProps } from '@radix-ui/react-dialog'
import { useMediaQuery } from '@duck/hooks'

/**
 * Dialog component that serves as the root for the dialog primitive.
 * This component is used to create a dialog interface in the application.
 */
const Dialog = DialogPrimitive.Root

/**
 * A component that serves as the trigger for opening a dialog.
 * It is a wrapper around the `DialogPrimitive.Trigger` component.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * A component that renders a dialog portal using the DialogPrimitive.Portal.
 * This component is used to create a portal for the dialog, allowing it to be rendered
 * outside of the DOM hierarchy of its parent component.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * A component that provides a button to close the dialog.
 * This is a wrapper around the `DialogPrimitive.Close` component.
 */
const DialogClose = DialogPrimitive.Close

/**
 * `DialogOverlay` is a React forwardRef component that renders an overlay for a dialog.
 * It uses `DialogPrimitive.Overlay` as the base component and applies additional styles
 * and animations based on the dialog's state.
 *
 * @param {string} className - Additional class names to apply to the overlay.
 * @param {React.Ref} ref - A ref to be forwarded to the `DialogPrimitive.Overlay` component.
 * @param {object} props - Additional props to be passed to the `DialogPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * `DialogContent` is a React component that renders the content of a dialog.
 * It uses `React.forwardRef` to pass a ref to the underlying `DialogPrimitive.Content` component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the dialog content.
 * @param {React.ReactNode} props.children - The content to be displayed inside the dialog.
 * @param {React.Ref} ref - The ref to be forwarded to the `DialogPrimitive.Content` component.
 *
 * @returns {JSX.Element} The rendered dialog content component.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95  sm:rounded-lg',
        className,
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

/**
 * DialogHeader component renders a header section for a dialog.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @returns {JSX.Element} The rendered DialogHeader component.
 */
function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
}
DialogHeader.displayName = 'DialogHeader'

/**
 * DialogFooter component renders a footer section for a dialog.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @returns {JSX.Element} The rendered DialogFooter component.
 */
function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  )
}
DialogFooter.displayName = 'DialogFooter'

/**
 * `DialogTitle` is a React component that forwards its ref to the `DialogPrimitive.Title` component.
 * It accepts all props that `DialogPrimitive.Title` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 * @param {string} className - Optional additional class names to apply to the component.
 * @param {React.Ref} ref - A ref that will be forwarded to the `DialogPrimitive.Title` component.
 * @returns {JSX.Element} The rendered `DialogPrimitive.Title` component with forwarded ref and applied props.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * `DialogDescription` is a React component that forwards its ref to the `DialogPrimitive.Description` component.
 * It applies additional class names to style the description text.
 *
 * @param {string} className - Additional class names to apply to the description text.
 * @param {React.Ref} ref - The ref to be forwarded to the `DialogPrimitive.Description` component.
 * @param {object} props - Additional props to be passed to the `DialogPrimitive.Description` component.
 *
 * @returns {JSX.Element} The rendered `DialogPrimitive.Description` component with forwarded ref and applied class names.
 */
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

/**
 * `DialogResponsive` is a React component that conditionally renders either a `Dialog` or a `Drawer` depending
 * on the screen size. If the screen width is 768px or greater, a `Dialog` is rendered; otherwise, a `Drawer` is
 * rendered.
 *
 * @param {React.ReactNode} children - The children elements to be rendered by the `Dialog` or `Drawer`.
 * @param {DialogResponsiveProps} props - The props to be passed to the `Dialog` or `Drawer` component.
 * @returns {JSX.Element} The rendered `Dialog` or `Drawer` component.
 */
function DialogResponsive({
  children,
  ...props
}: DialogResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>
  }

  return <Drawer {...props}>{children}</Drawer>
}

DialogResponsive.displayName = 'DialogResponsive'

/**
 * `DialogTriggerResponsive` is a React component that conditionally renders either a `DialogTrigger` or a `DrawerTrigger`
 * based on the screen size. If the screen width is 768px or greater, a `DialogTrigger` is rendered; otherwise, a
 * `DrawerTrigger` is rendered.
 *
 * @param {DialogTriggerResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogTrigger` or `DrawerTrigger`.
 * @returns {JSX.Element} The rendered `DialogTrigger` or `DrawerTrigger` component.
 */
function DialogTriggerResponsive({
  children,
  ...props
}: DialogTriggerResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

DialogTriggerResponsive.displayName = 'DialogTriggerResponsive'

/**
 * `DialogContentResponsive` is a React component that conditionally renders either a `DialogContent` or a `DrawerContent`
 * based on the screen size. If the screen width is 768px or greater, a `DialogContent` is rendered; otherwise, a
 * `DrawerContent` is rendered.
 *
 * @param {DialogContentResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogContent` or `DrawerContent`.
 * @returns {JSX.Element} The rendered `DialogContent` or `DrawerContent` component.
 */
function DialogContentResponsive({
  children,
  ...props
}: DialogContentResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogContent {...props}>{children}</DialogContent>
  }

  return (
    <DrawerContent
      {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}
    >
      {children}
    </DrawerContent>
  )
}

DialogContentResponsive.displayName = 'DialogContentResponsive'

/**
 * `DialogHeaderResponsive` is a React component that conditionally renders either a `DialogHeader` or a
 * `DrawerHeader` based on the screen size. If the screen width is 768px or greater, a `DialogHeader` is
 * rendered; otherwise, a `DrawerHeader` is rendered.
 *
 * @param {DialogHeaderResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogHeader` or `DrawerHeader`.
 * @returns {JSX.Element} The rendered `DialogHeader` or `DrawerHeader` component.
 */
function DialogHeaderResponsive({
  children,
  ...props
}: DialogHeaderResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>
}

DialogHeaderResponsive.displayName = 'DialogHeaderResponsive'

/**
 * `DialogFooterResponsive` is a React component that conditionally renders either a `DialogFooter` or a
 * `DrawerFooter` based on the screen size. If the screen width is 768px or greater, a `DialogFooter` is
 * rendered; otherwise, a `DrawerFooter` is rendered.
 *
 * @param {DialogFooterResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogFooter` or `DrawerFooter`.
 * @returns {JSX.Element} The rendered `DialogFooter` or `DrawerFooter` component.
 */
function DialogFooterResponsive({
  children,
  ...props
}: DialogFooterResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>
}

DialogFooterResponsive.displayName = 'DialogFooterResponsive'

/**
 * `DialogTitleResponsive` is a React component that conditionally renders either a `DialogTitle` or a
 * `DrawerTitle` based on the screen size. If the screen width is 768px or greater, a `DialogTitle` is
 * rendered; otherwise, a `DrawerTitle` is rendered.
 *
 * @param {DialogTitleResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogTitle` or `DrawerTitle`.
 * @returns {JSX.Element} The rendered `DialogTitle` or `DrawerTitle` component.
 */
function DialogTitleResponsive({
  children,
  ...props
}: DialogTitleResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>
}

DialogTitleResponsive.displayName = 'DialogTitleResponsive'

/**
 * `DialogDescriptionResponsive` is a React component that conditionally renders either a `DialogDescription` or a
 * `DrawerDescription` based on the screen size. If the screen width is 768px or greater, a `DialogDescription` is
 * rendered; otherwise, a `DrawerDescription` is rendered.
 *
 * @param {DialogDescriptionResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogDescription` or `DrawerDescription`.
 * @returns {JSX.Element} The rendered `DialogDescription` or `DrawerDescription` component.
 */
function DialogDescriptionResponsive({
  children,
  ...props
}: DialogDescriptionResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>
}

DialogDescriptionResponsive.displayName = 'DialogDescriptionResponsive'

/**
 * `DialogCloseResponsive` is a React component that conditionally renders either a `DialogClose` or a `DrawerClose`
 * based on the screen size. If the screen width is 768px or greater, a `DialogClose` is rendered; otherwise, a
 * `DrawerClose` is rendered.
 *
 * @param {DialogCloseResponsiveProps} props - The properties passed to the component.
 * @param {React.ReactNode} children - The children elements to be rendered by the `DialogClose` or `DrawerClose`.
 * @returns {JSX.Element} The rendered `DialogClose` or `DrawerClose` component.
 */
function DialogCloseResponsive({
  children,
  ...props
}: DialogCloseResponsiveProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogClose {...props}>{children}</DialogClose>
  }

  return <DrawerClose {...props}>{children}</DrawerClose>
}

/**
 * `DialogWrapper` is a React component that wraps a `DialogResponsive` component and renders children elements
 * conditionally based on the screen size. If the screen width is 768px or greater, a `Dialog` is rendered; otherwise,
 * a `Drawer` is rendered.
 * @param {DialogWrapperProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `Dialog` or `Drawer` component.
 */
function DialogWrapper({
  trigger,
  content,
  duckHook,
  ...props
}: DialogWrapperProps): JSX.Element {
  const {
    className: subContentClassName,
    children: subcontentChildren,
    _header,
    _footer,
    ...subContentProps
  } = content
  const {
    className: subHeaderClassName,
    _description: subDescription,
    _title: subTitle,
    ...subHeaderProps
  } = _header ?? {}
  const {
    className: subFooterClassName,
    _submit: _subSubmit,
    _cancel: _subCancel,
    ...subFooterProps
  } = _footer ?? {}

  return (
    <DialogResponsive
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
      {...props}
    >
      <DialogTriggerResponsive {...trigger} />
      <DialogContentResponsive
        className={cn('flex flex-col w-full h-full', subContentClassName)}
        {...subContentProps}
      >
        <div data-role-wrapper className="flex flex-col gap-4 w-full h-full">
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
            <DialogCloseResponsive asChild {..._subCancel} />
            <div
              {..._subSubmit}
              className={cn('ml-0', _subSubmit?.className)}
              onClick={(e) => {
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
  type DialogProps,
}
