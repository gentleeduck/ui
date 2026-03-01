'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> & {
  dir?: Direction
}

function resolveDrawerDirection(
  direction: NonNullable<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>['direction']>,
  dir: Direction,
) {
  if (dir !== 'rtl') return direction
  if (direction === 'left') return 'right'
  if (direction === 'right') return 'left'
  return direction
}

function Drawer({ direction: drawerDirection = 'bottom', shouldScaleBackground = true, dir, ...props }: DrawerProps) {
  const direction = useDirection(dir)
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

const DrawerTrigger: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger> &
    React.RefAttributes<React.ComponentRef<typeof DrawerPrimitive.Trigger>>
> = React.forwardRef((props, ref) => <DrawerPrimitive.Trigger ref={ref} {...props} data-slot="drawer-trigger" />)
DrawerTrigger.displayName = 'DrawerTrigger'

const DrawerPortal: React.FC<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>> = (props) => (
  <DrawerPrimitive.Portal {...props} data-slot="drawer-portal" />
)
DrawerPortal.displayName = 'DrawerPortal'

const DrawerClose: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close> &
    React.RefAttributes<React.ComponentRef<typeof DrawerPrimitive.Close>>
> = React.forwardRef((props, ref) => <DrawerPrimitive.Close ref={ref} {...props} data-slot="drawer-close" />)
DrawerClose.displayName = 'DrawerClose'

const DrawerOverlay: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> &
    React.RefAttributes<React.ComponentRef<typeof DrawerPrimitive.Overlay>>
> = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 bg-black/80', className)}
    {...props}
    data-slot="drawer-overlay"
  />
))
DrawerOverlay.displayName = 'DrawerOverlay'

type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  dir?: Direction
  overlayProps?: React.ComponentPropsWithoutRef<typeof DrawerOverlay>
}

const DrawerContent: React.ForwardRefExoticComponent<
  DrawerContentProps & React.RefAttributes<React.ComponentRef<typeof DrawerPrimitive.Content>>
> = React.forwardRef(({ className, children, dir, overlayProps, ...props }, ref) => {
  const direction = useDirection(dir)

  return (
    <DrawerPortal>
      <DrawerOverlay {...overlayProps} />
      <DrawerPrimitive.Content
        ref={ref}
        dir={direction}
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',

          // top
          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',

          // bottom
          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',

          // right
          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',

          // left
          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',

          className,
        )}
        {...props}>
        <div className="mx-auto mt-4 hidden h-2 w-25 shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid gap-1.5 p-4 **:text-center sm:**:text-start', className)}
      {...props}
      data-slot="drawer-header"
    />
  ),
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { dir?: Direction }>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir)
    return (
      <div
        ref={ref}
        dir={direction}
        className={cn('mt-auto flex flex-col gap-2 p-4', className)}
        {...props}
        data-slot="drawer-footer"
      />
    )
  },
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & { dir?: Direction } & React.RefAttributes<
      React.ComponentRef<typeof DrawerPrimitive.Title>
    >
> = React.forwardRef(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir)
  return (
    <DrawerPrimitive.Title
      ref={ref}
      dir={direction}
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      data-slot="drawer-title"
      {...props}
    />
  )
})
DrawerTitle.displayName = 'DrawerTitle'

const DrawerDescription: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & { dir?: Direction } & React.RefAttributes<
      React.ComponentRef<typeof DrawerPrimitive.Description>
    >
> = React.forwardRef(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir)
  return (
    <DrawerPrimitive.Description
      ref={ref}
      dir={direction}
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="drawer-description"
      {...props}
    />
  )
})
DrawerDescription.displayName = 'DrawerDescription'

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
