'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import DialogPrimitive, { useDialogContext } from '@gentleduck/primitives/dialog'
import { X } from 'lucide-react'
import type React from 'react'

function Dialog({ closeButton = true, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root closeButton={closeButton} {...props} data-slot="dialog" />
}

function DialogTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger {...props} data-slot="dialog-trigger">
      {children}
    </DialogPrimitive.Trigger>
  )
}

export function DialogCloseX({
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
      data-slot="dialog-close-x"
      onClick={() => setOpen?.(false)}
      ref={ref}
      type="button">
      {children ?? <X aria-hidden size={size} />}
    </button>
  )
}

function DialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>): React.JSX.Element {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogPrimitive.Content
        className={cn(
          AnimVariants(),
          '-translate-x-1/2 -translate-y-1/2 pointer-events-none relative top-1/2 left-1/2 z-50 flex h-fit w-full flex-col gap-4 overflow-hidden text-balance rounded-lg border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100',
          className,
        )}
        data-slot="dialog-content"
        dialogClose={DialogCloseX}
        {...props}>
        {children}
      </DialogPrimitive.Content>
      <DialogPrimitive.Overlay className={cn(AnimVariants())} data-slot="dialog-overlay" />
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Heading>): React.JSX.Element {
  return (
    <DialogPrimitive.Heading
      className={cn('flex flex-col gap-1.5 text-left rtl:text-right', className)}
      data-slot="dialog-header"
      ref={ref}
      {...props}
    />
  )
}

function DialogFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`, className)}
      ref={ref}
      {...props}
      data-slot="dialog-footer"
    />
  )
}

function DialogTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      data-slot="dialog-title"
      ref={ref}
      {...props}
    />
  )
}

const DialogDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>): React.JSX.Element => (
  <DialogPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
    data-slot="dialog-description"
  />
)

const DialogClose = DialogTrigger

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose }
