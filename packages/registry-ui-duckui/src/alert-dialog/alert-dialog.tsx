'use client'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as React from 'react'

import { cn } from '@gentelduck/libs/cn'
import { buttonVariants } from '../button'
// import { DialogWrapper } from '../dialog'
// import { DrawerWrapper } from '../drawer'
import { SheetWrapper } from '../sheet'
import { useDuckAlert } from './alert-dialog.hook'
import {
  AlertDialogDialogProps,
  AlertDialogDrawerProps,
  AlertDialogSheetProps,
  AlertDialogWrapperType,
} from './alert-dialog.types'

/**
 * A component that renders an alert dialog using the AlertDialogPrimitive.Root component.
 */
const AlertDialog =
  AlertDialogPrimitive.Root as typeof AlertDialogPrimitive.Root

/**
 * A component that serves as the trigger for an alert dialog.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * A component that renders the AlertDialog content inside a portal.
 * This is a wrapper around the `AlertDialogPrimitive.Portal` component.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * `AlertDialogOverlay` is a React forward reference component that renders an overlay for an alert dialog.
 * It uses `AlertDialogPrimitive.Overlay` as the base component and applies additional styles and animations.
 *
 * @param {string} className - Additional class names to apply to the content.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>} props - Additional props to pass to the overlay component.
 * @param {React.ElementRef} ref - Ref to be forwarded to the `AlertDialogPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * `AlertDialogContent` is a React component that renders the content of an alert dialog.
 * It uses `React.forwardRef` to pass a ref to the underlying `AlertDialogPrimitive.Content` component.
 *
 * @param {string} className - Additional class names to apply to the content.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>} props - Additional props to pass to the `AlertDialogPrimitive.Content` component.
 * @param {React.ElementRef} ref - Ref to be forwarded to the `AlertDialogPrimitive.Content` component.
 *
 * @returns {JSX.Element} The rendered alert dialog content.
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * A component that renders the header of an alert dialog.
 * It uses a flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {string} className - Additional class names to apply to the content.
 * @param {React.HTMLAttributes<HTMLDivElement>} ...props - The properties passed to the component.
 *
 * @returns {JSX.Element} The rendered header component.
 */
function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col space-y-2 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
}
AlertDialogHeader.displayName = 'AlertDialogHeader'

/**
 * A component that renders the footer of an alert dialog.
 *
 * It uses a flexbox layout to arrange its children in a vertical column
 * on small screens and in a row with space between items on larger screens.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names for styling.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
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
AlertDialogFooter.displayName = 'AlertDialogFooter'

/**
 * `AlertDialogTitle` is a React component that forwards its ref to the `AlertDialogPrimitive.Title` component.
 * It accepts all props that `AlertDialogPrimitive.Title` accepts, along with an optional `className` prop
 * to apply additional CSS classes.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>} props - The props for the component.
 * @param {React.ElementRef} ref - The ref to be forwarded to the `AlertDialogPrimitive.Title` component.
 *
 * @returns {JSX.Element} The rendered `AlertDialogPrimitive.Title` component with forwarded ref and applied props.
 */
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

/**
 * `AlertDialogDescription` is a React component that forwards its ref to the `AlertDialogPrimitive.Description` component.
 * It accepts all props that `AlertDialogPrimitive.Description` accepts, along with an optional `className` prop for additional styling.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>} props - The props for the component.
 * @param {React.ElementRef} ref - The ref to be forwarded to the `AlertDialogPrimitive.Description` component.
 *
 * @returns {JSX.Element} The rendered `AlertDialogPrimitive.Description` component with forwarded ref and applied class names.
 */
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
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * `AlertDialogAction` is a React component that forwards its ref to the `AlertDialogPrimitive.Action` component.
 * It accepts all the props of `AlertDialogPrimitive.Action` and an additional `className` prop for custom styling.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>} props - All other props are passed through to the `AlertDialogPrimitive.Action` component.
 * @param {React.ElementRef} ref - A ref that will be forwarded to the `AlertDialogPrimitive.Action` component.
 *
 * @returns {JSX.Element} The rendered `AlertDialogPrimitive.Action` component with forwarded ref and applied class names.
 */
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

/**
 * `AlertDialogCancel` is a React forward reference component that renders a cancel button
 * for an alert dialog using `AlertDialogPrimitive.Cancel`. It accepts all props that a
 * `AlertDialogPrimitive.Cancel` component would accept, along with an optional `className`
 * for additional styling.
 *
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>} props - The properties passed to the component.
 * @param {React.ElementRef} ref - The reference to be forwarded to the `AlertDialogPrimitive.Cancel` component.
 *
 * @returns {JSX.Element} The rendered cancel button for the alert dialog.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
))

AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

/**
 * Renders an alert dialog and a sheet component, managing their open states
 * and handling user interactions through provided callbacks.
 *
 * @param {AlertDialogWrapperType} props - The properties for configuring the AlertDialogWrapper.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a sheet with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */
export function AlertDialogWrapper({
  alertTrigger,
  alertContent,
  duckHook,
}: AlertDialogWrapperType) {
  const { _header, _footer, ...contentProps } = alertContent ?? {}
  const { _title, _description, ...headerProps } = _header ?? {}
  const { _submit, _cancel, ...footerProps } = _footer ?? {}

  return (
    <AlertDialog open={duckHook?.state.alert}>
      <AlertDialogTrigger
        {...alertTrigger}
        onClick={(e) => {
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
            onClick={(e) => {
              duckHook?.handleAlertCancel()
              _cancel?.onClick?.(e)
            }}
            asChild
          >
            {_cancel?.children ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            {..._submit}
            onClick={(e) => {
              duckHook?.handleAlertContinue()
              _submit?.onClick?.(e)
            }}
            asChild
          >
            {_submit?.children ?? 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * AlertDialogSheet is a component that provides a structured layout for displaying
 * an alert dialog with a trigger, content, header, footer, and actions, as well as
 * a sheet with nested content and customizable headers and footers. The component
 * handles user interactions with cancel and continue actions, updating the state
 * and invoking provided callbacks.
 *
 * @param {AlertDialogSheetProps} props - The properties for configuring the AlertDialogSheet.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a sheet with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */
function AlertDialogSheet<T = string>({
  alertTrigger,
  alertContent,
  content,
  state,
}: AlertDialogSheetProps<T>) {
  const duckHook = useDuckAlert({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
      <SheetWrapper content={content} duckHook={duckHook} />
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
 * @param {AlertDialogDrawerProps} props - The properties for configuring the AlertDialogDrawer.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a drawer with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */

function AlertDialogDrawer<T = string>({
  alertTrigger,
  alertContent,
  // content,
  state,
}: AlertDialogDrawerProps<T>) {
  const duckHook = useDuckAlert<T>({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
    </>
    // <DrawerWrapper content={content} duckHook={duckHook} />
  )
}

AlertDialogSheet.displayName = 'AlertDialogDrawer'

/**
 * Renders an alert dialog and a dialog component, managing their open states
 * and handling user interactions through provided callbacks.
 *
 * @template T
 * @param {AlertDialogDialogProps} props - The properties for configuring the AlertDialogDialog.
 *
 * The component utilizes the `useDuckAlert` hook for managing its internal state
 * and provides a structured layout for displaying an alert dialog with a trigger,
 * content, header, footer, and actions, as well as a dialog with nested content
 * and customizable headers and footers. The component handles user interactions
 * with cancel and continue actions, updating the state and invoking provided callbacks.
 */

function AlertDialogDialog<T = string>({
  alertTrigger,
  alertContent,
  // content,
  state,
}: AlertDialogDialogProps<T>) {
  const duckHook = useDuckAlert<T>({ state })

  return (
    <>
      <AlertDialogWrapper
        alertTrigger={alertTrigger}
        alertContent={alertContent}
        duckHook={duckHook}
      />
      {/* ! FIX: create DialogWrapper  */}
      {/* <DialogWrapper content={content} duckHook={duckHook} /> */}
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
