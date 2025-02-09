'use client'
import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/registry/registry-ui-components'
import { DialogCloseProps } from '@radix-ui/react-dialog'
import { SheetContent, SheetTrigger, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose, Sheet } from '@/registry/default/ui'

//NOTE: Alert Dialog Drawer
interface AlertDialogDrawerContentType extends Partial<React.ComponentPropsWithoutRef<typeof SheetContent>> { }
interface AlertDialogDrawerTriggerentType extends Partial<React.ComponentPropsWithoutRef<typeof SheetTrigger>> { }
interface StateType {
    drawer: boolean
    alert: boolean
}

interface AlertDialogDrawerActionsType {
    cancel?: () => void
    continue?: () => void
}

interface AlertDialogDrawerHeaderType extends Partial<React.ComponentPropsWithoutRef<typeof SheetHeader>> {
    head: React.ReactNode
    description: React.ReactNode
}

interface AlertDialogDrawerFooterType extends Partial<React.ComponentPropsWithoutRef<typeof SheetFooter>> {
    cancel?: React.HTMLProps<HTMLButtonElement> & DialogCloseProps
    submit?: React.HTMLProps<HTMLDivElement>
}
interface AlertDialogSheetProps {
    state: boolean
    header: AlertDialogDrawerHeaderType
    footer: AlertDialogDrawerFooterType
    trigger: AlertDialogDrawerTriggerentType
    content: AlertDialogDrawerContentType
    actions?: AlertDialogDrawerActionsType
}

//NOTE: Alert Dialog Primitive
const AlertDialog = AlertDialogPrimitive.Root as typeof AlertDialogPrimitive.Root & AlertDialogCompound
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



// NOTE: Alert Dialog Compound
interface AlertDialogCompound {
    Dialog: typeof AlertDialog
    Overlay: typeof AlertDialogPrimitive.Overlay
    Content: typeof AlertDialogPrimitive.Content
    Portal: typeof AlertDialogPrimitive.Portal
    Header: typeof AlertDialogHeader
    Footer: typeof AlertDialogFooter
    Title: typeof AlertDialogTitle
    Description: typeof AlertDialogDescription
    Action: typeof AlertDialogAction
    Cancel: typeof AlertDialogCancel
    Trigger: typeof AlertDialogTrigger
    Sheet: typeof AlertDialogSheet
}


const AlertDialogSheet = ({ trigger, header, footer, content, actions, state }: AlertDialogSheetProps) => {
    const { className: triggerClassName, children: triggerChildren, ...triggerProps } = trigger;
    const { className: contentClassName, children: contentChildren, ...contentProps } = content;
    const { className: footerClassName, children: footerChildren, submit, cancel, ...footerProps } = footer;
    const { className: headerClassName, children: headerChildren, description, head: title, ...headerProps } = header;
    const { className: submitClassName, onClick: submitOnClick, children: submitChildren, ...submitProps } = submit ?? {};
    const { className: cancelClassName, children: cancelChildren, ...cancelProps } = cancel ?? {};

    const {
        state: changeState,
        handleDrawerOpenChange,
        handleAlertCancel,
        handleAlertContinue,
        setState,
    } = useDuckAlert({ trigger, header, footer, content, actions, state });

    return (
        <>
            <AlertDialog open={changeState.alert}>
                <AlertDialog.Trigger className={cn(triggerClassName)}
                    {...triggerProps}
                    onClick={() => setState({ drawer: true, alert: false })}
                >
                    {triggerChildren}
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                            This action will consider these replies as Drafts, you can delete, adjust and send from Drafts section on
                            the side header.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel onClick={handleAlertCancel}>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action onClick={handleAlertContinue}>Continue</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            <Sheet
                open={changeState.drawer}
                onOpenChange={handleDrawerOpenChange}
            >
                <SheetContent
                    className={cn('flex flex-col w-full h-full', contentClassName)}
                    {...contentProps}
                >
                    <div
                        data-role-wrapper
                        className="flex flex-col gap-4 w-full h-full"
                    >
                        {header && (
                            <SheetHeader
                                className={cn('', headerClassName)}
                                {...headerProps}
                            >
                                {headerChildren ? (
                                    headerChildren
                                ) : (
                                    <>
                                        <SheetTitle>{title}</SheetTitle>
                                        <SheetDescription>{description}</SheetDescription>
                                    </>
                                )}
                            </SheetHeader>
                        )}
                        {contentChildren}
                        {footer &&
                            (footerChildren ? (
                                footerChildren
                            ) : (
                                <SheetFooter
                                    className={cn('gap-2', footerClassName)}
                                    {...footerProps}
                                >
                                    <SheetClose
                                        asChild
                                        className={cn(cancelClassName)}
                                        {...cancelProps}
                                    >
                                        {cancelChildren}
                                    </SheetClose>
                                    <div
                                        onClick={e => {
                                            setState({ drawer: false, alert: false });
                                            submitOnClick?.(e);
                                        }}
                                        className={cn('ml-0')}
                                        {...submitProps}
                                    >
                                        {submitChildren}
                                    </div>
                                </SheetFooter>
                            ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

AlertDialogSheet.displayName = 'AlertDialogDrawer'

//NOTE: Alert Dialog Sheet Hook
const useDuckAlert = ({ actions, state: changeState }: AlertDialogSheetProps) => {
    const [state, setState] = React.useState<StateType>({ drawer: false, alert: false })
    const changeStateRef = React.useRef<boolean | null>(null)

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
            const showAlert = !drawerState && (changeState || true) && changeStateRef.current !== changeState

            setState(() => ({
                alert: showAlert as boolean,
                drawer: changeState || true ? drawerState : false,
            }))
        },
        [changeState]
    )

    return {
        handleAlertCancel,
        handleAlertContinue,
        handleDrawerOpenChange,
        state,
        setState,
    }
}

// NOTE: Alert Dialog Compound Components
AlertDialog.Overlay = AlertDialogOverlay
AlertDialog.Content = AlertDialogContent
AlertDialog.Header = AlertDialogHeader
AlertDialog.Footer = AlertDialogFooter
AlertDialog.Title = AlertDialogTitle
AlertDialog.Action = AlertDialogAction
AlertDialog.Cancel = AlertDialogCancel
AlertDialog.Trigger = AlertDialogTrigger
AlertDialog.Description = AlertDialogDescription
AlertDialog.Sheet = AlertDialogSheet

export {
    AlertDialog
}