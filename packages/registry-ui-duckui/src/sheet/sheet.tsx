'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimVariants } from '@gentleduck/motion/anim'
import SheetPrimitive, { useSheetContext } from '@gentleduck/primitives/sheet'
import type { VariantProps } from '@gentleduck/variants'
import { X } from 'lucide-react'
import type React from 'react'
import { AnimSheetVariants } from './sheet.constants'

function Sheet({ closeButton = true, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root closeButton={closeButton} {...props} data-slot="sheet" />
}

function SheetTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>) {
  return (
    <SheetPrimitive.Trigger {...props} data-slot="sheet-trigger">
      {children}
    </SheetPrimitive.Trigger>
  )
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
      aria-label="close"
      className={cn(
        'absolute end-3 top-3 size-4 cursor-pointer rounded text-accent-foreground opacity-70 transition-all hover:opacity-100',
        className,
      )}
      data-slot="sheet-close"
      onClick={() => setOpen?.(false)}
      ref={ref}
      type="button">
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
    <SheetPrimitive.Portal data-slot="sheet-content">
      <SheetPrimitive.Content
        className={cn(AnimSheetVariants({ side }), className)}
        data-slot="sheet-content"
        SheetClose={SheetCloseX}
        {...props}>
        {children}
      </SheetPrimitive.Content>
      <SheetPrimitive.Overlay className={cn(AnimVariants())} data-slot="sheet-overlay" />
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
      className={cn('flex flex-col gap-1.5 text-left rtl:text-right', className)}
      data-slot="sheet-header"
      ref={ref}
      {...props}
    />
  )
}

function SheetFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(`flex justify-end gap-2 sm:flex-row sm:justify-end`, className)}
      ref={ref}
      {...props}
      data-slot="sheet-footer"
    />
  )
}

function SheetTitle({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Title>): React.JSX.Element {
  return (
    <SheetPrimitive.Title
      className={cn('font-semibold text-lg leading-none tracking-tight', className)}
      data-slot="sheet-title"
      ref={ref}
      {...props}
    />
  )
}

const SheetDescription = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SheetPrimitive.Description>): React.JSX.Element => (
  <SheetPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
    data-slot="sheet-description"
  />
)

const SheetClose = SheetTrigger

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose }
