'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.JSX.Element {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
}
Drawer.displayName = 'Drawer'

const DrawerTrigger = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ ...props }, ref) => {
  return <DrawerPrimitive.Trigger ref={ref} {...props} data-slot="drawer-trigger" />
})
DrawerTrigger.displayName = 'DrawerTrigger'

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>): React.JSX.Element => (
  <DrawerPrimitive.Portal {...props} data-slot="drawer-portal" />
)
DrawerPortal.displayName = 'DrawerPortal'

const DrawerClose = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ ...props }, ref) => {
  return <DrawerPrimitive.Close ref={ref} {...props} data-slot="drawer-close" />
})
DrawerClose.displayName = 'DrawerClose'

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn('fixed inset-0 bg-black/80', className)}
    ref={ref}
    {...props}
    data-slot="drawer-overlay"
  />
))
DrawerOverlay.displayName = 'DrawerOverlay'

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    overlay?: React.ComponentPropsWithRef<typeof DrawerOverlay>
  }
>(({ className, children, overlay, ...props }, ref) => {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay {...overlay} data-slot="drawer-overlay" />
      <DrawerPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
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
})
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('grid gap-1.5 p-4 text-center sm:text-start', className)}
        ref={ref}
        {...props}
        data-slot="drawer-header"
      />
    )
  },
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('mt-auto flex flex-col gap-2 p-4', className)}
        ref={ref}
        {...props}
        data-slot="drawer-footer"
      />
    )
  },
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Title
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      data-slot="drawer-title"
      ref={ref}
      {...props}
    />
  )
})
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      ref={ref}
      {...props}
      data-slot="drawer-description"
    />
  )
})
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

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
