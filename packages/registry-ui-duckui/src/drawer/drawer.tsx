'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root>
type DrawerDirection = NonNullable<DrawerRootProps['direction']>
type DrawerProps = DrawerRootProps & { dir?: Direction }

function resolveDrawerDirection(direction: DrawerDirection, dir: Direction): DrawerDirection {
  if (dir !== 'rtl') return direction
  if (direction === 'left') return 'right'
  if (direction === 'right') return 'left'
  return direction
}

function Drawer({
  direction: drawerDirection = 'bottom',
  shouldScaleBackground = true,
  dir,
  ...props
}: DrawerProps): React.JSX.Element {
  const direction = useDirection(dir as Direction)
  const resolvedDirection = resolveDrawerDirection(drawerDirection, direction)

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      direction={resolvedDirection}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  )
}
Drawer.displayName = 'Drawer'

const DrawerTrigger = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ ...props }, ref) => {
  return <DrawerPrimitive.Trigger ref={ref} {...props} data-slot="drawer-trigger" />
})
DrawerTrigger.displayName = 'DrawerTrigger'

type DrawerTriggerElement = React.ComponentRef<typeof DrawerPrimitive.Trigger>
type DrawerTriggerProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
const DrawerTriggerTyped: React.ForwardRefExoticComponent<
  DrawerTriggerProps & React.RefAttributes<DrawerTriggerElement>
> = DrawerTrigger

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>): React.JSX.Element => {
  return <DrawerPrimitive.Portal {...props} data-slot="drawer-portal" />
}
DrawerPortal.displayName = 'DrawerPortal'

const DrawerClose = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ ...props }, ref) => {
  return <DrawerPrimitive.Close ref={ref} {...props} data-slot="drawer-close" />
})
DrawerClose.displayName = 'DrawerClose'

type DrawerCloseElement = React.ComponentRef<typeof DrawerPrimitive.Close>
type DrawerCloseProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
const DrawerCloseTyped: React.ForwardRefExoticComponent<DrawerCloseProps & React.RefAttributes<DrawerCloseElement>> =
  DrawerClose

type DrawerOverlayElement = React.ComponentRef<typeof DrawerPrimitive.Overlay>
type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
const DrawerOverlay: React.ForwardRefExoticComponent<DrawerOverlayProps & React.RefAttributes<DrawerOverlayElement>> =
  React.forwardRef<DrawerOverlayElement, DrawerOverlayProps>(({ className, ...props }, ref) => {
    return (
      <DrawerPrimitive.Overlay
        className={cn('fixed inset-0 bg-black/80', className)}
        ref={ref}
        {...props}
        data-slot="drawer-overlay"
      />
    )
  })
DrawerOverlay.displayName = 'DrawerOverlay'
const DrawerOverlayTyped: React.ForwardRefExoticComponent<
  DrawerOverlayProps & React.RefAttributes<DrawerOverlayElement>
> = DrawerOverlay

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
          'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
          className,
        )}
        data-slot="drawer-content"
        ref={ref}
        {...props}>
        <div className="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = 'DrawerContent'

type DrawerContentElement = React.ComponentRef<typeof DrawerPrimitive.Content>
type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  overlay?: React.ComponentPropsWithRef<typeof DrawerOverlay>
}
const DrawerContentTyped: React.ForwardRefExoticComponent<
  DrawerContentProps & React.RefAttributes<DrawerContentElement>
> = DrawerContent

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('grid gap-1.5 p-4 [&_*]:text-center sm:[&_*]:text-start', className)}
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

type DrawerTitleElement = React.ComponentRef<typeof DrawerPrimitive.Title>
type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
const DrawerTitleTyped: React.ForwardRefExoticComponent<DrawerTitleProps & React.RefAttributes<DrawerTitleElement>> =
  DrawerTitle

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

type DrawerDescriptionElement = React.ComponentRef<typeof DrawerPrimitive.Description>
type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
const DrawerDescriptionTyped: React.ForwardRefExoticComponent<
  DrawerDescriptionProps & React.RefAttributes<DrawerDescriptionElement>
> = DrawerDescription

export {
  Drawer,
  DrawerPortal,
  DrawerOverlayTyped as DrawerOverlay,
  DrawerTriggerTyped as DrawerTrigger,
  DrawerCloseTyped as DrawerClose,
  DrawerContentTyped as DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitleTyped as DrawerTitle,
  DrawerDescriptionTyped as DrawerDescription,
}
