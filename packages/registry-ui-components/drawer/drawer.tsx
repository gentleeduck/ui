'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/lib/utils'
import { DrawerWrapperProps } from './drawer.types'

/**
 * `Drawer` is a React component that renders a drawer interface.
 *
 * @param {React.ComponentProps<typeof DrawerPrimitive.Root>} props - The props to be passed to the `DrawerPrimitive.Root` component.
 * @param {boolean} [shouldScaleBackground] - If true, the drawer will scale the background when it is open.
 *
 * @returns {JSX.Element} The rendered `DrawerPrimitive.Root` component.
 */
function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): JSX.Element {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  )
}
Drawer.displayName = 'Drawer'

/**
 * A component that serves as the trigger for opening the Drawer.
 * It is a wrapper around the `DrawerPrimitive.Trigger` component.
 *
 * @component
 */
const DrawerTrigger = DrawerPrimitive.Trigger

/**
 * A component that provides a portal for rendering the Drawer component.
 * This allows the Drawer to be rendered outside of its parent component's DOM hierarchy.
 */
const DrawerPortal = DrawerPrimitive.Portal

/**
 * A component that represents the close button for the Drawer component.
 * It is a wrapper around the `DrawerPrimitive.Close` component.
 */
const DrawerClose = DrawerPrimitive.Close

/**
 * `DrawerOverlay` is a React component that renders an overlay for a drawer.
 * It uses `React.forwardRef` to pass down a ref to the underlying `DrawerPrimitive.Overlay` component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the overlay.
 * @param {React.Ref} ref - The reference to be forwarded to the `DrawerPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * `DrawerContent` is a React component that renders the content of a drawer using `DrawerPrimitive.Content`.
 * It is wrapped in a `DrawerPortal` and includes a `DrawerOverlay`.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the drawer content.
 * @param {React.ReactNode} props.children - The content to be rendered inside the drawer.
 * @param {object} props.overlay - The properties passed to the `DrawerOverlay` component.
 * @param {React.Ref} ref - The reference to the drawer content element.
 *
 * @returns {JSX.Element} The rendered drawer content component.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    overlay?: React.ComponentPropsWithoutRef<typeof DrawerOverlay>
  }
>(({ className, children, overlay, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay {...overlay} />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

/**
 * A component that renders the header of a drawer.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the header.
 *
 * @returns {JSX.Element} The rendered header component.
 */
function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
      {...props}
    />
  )
}
DrawerHeader.displayName = 'DrawerHeader'

/**
 * A component that renders the footer of a drawer.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the footer.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}
DrawerFooter.displayName = 'DrawerFooter'

/**
 * `DrawerTitle` is a React component that forwards its ref to the `DrawerPrimitive.Title` component.
 * It applies additional class names for styling and accepts all props that `DrawerPrimitive.Title` accepts.
 *
 * @param {string} className - Additional class names to apply to the component.
 * @param {React.Ref} ref - A ref that will be forwarded to the `DrawerPrimitive.Title` component.
 * @param {object} props - Additional props to be passed to the `DrawerPrimitive.Title` component.
 *
 * @returns {JSX.Element} The rendered `DrawerPrimitive.Title` component with forwarded ref and applied class names.
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * `DrawerDescription` is a React component that forwards its ref to the `DrawerPrimitive.Description` component.
 * It accepts all props that `DrawerPrimitive.Description` accepts, along with an optional `className` prop.
 *
 * @param {Object} props - The props for the component.
 * @param {string} [props.className] - An optional class name to apply to the component.
 * @param {React.Ref} ref - The ref to be forwarded to the `DrawerPrimitive.Description` component.
 *
 * @returns {JSX.Element} The rendered `DrawerPrimitive.Description` component with forwarded ref and applied class names.
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

/**
 * `DrawerWrapper` is a React component that wraps a `Drawer` component and renders children elements
 * conditionally based on the screen size. If the screen width is 768px or greater, a `Drawer` is rendered; otherwise,
 * a `Sheet` is rendered.
 * @param {DrawerWrapperProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `Drawer` or `Sheet` component.
 */
function DrawerWrapper({ trigger, content, duckHook, ...props }: DrawerWrapperProps): JSX.Element {
  const { className: contentClassName, children: contentChildren, _header, _footer, ...contentProps } = content
  const { className: headerClassName, _description, _title, ...headerProps } = _header ?? {}
  const { className: footerClassName, _submit: _subSubmit, _cancel: _subCancel, ...footerProps } = _footer ?? {}

  return (
    <Drawer
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
      {...props}
    >
      <DrawerTrigger {...trigger} />
      <DrawerContent
        className={cn('flex flex-col w-full h-full', contentClassName)}
        {...contentProps}
      >
        <div
          data-role-wrapper
          className="flex flex-col gap-4 w-full h-full"
        >
          {_header && (
            <DrawerHeader {...headerProps}>
              {headerProps.children ? (
                headerProps.children
              ) : (
                <>
                  <DrawerTitle {..._title} />
                  <DrawerDescription {..._description} />
                </>
              )}
            </DrawerHeader>
          )}
          {contentChildren}
          <DrawerFooter
            className={cn('flex items-ceter gap-2', footerClassName)}
            {...footerProps}
          >
            <DrawerClose
              asChild
              {..._subCancel}
            />
            <div
              {..._subSubmit}
              className={cn('w-full', _subSubmit?.className)}
              onClick={e => {
                duckHook?.setState({ shape: false, alert: false })
                _subSubmit?.onClick?.(e)
              }}
            />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
DrawerWrapper.displayName = 'DrawerWrapper'

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerWrapper,
}
