import { useMediaQuery } from '@gentleduck/duck-hooks/use-media-query'
import React from 'react'
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
import {
  DialogCloseResponsiveProps,
  DialogContentResponsiveProps,
  DialogDescriptionResponsiveProps,
  DialogFooterResponsiveProps,
  DialogHeaderResponsiveProps,
  DialogResponsiveProps,
  DialogTitleResponsiveProps,
  DialogTriggerResponsiveProps,
} from './dialog.types'

/**
 * `DialogResponsive` is a React component that conditionally renders either a `Dialog` or a `Drawer` depending
 * on the screen size. If the screen width is 768px or greater, a `Dialog` is rendered; otherwise, a `Drawer` is
 * rendered.
 *
 * @param {DialogResponsiveProps} props - The props to be passed to the `Dialog` or `Drawer` component.
 * @returns {JSX.Element} The rendered `Dialog` or `Drawer` component.
 */
function DialogResponsive({ children, ...props }: DialogResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <Dialog {...props}>{children}</Dialog>
  }

  return <Drawer {...props}>{children}</Drawer>
}

DialogResponsive.displayName = 'DialogResponsive'

/**
 * `DialogTriggerResponsive` is a React component that conditionally renders either a `DialogTrigger` or a `DrawerTrigger`
 * based on the screen size. If the screen width is 768px or greater, a `DialogTrigger` is rendered; otherwise, a
 * `DrawerTrigger` is rendered.
 *
 * @param {DialogTriggerResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogTrigger` or `DrawerTrigger` component.
 */
function DialogTriggerResponsive({ children, ...props }: DialogTriggerResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>
  }

  return <DrawerTrigger {...props}>{children}</DrawerTrigger>
}

DialogTriggerResponsive.displayName = 'DialogTriggerResponsive'

/**
 * `DialogContentResponsive` is a React component that conditionally renders either a `DialogContent` or a `DrawerContent`
 * based on the screen size. If the screen width is 768px or greater, a `DialogContent` is rendered; otherwise, a
 * `DrawerContent` is rendered.
 *
 * @param {DialogContentResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogContent` or `DrawerContent` component.
 */
function DialogContentResponsive({ children, ...props }: DialogContentResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogContent {...(props as any)}>{children}</DialogContent>
  }

  return <DrawerContent {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}>{children}</DrawerContent>
}

DialogContentResponsive.displayName = 'DialogContentResponsive'

/**
 * `DialogHeaderResponsive` is a React component that conditionally renders either a `DialogHeader` or a
 * `DrawerHeader` based on the screen size. If the screen width is 768px or greater, a `DialogHeader` is
 * rendered; otherwise, a `DrawerHeader` is rendered.
 *
 * @param {DialogHeaderResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogHeader` or `DrawerHeader` component.
 */
function DialogHeaderResponsive({ children, ...props }: DialogHeaderResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogHeader {...props}>{children}</DialogHeader>
  }

  return <DrawerHeader {...props}>{children}</DrawerHeader>
}

DialogHeaderResponsive.displayName = 'DialogHeaderResponsive'

/**
 * `DialogFooterResponsive` is a React component that conditionally renders either a `DialogFooter` or a
 * `DrawerFooter` based on the screen size. If the screen width is 768px or greater, a `DialogFooter` is
 * rendered; otherwise, a `DrawerFooter` is rendered.
 *
 * @param {DialogFooterResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogFooter` or `DrawerFooter` component.
 */
function DialogFooterResponsive({ children, ...props }: DialogFooterResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogFooter {...props}>{children}</DialogFooter>
  }

  return <DrawerFooter {...props}>{children}</DrawerFooter>
}

/**
 * `DialogTitleResponsive` is a React component that conditionally renders either a `DialogTitle` or a
 * `DrawerTitle` based on the screen size. If the screen width is 768px or greater, a `DialogTitle` is
 * rendered; otherwise, a `DrawerTitle` is rendered.
 *
 * @param {DialogTitleResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogTitle` or `DrawerTitle` component.
 */
function DialogTitleResponsive({ children, ...props }: DialogTitleResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogTitle {...props}>{children}</DialogTitle>
  }

  return <DrawerTitle {...props}>{children}</DrawerTitle>
}

DialogTitleResponsive.displayName = 'DialogTitleResponsive'

/**
 * `DialogDescriptionResponsive` is a React component that conditionally renders either a `DialogDescription` or a
 * `DrawerDescription` based on the screen size. If the screen width is 768px or greater, a `DialogDescription` is
 * rendered; otherwise, a `DrawerDescription` is rendered.
 *
 * @param {DialogDescriptionResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogDescription` or `DrawerDescription` component.
 */
function DialogDescriptionResponsive({ children, ...props }: DialogDescriptionResponsiveProps): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DialogDescription {...props}>{children}</DialogDescription>
  }

  return <DrawerDescription {...props}>{children}</DrawerDescription>
}

DialogDescriptionResponsive.displayName = 'DialogDescriptionResponsive'

/**
 * `DialogCloseResponsive` is a React component that conditionally renders either a `DialogClose` or a `DrawerClose`
 * based on the screen size. If the screen width is 768px or greater, a `DialogClose` is rendered; otherwise, a
 * `DrawerClose` is rendered.
 *
 * @param {DialogCloseResponsiveProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered `DialogClose` or `DrawerClose` component.
 */
function DialogCloseResponsive({ children, ...props }: DialogCloseResponsiveProps): React.JSX.Element {
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
