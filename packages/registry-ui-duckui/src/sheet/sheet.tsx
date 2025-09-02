'use client'

import { cn } from '@gentleduck/libs/cn'
import { AnimDialogVariants, AnimSheetVariants, AnimVariants } from '@gentleduck/motion/anim'
import SheetPrimitive from '@gentleduck/primitives/sheet'
import type { VariantProps } from '@gentleduck/variants'
import type React from 'react'
import {
  DialogClose,
  DialogCloseX,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

function Sheet({ closeButton = true, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root closeButton={closeButton} {...props} />
}

const SheetTrigger = DialogTrigger

function SheetContent({
  children,
  className,
  renderOnce = false,
  overlay = 'default',
  closedby = 'any',
  side = 'right',
  ...props
}: DialogContentProps & VariantProps<typeof AnimSheetVariants>): React.JSX.Element {
  return (
    <SheetPrimitive.Content
      dialogClose={DialogCloseX}
      className={cn(
        AnimVariants({ overlay: overlay }),
        AnimDialogVariants({ animation: 'nothing' }),
        AnimSheetVariants({ side: side }),
        className,
        'overflow-hidden rounded-none',
      )}
      {...props}>
      <div className="flex flex-col gap-4">{children}</div>
    </SheetPrimitive.Content>
  )
}

/**
 * SheetHeader component renders a header section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - A ref to be forwarded to the component.
 * @param {string} props.className - Additional class names for styling.
 *
 * @returns {React.JSX.Element} The rendered SheetHeader component.
 */
const SheetHeader = DialogHeader
/**
 * SheetFooter component renders a footer section for a sheet.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - Additional class names for styling.
 *
 * @returns {React.JSX.Element} The rendered SheetFooter component.
 */
const SheetFooter = DialogFooter

/**
 * `SheetTitle` is a React component that forwards its ref to the `SheetTitle` component.
 * It applies additional class names for styling and accepts all props that `SheetTitle` accepts.
 *
 * @param {React.HTMLProps<HTMLHeadingElement>} props - The properties passed to the component.
 * @param {string} [props.className ] - Additional class names to apply to the component.
 * @param {React.Ref<HTMLHeadingElement>} [props.ref] - A ref to be forwarded to the `SheetTitle` component.
 * @param {React.HTMLProps<HTMLHeadingElement>} [...props] - All other props to be passed to the `SheetTitle` component.
 *
 * @returns {React.JSX.Element} The rendered `SheetTitle` component with forwarded ref and applied class names.
 */
const SheetTitle = DialogTitle

/**
 * `SheetDescription` is a React forwardRef component that wraps around `SheetDescription`.
 * It allows you to pass a `ref` and additional props to the `SheetDescription` component.
 *
 * @param {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
 * @param {string} [props.className] - A className to apply to the component.
 * @param {React.Ref} [props.ref] - A ref to be forwarded to the `SheetPrimitive.Description` component.
 * @param {React.HTMLProps<HTMLParagraphElement>} [..props] - Additional props to be passed to the component.
 *
 * @returns {React.JSX.Element} A `SheetDescription` component with forwarded ref and additional props.
 */
const SheetDescription = DialogDescription

const SheetClose = DialogClose

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
