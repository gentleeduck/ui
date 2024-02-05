'use client'
import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/registry/registry-ui-components'
import {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Sheet,
} from '@/registry/default/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/registry/default/ui/drawer'
import { useDuckAlert } from './alert-dialog.hook'
import {
  AlertDialogDialogProps,
  AlertDialogDrawerProps,
  AlertDialogSheetProps,
  AlertDialogWrapperType,
} from './alert-dialog.types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/default/ui/ShadcnUI/dialog'
import { DrawerWrapper } from '../drawer'
import { SheetWrapper } from '../sheet'
import { DialogWrapper } from '../dialog'

//NOTE: Alert Dialog Primitive
const AlertDialog = AlertDialogPrimitive.Root as typeof AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

//NOTE: Alert Dialog Overlay
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

//NOTE: Alert Dialog Content
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

//NOTE: Alert Dialog Header
function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}
AlertDialogHeader.displayName = 'AlertDialogHeader'

//NOTE: Alert Dialog Footer
function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  )
}
AlertDialogFooter.displayName = 'AlertDialogFooter'

//NOTE: Alert Dialog Title
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

//NOTE: Alert Dialog Description
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

//NOTE: Alert Dialog Action
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

//NOTE: Alert Dialog Cancel
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
))

AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export function AlertDialogWrapper({ alertTrigger, alertContent, duckHook }: AlertDialogWrapperType) {
  const { _header: contentHeader, _footer: contentFooter, ...contentProps } = alertContent ?? {}
  const { _title, _description, ...headerProps } = contentHeader ?? {}
  const { _submit, _cancel, ...footerProps } = contentFooter ?? {}

  return (
    <AlertDialog open={duckHook?.state.alert}>
      <AlertDialogTrigger
        {...alertTrigger}
        onClick={e => {
          duckHook?.setState({ shape: true, alert: false })
          alertTrigger?.onClick?.(e)
        }}
      />
      <AlertDialogContent {...contentProps}>
        <AlertDialogHeader {...headerProps}>
          {headerProps.children ? (
            headerProps.children
          ) : (
            <>
              <AlertDialogTitle {..._title} />
              <AlertDialogDescription {..._description} />
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter {...footerProps}>
          <AlertDialogCancel
            {..._cancel}
            children={!_cancel?.children && 'Cancel'}
            onClick={e => {
              duckHook?.handleAlertCancel()
              _cancel?.onClick?.(e)
            }}
          />
          <AlertDialogAction
            {..._submit}
            children={!_submit?.children && 'Continue'}
            onClick={e => {
              duckHook?.handleAlertContinue()
              _submit?.onClick?.(e)
            }}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Renders an alert dialog and a sheet component, managing their open states
 * and handling user interactions through provided callbacks.
 *
 * @template T
 * @param {Object} props - The properties for configuring the AlertDialogSheet.
 * @param {Object} props.alertTrigger - Props for the alert dialog trigger.
 * @param {Object} props.alertContent - Configuration for the alert dialog content.
 * @param {Object} props.content - Configuration for the sheet content.
 * @param {boolean} props.state - Initial state for controlling the dialog and sheet visibility.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a sheet with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */
function AlertDialogSheet<T = string>({ alertTrigger, alertContent, content, state }: AlertDialogSheetProps<T>) {
  const duckHook = useDuckAlert({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
      <SheetWrapper
        content={content}
        duckHook={duckHook}
      />
    </>
  )
}

AlertDialogSheet.displayName = 'AlertDialogSheet'

/**
 * AlertDialogDrawer is a component that provides a structured layout for displaying
 * an alert dialog with a trigger, content, header, footer, and actions, as well as
 * a drawer with nested content and customizable headers and footers. The component
 * handles user interactions with cancel and continue actions, updating the state
 * and invoking provided callbacks.
 *
 * @param {Object} props - The properties for configuring the AlertDialogDrawer.
 * @param {Object} props.alertTrigger - Props for the alert dialog trigger.
 * @param {Object} props.alertContent - Configuration for the alert dialog content.
 * @param {Object} props.content - Configuration for the drawer content.
 * @param {boolean} props.state - Initial state for controlling the dialog and drawer visibility.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a drawer with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */

function AlertDialogDrawer<T = string>({ alertTrigger, alertContent, content, state }: AlertDialogDrawerProps<T>) {
  const duckHook = useDuckAlert<T>({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
      <DrawerWrapper
        content={content}
        duckHook={duckHook}
      />
    </>
  )
}

AlertDialogSheet.displayName = 'AlertDialogDrawer'

/**
 * Renders an alert dialog and a dialog component, managing their open states
 * and handling user interactions through provided callbacks.
 *
 * @template T
 * @param {Object} props - The properties for configuring the AlertDialogDialog.
 * @param {Object} props.alertTrigger - Props for the alert dialog trigger.
 * @param {Object} props.alertContent - Configuration for the alert dialog content.
 * @param {Object} props.content - Configuration for the dialog content.
 * @param {boolean} props.state - Initial state for controlling the dialog and alert visibility.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a dialog with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */

function AlertDialogDialog<T = string>({ alertTrigger, alertContent, content, state }: AlertDialogDialogProps<T>) {
  const duckHook = useDuckAlert<T>({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
      <DialogWrapper
        content={content}
        duckHook={duckHook}
      />
    </>
  )
}

AlertDialogSheet.displayName = 'AlertDialogDialog'

export {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogSheet,
  AlertDialogDrawer,
  AlertDialogDialog,
}
