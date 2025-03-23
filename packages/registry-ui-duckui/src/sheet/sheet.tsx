'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@gentelduck/libs/cn'
import { sheetVariants } from './sheet.constants'
import { SheetContentProps, SheetWrapperProps } from './sheet.types'

/**
 * The `Sheet` component is a wrapper around the `SheetPrimitive.Root` component.
 * It serves as the root element for a sheet component, which is typically used
 * to display content in a modal or drawer-like interface.
 */
const Sheet = SheetPrimitive.Root

/**
 * A trigger component for the Sheet component.
 *
 * This component is used to open or activate the Sheet component.
 * It is a part of the SheetPrimitive library.
 */
const SheetTrigger = SheetPrimitive.Trigger

/**
 * A component that provides a close button for the Sheet component.
 * This is a wrapper around the `SheetPrimitive.Close` component.
 */
const SheetClose = SheetPrimitive.Close

/**
 * A portal component for rendering the Sheet component outside of its parent hierarchy.
 * This is useful for rendering the Sheet in a different part of the DOM tree, such as at the root level.
 */
const SheetPortal = SheetPrimitive.Portal

/**
 * `SheetOverlay` is a React component that renders an overlay for a sheet component.
 * It uses `React.forwardRef` to pass a ref to the underlying `SheetPrimitive.Overlay` component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the overlay.
 * @param {React.Ref} ref - The ref to be forwarded to the `SheetPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

/**
 * `SheetContent` is a React component that renders the content of a sheet.
 * It uses `React.forwardRef` to pass a ref to the underlying `SheetPrimitive.Content` component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.side='right'] - The side of the sheet where the content will appear. Defaults to 'right'.
 * @param {string} [props.className] - Additional class names to apply to the content.
 * @param {React.ReactNode} props.children - The content to be rendered inside the sheet.
 * @param {React.Ref} ref - The ref to be forwarded to the `SheetPrimitive.Content` component.
 *
 * @returns {JSX.Element} The rendered sheet content.
 */

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className='absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'>
        <X className='h-4 w-4' />
        <span className='sr-only'>Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

/**
 * SheetHeader component renders a header section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 *
 * @returns {JSX.Element} The rendered SheetHeader component.
 */
function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
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
SheetHeader.displayName = 'SheetHeader'

/**
 * SheetFooter component renders a footer section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 *
 * @returns {JSX.Element} The rendered SheetFooter component.
 */
function SheetFooter({
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
SheetFooter.displayName = 'SheetFooter'

/**
 * `SheetTitle` is a React component that forwards its ref to the `SheetPrimitive.Title` component.
 * It applies additional class names for styling and accepts all props that `SheetPrimitive.Title` accepts.
 *
 * @param {string} className - Additional class names to apply to the component.
 * @param {React.Ref} ref - A ref to be forwarded to the `SheetPrimitive.Title` component.
 * @param {React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>} props - All other props to be passed to the `SheetPrimitive.Title` component.
 *
 * @returns {JSX.Element} The rendered `SheetPrimitive.Title` component with forwarded ref and applied class names.
 */
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

/**
 * `SheetDescription` is a React forwardRef component that wraps around `SheetPrimitive.Description`.
 * It allows you to pass a `ref` and additional props to the `SheetPrimitive.Description` component.
 *
 * @param {string} className - Additional class names to apply to the component.
 * @param {React.Ref} ref - A ref to be forwarded to the `SheetPrimitive.Description` component.
 * @param {React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>} props - Additional props to be passed to the component.
 *
 * @returns {JSX.Element} A `SheetPrimitive.Description` component with forwarded ref and additional props.
 */
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

/**
 * `SheetWrapper` is a React component that wraps a `Sheet` component and renders children elements
 * conditionally based on the screen size. If the screen width is 768px or greater, a `Drawer` is rendered; otherwise,
 * a `Sheet` is rendered.
 * @param {SheetWrapperProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `Drawer` or `Sheet` component.
 */
function SheetWrapper({
  trigger,
  content,
  duckHook,
  ...props
}: SheetWrapperProps): JSX.Element {
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
    <Sheet
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
      {...props}
    >
      <SheetTrigger {...trigger} />
      <SheetContent
        className={cn('flex flex-col w-full h-full', subContentClassName)}
        {...subContentProps}
      >
        <div data-role-wrapper className='flex flex-col gap-4 w-full h-full'>
          {_header && (
            <SheetHeader {...subHeaderProps}>
              {subHeaderProps.children ? (
                subHeaderProps.children
              ) : (
                <>
                  <SheetTitle {...subTitle} />
                  <SheetDescription {...subDescription} />
                </>
              )}
            </SheetHeader>
          )}
          {subcontentChildren}
          <SheetFooter
            className={cn('gap-2', subFooterClassName)}
            {...subFooterProps}
          >
            <SheetClose asChild {..._subCancel} />
            <div
              {..._subSubmit}
              className={cn('ml-0', _subSubmit?.className)}
              onClick={(e) => {
                duckHook?.setState({ shape: false, alert: false })
                _subSubmit?.onClick?.(e)
              }}
            />
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
SheetWrapper.displayName = 'SheetWrapper'

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetWrapper,
}
