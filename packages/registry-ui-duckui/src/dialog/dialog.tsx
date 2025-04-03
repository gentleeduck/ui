import { cn } from "@gentelduck/libs/cn";
import { Button, ButtonProps } from "../button";
import React from "react";
import { X } from "lucide-react";

export interface DialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogContext = React.createContext<DialogContextType | null>(
  null
);

export function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}

export function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

export function DialogTrigger({ onClick, ...props }: DialogProps) {
  const { setOpen } = useDialogContext();
  return (
    <Button
      onClick={(e) => {
        setOpen(true);
        onClick?.(e);
      }}
      {...(props as ButtonProps)}
    />
  );
}

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement> {}

export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps): JSX.Element {
  const { open, setOpen } = useDialogContext();
  const [shouldrender, setShouldRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      {shouldrender ? (
        <>
          <dialog
            data-state={open ? "open" : "closed"}
            role="dialog-content"
            className={cn(
              "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] z-[52] duration-300 ease-out data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:hidden",
              className
            )}
            {...props}
          >
            <X
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 size-4 cursor-pointer opacity-70 hover:opacity-100 transition"
            />
            {children}
          </dialog>
          <DialogOverlay
            onClick={() => setOpen(false)}
            data-state={open ? "open" : "closed"}
          />
        </>
      ) : null}
    </>
  );
}

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}
export function DialogClose({ onClick, ...props }: DialogCloseProps) {
  const { setOpen } = useDialogContext();
  return (
    <Button
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...(props as ButtonProps)}
    />
  );
}

/**
 * `DialogOverlay` is a React forwardRef component that renders an overlay for a dialog.
 * It uses `DialogPrimitive.Overlay` as the base component and applies additional styles
 * and animations based on the dialog's state.
 *
 * @param {string} className - Additional class names to apply to the overlay.
 * @param {React.Ref} ref - A ref to be forwarded to the `DialogPrimitive.Overlay` component.
 * @param {object} props - Additional props to be passed to the `DialogPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
export interface DialogOverlayProps extends React.HTMLProps<HTMLDivElement> {}
const DialogOverlay = ({ className, ref, ...props }: DialogOverlayProps) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-[51] bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none",
      className
    )}
    {...props}
  />
);
///

/**
 * DialogHeader component renders a header section for a dialog.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @returns {JSX.Element} The rendered DialogHeader component.
 */
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogFooter component renders a footer section for a dialog.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @returns {JSX.Element} The rendered DialogFooter component.
 */
export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
}

/**
 * `DialogTitle` is a React component that forwards its ref to the `DialogPrimitive.Title` component.
 * It accepts all props that `DialogPrimitive.Title` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 * @param {string} className - Optional additional class names to apply to the component.
 * @param {React.Ref} ref - A ref that will be forwarded to the `DialogPrimitive.Title` component.
 * @returns {JSX.Element} The rendered `DialogPrimitive.Title` component with forwarded ref and applied props.
 */
export interface DialogTitleProps extends React.HTMLProps<HTMLHeadingElement> {}
export function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}
/**
 * `DialogDescription` is a React component that forwards its ref to the `DialogPrimitive.Description` component.
 * It applies additional class names to style the description text.
 *
 * @param {string} className - Additional class names to apply to the description text.
 * @param {React.Ref} ref - The ref to be forwarded to the `DialogPrimitive.Description` component.
 * @param {object} props - Additional props to be passed to the `DialogPrimitive.Description` component.
 *
 * @returns {JSX.Element} The rendered `DialogPrimitive.Description` component with forwarded ref and applied class names.
 */
export interface DialogDescriptionProps
  extends React.HTMLProps<HTMLParagraphElement> {}
export const DialogDescription = ({
  className,
  ref,
  ...props
}: DialogDescriptionProps) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
//
// /**
//  * `DialogResponsive` is a React component that conditionally renders either a `Dialog` or a `Drawer` depending
//  * on the screen size. If the screen width is 768px or greater, a `Dialog` is rendered; otherwise, a `Drawer` is
//  * rendered.
//  *
//  * @param {React.ReactNode} children - The children elements to be rendered by the `Dialog` or `Drawer`.
//  * @param {DialogResponsiveProps} props - The props to be passed to the `Dialog` or `Drawer` component.
//  * @returns {JSX.Element} The rendered `Dialog` or `Drawer` component.
//  */
// function DialogResponsive({
//   children,
//   ...props
// }: DialogResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <Dialog {...props}>{children}</Dialog>
//   }
//
//   return <Drawer {...props}>{children}</Drawer>
// }
//
// DialogResponsive.displayName = 'DialogResponsive'
//
// /**
//  * `DialogTriggerResponsive` is a React component that conditionally renders either a `DialogTrigger` or a `DrawerTrigger`
//  * based on the screen size. If the screen width is 768px or greater, a `DialogTrigger` is rendered; otherwise, a
//  * `DrawerTrigger` is rendered.
//  *
//  * @param {DialogTriggerResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogTrigger` or `DrawerTrigger`.
//  * @returns {JSX.Element} The rendered `DialogTrigger` or `DrawerTrigger` component.
//  */
// function DialogTriggerResponsive({
//   children,
//   ...props
// }: DialogTriggerResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogTrigger {...props}>{children}</DialogTrigger>
//   }
//
//   return <DrawerTrigger {...props}>{children}</DrawerTrigger>
// }
//
// DialogTriggerResponsive.displayName = 'DialogTriggerResponsive'
//
// /**
//  * `DialogContentResponsive` is a React component that conditionally renders either a `DialogContent` or a `DrawerContent`
//  * based on the screen size. If the screen width is 768px or greater, a `DialogContent` is rendered; otherwise, a
//  * `DrawerContent` is rendered.
//  *
//  * @param {DialogContentResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogContent` or `DrawerContent`.
//  * @returns {JSX.Element} The rendered `DialogContent` or `DrawerContent` component.
//  */
// function DialogContentResponsive({
//   children,
//   ...props
// }: DialogContentResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogContent {...props}>{children}</DialogContent>
//   }
//
//   return (
//     <DrawerContent
//       {...(props as React.ComponentPropsWithoutRef<typeof DrawerContent>)}
//     >
//       {children}
//     </DrawerContent>
//   )
// }
//
// DialogContentResponsive.displayName = 'DialogContentResponsive'
//
// /**
//  * `DialogHeaderResponsive` is a React component that conditionally renders either a `DialogHeader` or a
//  * `DrawerHeader` based on the screen size. If the screen width is 768px or greater, a `DialogHeader` is
//  * rendered; otherwise, a `DrawerHeader` is rendered.
//  *
//  * @param {DialogHeaderResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogHeader` or `DrawerHeader`.
//  * @returns {JSX.Element} The rendered `DialogHeader` or `DrawerHeader` component.
//  */
// function DialogHeaderResponsive({
//   children,
//   ...props
// }: DialogHeaderResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogHeader {...props}>{children}</DialogHeader>
//   }
//
//   return <DrawerHeader {...props}>{children}</DrawerHeader>
// }
//
// DialogHeaderResponsive.displayName = 'DialogHeaderResponsive'
//
// /**
//  * `DialogFooterResponsive` is a React component that conditionally renders either a `DialogFooter` or a
//  * `DrawerFooter` based on the screen size. If the screen width is 768px or greater, a `DialogFooter` is
//  * rendered; otherwise, a `DrawerFooter` is rendered.
//  *
//  * @param {DialogFooterResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogFooter` or `DrawerFooter`.
//  * @returns {JSX.Element} The rendered `DialogFooter` or `DrawerFooter` component.
//  */
// function DialogFooterResponsive({
//   children,
//   ...props
// }: DialogFooterResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogFooter {...props}>{children}</DialogFooter>
//   }
//
//   return <DrawerFooter {...props}>{children}</DrawerFooter>
// }
//
// DialogFooterResponsive.displayName = 'DialogFooterResponsive'
//
// /**
//  * `DialogTitleResponsive` is a React component that conditionally renders either a `DialogTitle` or a
//  * `DrawerTitle` based on the screen size. If the screen width is 768px or greater, a `DialogTitle` is
//  * rendered; otherwise, a `DrawerTitle` is rendered.
//  *
//  * @param {DialogTitleResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogTitle` or `DrawerTitle`.
//  * @returns {JSX.Element} The rendered `DialogTitle` or `DrawerTitle` component.
//  */
// function DialogTitleResponsive({
//   children,
//   ...props
// }: DialogTitleResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogTitle {...props}>{children}</DialogTitle>
//   }
//
//   return <DrawerTitle {...props}>{children}</DrawerTitle>
// }
//
// DialogTitleResponsive.displayName = 'DialogTitleResponsive'
//
// /**
//  * `DialogDescriptionResponsive` is a React component that conditionally renders either a `DialogDescription` or a
//  * `DrawerDescription` based on the screen size. If the screen width is 768px or greater, a `DialogDescription` is
//  * rendered; otherwise, a `DrawerDescription` is rendered.
//  *
//  * @param {DialogDescriptionResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogDescription` or `DrawerDescription`.
//  * @returns {JSX.Element} The rendered `DialogDescription` or `DrawerDescription` component.
//  */
// function DialogDescriptionResponsive({
//   children,
//   ...props
// }: DialogDescriptionResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogDescription {...props}>{children}</DialogDescription>
//   }
//
//   return <DrawerDescription {...props}>{children}</DrawerDescription>
// }
//
// DialogDescriptionResponsive.displayName = 'DialogDescriptionResponsive'
//
// /**
//  * `DialogCloseResponsive` is a React component that conditionally renders either a `DialogClose` or a `DrawerClose`
//  * based on the screen size. If the screen width is 768px or greater, a `DialogClose` is rendered; otherwise, a
//  * `DrawerClose` is rendered.
//  *
//  * @param {DialogCloseResponsiveProps} props - The properties passed to the component.
//  * @param {React.ReactNode} children - The children elements to be rendered by the `DialogClose` or `DrawerClose`.
//  * @returns {JSX.Element} The rendered `DialogClose` or `DrawerClose` component.
//  */
// function DialogCloseResponsive({
//   children,
//   ...props
// }: DialogCloseResponsiveProps): JSX.Element {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//
//   if (isDesktop) {
//     return <DialogClose {...props}>{children}</DialogClose>
//   }
//
//   return <DrawerClose {...props}>{children}</DrawerClose>
// }
//
// /**
//  * `DialogWrapper` is a React component that wraps a `DialogResponsive` component and renders children elements
//  * conditionally based on the screen size. If the screen width is 768px or greater, a `Dialog` is rendered; otherwise,
//  * a `Drawer` is rendered.
//  * @param {DialogWrapperProps} props - The properties passed to the component.
//  * @returns {JSX.Element} The rendered `Dialog` or `Drawer` component.
//  */
// function DialogWrapper({
//   trigger,
//   content,
//   duckHook,
//   ...props
// }: DialogWrapperProps): JSX.Element {
//   const {
//     className: subContentClassName,
//     children: subcontentChildren,
//     _header,
//     _footer,
//     ...subContentProps
//   } = content
//   const {
//     className: subHeaderClassName,
//     _description: subDescription,
//     _title: subTitle,
//     ...subHeaderProps
//   } = _header ?? {}
//   const {
//     className: subFooterClassName,
//     _submit: _subSubmit,
//     _cancel: _subCancel,
//     ...subFooterProps
//   } = _footer ?? {}
//
//   return (
//     <DialogResponsive
//       open={duckHook?.state.shape}
//       onOpenChange={duckHook?.handleOpenChange}
//       {...props}
//     >
//       <DialogTriggerResponsive {...trigger} />
//       <DialogContentResponsive
//         className={cn('flex flex-col w-full h-full', subContentClassName)}
//         {...subContentProps}
//       >
//         <div data-role-wrapper className='flex flex-col gap-4 w-full h-full'>
//           {_header && (
//             <DialogHeaderResponsive {...subHeaderProps}>
//               {subHeaderProps.children ? (
//                 subHeaderProps.children
//               ) : (
//                 <>
//                   <DialogTitleResponsive {...subTitle} />
//                   <DialogDescriptionResponsive {...subDescription} />
//                 </>
//               )}
//             </DialogHeaderResponsive>
//           )}
//           {subcontentChildren}
//           <DialogFooterResponsive
//             className={cn('gap-2', subFooterClassName)}
//             {...subFooterProps}
//           >
//             <DialogCloseResponsive asChild {..._subCancel} />
//             <div
//               {..._subSubmit}
//               className={cn('ml-0', _subSubmit?.className)}
//               onClick={(e) => {
//                 duckHook?.setState({ shape: false, alert: false })
//                 _subSubmit?.onClick?.(e)
//               }}
//             />
//           </DialogFooterResponsive>
//         </div>
//       </DialogContentResponsive>
//     </DialogResponsive>
//   )
// }
// DialogWrapper.displayName = 'SheetWrapper'
//
// export {
//   DialogResponsive,
//   DialogTriggerResponsive,
//   DialogContentResponsive,
//   DialogHeaderResponsive,
//   DialogFooterResponsive,
//   DialogTitleResponsive,
//   DialogDescriptionResponsive,
//   DialogCloseResponsive,
// }
//
// export {
//   Dialog,
//   DialogPortal,
//   DialogOverlay,
//   DialogClose,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
//   DialogWrapper,
//   type DialogProps,
// }

/**
 * A component that renders a dialog portal using the DialogPrimitive.Portal.
 * This component is used to create a portal for the dialog, allowing it to be rendered
 * outside of the DOM hierarchy of its parent component.
 */
// const DialogPortal = DialogPrimitive.Portal
