'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import AlertDialogPrimitive, { useDialogContext } from '@gentleduck/primitives/alert-dialog'
import { X } from 'lucide-react'
import type React from 'react'

function AlertDialog({
  closeButton = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root closeButton={closeButton} {...props} data-slot="alert-dialog" />
}

function AlertDialogTrigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger {...props} data-slot="alert-dialog-trigger">
      {children}
    </AlertDialogPrimitive.Trigger>
  )
}

export function AlertDialogCloseX({
  ref,
  size = 16,
  children,
  className,
  ...props
}: React.HTMLProps<HTMLButtonElement> & {
  size?: number
}): React.JSX.Element {
  const { setOpen } = useDialogContext()

  return (
    <button
      {...props}
      aria-label="close"
      className={cn(
        "absolute absolute end-3 top-3 top-4 right-4 size-4 cursor-pointer rounded rounded-xs text-accent-foreground opacity-70 opacity-70 ring-offset-background transition-all transition-opacity hover:opacity-100 hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="alert-dialog-close-x"
      onClick={() => setOpen?.(false)}
      ref={ref}
      type="button">
      {children ?? <X aria-hidden size={size} />}
    </button>
  )
}

function AlertDialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Content>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Content
        className={cn(
          AnimVariants(),
          '-translate-x-1/2 -translate-y-1/2 pointer-events-none relative top-1/2 left-1/2 z-50 flex h-fit w-full w-full max-w-[500px] flex-col gap-4 overflow-hidden text-balance rounded-lg border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100',
          className,
        )}
        data-slot="alert-dialog-content"
        dialogClose={AlertDialogCloseX}
        {...props}>
        {children}
      </AlertDialogPrimitive.Content>
      <AlertDialogPrimitive.Overlay className={cn(AnimVariants())} data-slot="alert-dialog-overlay" />
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Heading>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Heading
      className={cn('flex flex-col gap-1.5 text-left rtl:text-right', className)}
      ref={ref}
      {...props}
      data-slot="alert-dialog-header"
    />
  )
}

function AlertDialogFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`, className)}
      ref={ref}
      {...props}
      data-slot="alert-dialog-footer"
    />
  )
}

function AlertDialogTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Title>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      ref={ref}
      {...props}
      data-slot="alert-dialog-title"
    />
  )
}

const AlertDialogDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Description>): React.JSX.Element => (
  <AlertDialogPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
    data-slot="alert-dialog-description"
  />
)

const AlertDialogAction = AlertDialogTrigger

const AlertDialogCancel = AlertDialogTrigger

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogDescription,
}
