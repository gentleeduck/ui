'use client'
import { useMediaQuery } from '@gentleduck/hooks/use-media-query'
import type React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

function DialogResponsive({ children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>
  }

  return <Drawer {...props}>{children}</Drawer>
}

function DialogTriggerResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTrigger> &
  React.ComponentPropsWithoutRef<typeof DrawerTrigger>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

function DialogContentResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogContent>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogContent {...(props as any)}>{children}</DialogContent>
  }

  return <DrawerContent {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}>{children}</DrawerContent>
}

function DialogHeaderResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogHeader>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>
}

function DialogFooterResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogFooter>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>
}

function DialogTitleResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTitle>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>
}

function DialogDescriptionResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogDescription>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>
}

function DialogCloseResponsive({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogClose> &
  React.ComponentPropsWithoutRef<typeof DrawerClose>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogClose {...props}>{children}</DialogClose>
  }

  return <DrawerClose {...props}>{children}</DrawerClose>
}

export {
  DialogResponsive,
  DialogTriggerResponsive,
  DialogContentResponsive,
  DialogHeaderResponsive,
  DialogFooterResponsive,
  DialogTitleResponsive,
  DialogDescriptionResponsive,
  DialogCloseResponsive,
}
