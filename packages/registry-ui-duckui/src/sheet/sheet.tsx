'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimSheetVariants, AnimVariants } from '@gentleduck/motion/anim'
import SheetPrimitive, { useSheetContext } from '@gentleduck/primitives/sheet'
import { VariantProps } from '@gentleduck/variants'
import { X } from 'lucide-react'
import type React from 'react'

function Sheet({ closeButton = true, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root closeButton={closeButton} {...props} />
}

function SheetTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props}>{children}</SheetPrimitive.Trigger>
}

export function SheetCloseX({
  ref,
  size = 16,
  children,
  className,
  ...props
}: React.HTMLProps<HTMLButtonElement> & {
  size?: number
}): React.JSX.Element {
  const { setOpen } = useSheetContext()

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

function SheetContent({
  children,
  className,
  side = 'right',
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Content> &
  VariantProps<typeof AnimSheetVariants>): React.JSX.Element {
  return (
    // className={cn('data-[open=false]:delay-100 data-[open=false]:duration-400 data-[open=true]:duration-400')}>
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className={cn(AnimVariants())}>
        <SheetPrimitive.Content
          SheetClose={SheetCloseX}
          className={cn(
            AnimVariants(),
            AnimSheetVariants({ side }),

            // 'data-[open=false]:fade-out-0 data-[open=true]:fade-in-0 data-[open=false]:zoom-out-95 data-[open=true]:zoom-in-95 pointer-events-none fixed top-[50%] left-[50%] z-50 flex h-fit w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-hidden text-balance rounded-lg border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-sm outline-hidden starting:[&[data-open=true]:opacity-0] data-[open=true]:pointer-events-auto data-[open=false]:animate-out data-[open=true]:animate-in data-[open=true]:opacity-100 sm:max-w-lg',
            className,
          )}
          {...props}>
          {children}
        </SheetPrimitive.Content>
      </SheetPrimitive.Overlay>
    </SheetPrimitive.Portal>
  )
}

function SheetHeader({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Heading>): React.JSX.Element {
  return (
    <SheetPrimitive.Heading
      ref={ref}
      className={cn('flex flex-col gap-1.5 text-left rtl:text-right', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div ref={ref} className={cn(`flex justify-end gap-2 sm:flex-row sm:justify-end`, className)} {...props} />
}

function SheetTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Title>): React.JSX.Element {
  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      {...props}
    />
  )
}

const SheetDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Description>): React.JSX.Element => (
  <SheetPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
)

const SheetClose = SheetPrimitive.Close

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose }
