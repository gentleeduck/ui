'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/lib/utils'
import { DrawerWrapperProps } from './drawer.types'

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = 'Drawer'

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

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

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
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

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

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

function DrawerWrapper({ trigger, content, duckHook }: DrawerWrapperProps) {
  const { className: subContentClassName, children: subcontentChildren, _header, _footer, ...subContentProps } = content
  const {
    className: subHeaderClassName,
    _description: subDescription,
    _title: subTitle,
    ...subHeaderProps
  } = _header ?? {}
  const { className: subFooterClassName, _submit: _subSubmit, _cancel: _subCancel, ...subFooterProps } = _footer ?? {}

  return (
    <Drawer
      open={duckHook?.state.shape}
      onOpenChange={duckHook?.handleOpenChange}
    >
      <DrawerTrigger {...trigger} />
      <DrawerContent
        className={cn('flex flex-col w-full h-full', subContentClassName)}
        {...subContentProps}
      >
        <div
          data-role-wrapper
          className="flex flex-col gap-4 w-full h-full"
        >
          {_header && (
            <DrawerHeader {...subHeaderProps}>
              {subHeaderProps.children ? (
                subHeaderProps.children
              ) : (
                <>
                  <DrawerTitle {...subTitle} />
                  <DrawerDescription {...subDescription} />
                </>
              )}
            </DrawerHeader>
          )}
          {subcontentChildren}
          <DrawerFooter
            className={cn('gap-2', subFooterClassName)}
            {...subFooterProps}
          >
            <DrawerClose
              asChild
              {..._subCancel}
            />
            <div
              {..._subSubmit}
              className={cn('ml-0', _subSubmit?.className)}
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
