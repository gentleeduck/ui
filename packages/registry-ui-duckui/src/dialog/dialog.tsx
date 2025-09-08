'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import DialogPrimitive, { useDialogContext } from '@gentleduck/primitives/dialog'
import { VariantProps } from '@gentleduck/variants'
import { X } from 'lucide-react'
import type React from 'react'

function Dialog({ closeButton = true, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root closeButton={closeButton} {...props} />
}

function DialogTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
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
      ref={ref}
      type="button"
      aria-label="close"
      className={cn(
        'absolute end-3 top-3 size-4 cursor-pointer rounded text-accent-foreground opacity-70 transition-all hover:opacity-100',
        className,
      )}
      onClick={() => setOpen?.(false)}>
      {children ?? <X aria-hidden size={size} />}
    </button>
  )
}

function DialogContent({
  children,
  className,
  renderOnce = false,
  animation = 'default',
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof AnimVariants> &
  VariantProps<typeof AnimDialogVariants> & {
    renderOnce?: boolean
    sideOffset?: number
  }): React.JSX.Element {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.OverLay className={cn(AnimVariants())}>
        <DialogPrimitive.Content
          renderOnce={renderOnce}
          dialogClose={DialogCloseX}
          className={cn(AnimVariants(), AnimDialogVariants({ animation: animation }), className)}
          {...props}>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.OverLay>
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
      ref={ref}
      className={cn('flex flex-col gap-1.5 text-left rtl:text-right', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div ref={ref} className={cn(`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`, className)} {...props} />
  )
}

function DialogTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      {...props}
    />
  )
}

const DialogDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>): React.JSX.Element => (
  <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
)

const DialogClose = DialogTrigger

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose }
