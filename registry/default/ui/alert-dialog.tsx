'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ShadcnUI/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

//NOTE: Alert Dialog Primitive
const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

//NOTE: Alert Dialog Overlay
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

//NOTE: Alert Dialog Content
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

//NOTE: Alert Dialog Header
const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

//NOTE: Alert Dialog Footer
const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

//NOTE: Alert Dialog Title
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

//NOTE: Alert Dialog Description
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

//NOTE: Alert Dialog Action
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

//NOTE: Alert Dialog Cancel
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

//NOTE: Alert Dialog Drawer
interface AlertDialogDrawerContentType extends Partial<React.ComponentPropsWithoutRef<typeof DrawerContent>> {}
interface AlertDialogDrawerTriggerentType extends Partial<React.ComponentPropsWithoutRef<typeof DrawerTrigger>> {}
interface StateType {
  drawer: boolean
  alert: boolean
  action: boolean
}

interface AlertDialogDrawerActionsType {
  cancel?: () => void
  continue?: () => void
}

interface AlertDialogDrawerHeaderType extends Partial<React.ComponentPropsWithoutRef<typeof DrawerHeader>> {
  head: React.ReactNode
  description: React.ReactNode
}

interface AlertDialogDrawerFooterType extends Partial<React.ComponentPropsWithoutRef<typeof DrawerFooter>> {
  cancel?: React.ReactNode
  submit?: React.ReactNode
}
interface AlertDialogCustomProps<C> {
  type: 'drawer' | 'dialog' | 'sheet'
  state: C
  header: AlertDialogDrawerHeaderType
  footer: AlertDialogDrawerFooterType
  trigger: AlertDialogDrawerTriggerentType
  content: AlertDialogDrawerContentType
  drawerData?: boolean
  actions?: AlertDialogDrawerActionsType
}

const AlertDialogCustom = <C,>({
  type,
  trigger,
  header,
  footer,
  content,
  drawerData,
  actions,
  state,
}: AlertDialogCustomProps<C>) => {
  const {
    state: changeState,
    handleDrawerOpenChange,
    triggerClassName,
    cancel,
    submit,
    description,
    title,
    footerProps,
    headerProps,
    contentProps,
    triggerProps,
    footerChildren,
    headerChildren,
    contentChildren,
    footerClassName,
    headerClassName,
    triggerChildren,
    contentClassName,
    handleAlertCancel,
    handleAlertContinue,
    Component,
    ComponentTrigger,
    ComponentClose,
    ComponentTitle,
    ComponentFooter,
    ComponentHeader,
    ComponentContent,
    ComponentDescription,
    setState,
  } = useAlertCustom({ trigger, header, footer, content, drawerData, actions, state, type })

  return (
    <>
      <AlertDialog open={changeState.alert}>
        <Component
          open={changeState.drawer}
          onOpenChange={handleDrawerOpenChange}
        >
          <ComponentTrigger
            asChild
            className={cn('', triggerClassName)}
            {...triggerProps}
          >
            {triggerChildren}
          </ComponentTrigger>
          <ComponentContent
            className={cn('flex flex-col w-full h-full', contentClassName)}
            {...contentProps}
          >
            <div
              data-role-wrapper
              className="flex flex-col gap-4 w-full h-full"
            >
              {header && (
                <ComponentHeader
                  className={cn('', headerClassName)}
                  {...headerProps}
                >
                  {headerChildren ? (
                    headerChildren
                  ) : (
                    <>
                      <ComponentTitle>{title}</ComponentTitle>
                      <ComponentDescription>{description}</ComponentDescription>
                    </>
                  )}
                </ComponentHeader>
              )}
              {contentChildren}
              {footer &&
                (footerChildren ? (
                  footerChildren
                ) : (
                  <ComponentFooter
                    className={cn('', footerClassName)}
                    {...footerProps}
                  >
                    <ComponentClose asChild>{cancel}</ComponentClose>
                    <Button onClick={() => setState({ drawer: false, alert: false, action: true })}>{submit}</Button>
                  </ComponentFooter>
                ))}
            </div>
          </ComponentContent>
        </Component>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will consider these replies as Drafts, you can delete, adjust and send from Drafts section on
              the side header.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleAlertCancel}
              asChild
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAlertContinue}
              asChild
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

