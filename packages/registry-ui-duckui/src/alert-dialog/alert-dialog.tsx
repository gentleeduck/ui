'use client'

import DialogPrimitive from '@gentleduck/duck-primitives/dialog'
import type React from 'react'
import {
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

const AlertDialog = DialogPrimitive.Root

const AlertDialogTrigger = DialogTrigger

function AlertDialogContent({ className, children, ...props }: DialogContentProps): React.JSX.Element {
  return (
    <DialogContent closedby="closerequest" {...props}>
      {children}
    </DialogContent>
  )
}

const AlertDialogHeader = DialogHeader

/**
 * A component that renders the footer of an alert dialog.
 *
 * It uses a flexbox layout to arrange its children in a vertical column
 * on small screens and in a row with space between items on larger screens.
 *
 */
const AlertDialogFooter = DialogFooter

/**
 * `AlertDialogTitle` is a React component that forwards its ref to the `AlertDialogTitle` component.
 * It accepts all props that `AlertDialogTitle` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 */
const AlertDialogTitle = DialogTitle

/**
 * `AlertDialogDescription` is a React component that forwards its ref to the `AlertDialogPrimitive.Description` component.
 * It accepts all props that `AlertDialogPrimitive.Description` accepts, along with an optional `className` prop for additional styling.
 *
 */
const AlertDialogDescription = DialogDescription

/**
 * `AlertDialogAction` is a React component that forwards its ref to the `AlertDialogPrimitive.Action` component.
 * It accepts all the props of `AlertDialogPrimitive.Action` and an additional `className` prop for custom styling.
 *
 */
const AlertDialogAction = AlertDialogTrigger

/**
 * `AlertDialogCancel` is a React forward reference component that renders a cancel button
 * for an alert dialog using `AlertDialogPrimitive.Cancel`. It accepts all props that a
 * `AlertDialogPrimitive.Cancel` component would accept, along with an optional `className`
 * for additional styling.
 *
 */
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
