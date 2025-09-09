'use client'

import { cn } from '@gentleduck/libs/cn'
import DialogPrimitive from '@gentleduck/primitives/dialog'
import type React from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../dialog'

const AlertDialog = DialogPrimitive.Root

const AlertDialogTrigger = DialogTrigger

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>): React.JSX.Element {
  return (
    <DialogContent className={cn('w-full max-w-[500px]', className)} {...props}>
      {children}
    </DialogContent>
  )
}

const AlertDialogHeader = DialogHeader

const AlertDialogFooter = DialogFooter

const AlertDialogTitle = DialogTitle

const AlertDialogDescription = DialogDescription

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