AlertDialogCustom.displayName = 'AlertDialogDrawer'

//NOTE: Alert Dialog Custom Hook
const useAlertCustom = <C,>({
  trigger,
  header,
  footer,
  content,
  drawerData,
  actions,
  state: changeState,
  type,
}: AlertDialogCustomProps<C>) => {
  const { className: triggerClassName, children: triggerChildren, ...triggerProps } = trigger
  const { className: contentClassName, children: contentChildren, ...contentProps } = content
  const { className: footerClassName, children: footerChildren, submit, cancel, ...footerProps } = footer
  const { className: headerClassName, children: headerChildren, description, head: title, ...headerProps } = header

  const [state, setState] = React.useState<StateType>({ drawer: false, alert: false, action: false })
  const changeStateRef = React.useRef<C | string>('')

  React.useEffect(() => {
    changeStateRef.current = changeState
  }, [])

  const handleAlertCancel = React.useCallback(() => {
    actions?.cancel && actions.cancel()
    setState(prevState => ({ ...prevState, alert: false, drawer: true }))
  }, [])

  const handleAlertContinue = React.useCallback(() => {
    actions?.continue && actions.continue()
    setState(prevState => ({ ...prevState, alert: false, drawer: false }))
  }, [])

  const handleDrawerOpenChange = React.useCallback(
    (drawerState: boolean) => {
      const showAlert = !drawerState && (drawerData || true) && changeStateRef.current !== changeState

      setState(() => ({
        action: state.action,
        alert: state.action ? false : (showAlert as boolean),
        drawer: drawerData || true ? drawerState : false,
      }))
    },
    [drawerData]
  )

  const Component = type === 'drawer' ? Drawer : type === 'sheet' ? Sheet : type === 'dialog' ? Dialog : Drawer
  const ComponentTrigger =
    type === 'drawer'
      ? DrawerTrigger
      : type === 'sheet'
        ? SheetTrigger
        : type === 'dialog'
          ? DialogTrigger
          : DrawerTrigger
  const ComponentContent =
    type === 'drawer'
      ? DrawerContent
      : type === 'sheet'
        ? SheetContent
        : type === 'dialog'
          ? DialogContent
          : DrawerContent
  const ComponentHeader =
    type === 'drawer' ? DrawerHeader : type === 'sheet' ? SheetHeader : type === 'dialog' ? DialogHeader : DrawerHeader
  const ComponentFooter =
    type === 'drawer' ? DrawerFooter : type === 'sheet' ? SheetFooter : type === 'dialog' ? DialogFooter : DrawerFooter
  const ComponentTitle =
    type === 'drawer' ? DrawerTitle : type === 'sheet' ? SheetTitle : type === 'dialog' ? DialogTitle : DrawerTitle
  const ComponentDescription =
    type === 'drawer'
      ? DrawerDescription
      : type === 'sheet'
        ? SheetDescription
        : type === 'dialog'
          ? DialogDescription
          : DrawerDescription
  const ComponentClose =
    type === 'drawer' ? DrawerClose : type === 'sheet' ? SheetClose : type === 'dialog' ? DialogClose : DrawerClose

  return {
    handleAlertCancel,
    handleAlertContinue,
    handleDrawerOpenChange,
    triggerClassName,
    triggerChildren,
    triggerProps,
    contentClassName,
    contentChildren,
    contentProps,
    footerClassName,
    footerChildren,
    footerProps,
    headerClassName,
    headerChildren,
    headerProps,
    title,
    description,
    submit,
    cancel,
    state,
    setState,
    Component,
    ComponentTrigger,
    ComponentContent,
    ComponentHeader,
    ComponentFooter,
    ComponentTitle,
    ComponentDescription,
    ComponentClose,
  }
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogCustom,
}
