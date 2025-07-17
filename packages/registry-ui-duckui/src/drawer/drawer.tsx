'use client'

import type * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import type { DrawerWrapperProps } from './drawer.types'
import { cn } from '@gentleduck/libs/cn'

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.JSX.Element {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
}

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Overlay>): React.JSX.Element => (
  <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
)

function DrawerContent({
  className,
  children,
  overlay,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Content> & {
  overlay?: React.ComponentPropsWithRef<typeof DrawerOverlay>
}): React.JSX.Element {
  return (
    <DrawerPortal>
      <DrawerOverlay {...overlay} />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
          className,
        )}
        {...props}>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
}
DrawerHeader.displayName = 'DrawerHeader'

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Title>): React.JSX.Element {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Description>): React.JSX.Element {
  return <DrawerPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function DrawerWrapper({ trigger, content, duckHook, ...props }: DrawerWrapperProps): React.JSX.Element {
  const { className: contentClassName, children: contentChildren, _header, _footer, ...contentProps } = content
  const { className: headerClassName, _description, _title, ...headerProps } = _header ?? {}
  const { className: footerClassName, _submit: _subSubmit, _cancel: _subCancel, ...footerProps } = _footer ?? {}

  return (
    <Drawer open={duckHook?.state.shape} onOpenChange={duckHook?.handleOpenChange} {...props}>
      <DrawerTrigger {...trigger} />
      <DrawerContent className={cn('flex h-full w-full flex-col', contentClassName)} {...contentProps}>
        <div data-role-wrapper className="flex h-full w-full flex-col gap-4">
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
          <DrawerFooter className={cn('items-ceter flex gap-2', footerClassName)} {...footerProps}>
            <DrawerClose asChild {..._subCancel} />
            <div
              {..._subSubmit}
              className={cn('w-full', _subSubmit?.className)}
              onClick={(e) => {
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
