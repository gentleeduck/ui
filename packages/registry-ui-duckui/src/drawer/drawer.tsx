'use client'

import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.JSX.Element {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>): React.JSX.Element {
  return <DrawerPrimitive.Trigger {...props} data-slot="drawer-trigger" />
}

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>): React.JSX.Element => (
  <DrawerPrimitive.Portal {...props} data-slot="drawer-portal" />
)

const DrawerClose = ({ ...props }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>): React.JSX.Element => {
  return <DrawerPrimitive.Close {...props} data-slot="drawer-close" />
}

const DrawerOverlay = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Overlay>): React.JSX.Element => (
  <DrawerPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    ref={ref}
    {...props}
    data-slot="drawer-overlay"
  />
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
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay {...overlay} data-slot="drawer-overlay" />
      <DrawerPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
          className,
        )}
        data-slot="drawer-content"
        ref={ref}
        {...props}>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} data-slot="drawer-header" />
  )
}
DrawerHeader.displayName = 'DrawerHeader'

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} data-slot="drawer-footer" />
}

function DrawerTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Title>): React.JSX.Element {
  return (
    <DrawerPrimitive.Title
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      data-slot="drawer-title"
      ref={ref}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Description>): React.JSX.Element {
  return (
    <DrawerPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      ref={ref}
      {...props}
      data-slot="drawer-description"
    />
  )
}

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
}
