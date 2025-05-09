'use client'

import {
  AlertDialogDialogProps,
  AlertDialogDrawerProps,
  AlertDialogSheetProps,
  AlertDialogWrapperType,
} from './alert-dialog.types'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import DialogPrimitive from '@gentleduck/aria-feather/dialog'
import { useShouldRender, useDialogContext } from '@gentleduck/aria-feather/dialog'
import { DialogClose, DialogTrigger } from '../dialog'

function AlertDialog({ ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

export function AlertDialogTrigger({ ...props }: React.ComponentPropsWithRef<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />
}

function AlertDialogContent({
  children,
  className,
  renderOnce,
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
}): React.JSX.Element {
  const { open, ref } = useDialogContext()
  const [shouldRender] = useShouldRender(open, renderOnce ?? false)

  return (
    <dialog ref={ref} {...props} className={cn(AnimVariants(), AnimDialogVariants(), className)}>
      {shouldRender && (
        <div className="content-wrapper">
          <DialogClose />
          {children}
        </div>
      )}
    </dialog>
  )
}

function AlertDialogHeader({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
}

/**
 * A component that renders the footer of an alert dialog.
 *
 * It uses a flexbox layout to arrange its children in a vertical column
 * on small screens and in a row with space between items on larger screens.
 *
 */
function AlertDialogFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
}

/**
 * `AlertDialogTitle` is a React component that forwards its ref to the `AlertDialogTitle` component.
 * It accepts all props that `AlertDialogTitle` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 */
export interface AlertDialogTitleProps extends React.HTMLProps<HTMLParagraphElement> {}
function AlertDialogTitle({ className, ref, ...props }: AlertDialogTitleProps): React.JSX.Element {
  return <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}
/**
 * `AlertDialogDescription` is a React component that forwards its ref to the `AlertDialogPrimitive.Description` component.
 * It accepts all props that `AlertDialogPrimitive.Description` accepts, along with an optional `className` prop for additional styling.
 *
 */
const AlertDialogDescription = ({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLParagraphElement>): React.JSX.Element => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
)

/**
 * `AlertDialogAction` is a React component that forwards its ref to the `AlertDialogPrimitive.Action` component.
 * It accepts all the props of `AlertDialogPrimitive.Action` and an additional `className` prop for custom styling.
 *
 */
function AlertDialogAction({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />
}

/**
 * `AlertDialogCancel` is a React forward reference component that renders a cancel button
 * for an alert dialog using `AlertDialogPrimitive.Cancel`. It accepts all props that a
 * `AlertDialogPrimitive.Cancel` component would accept, along with an optional `className`
 * for additional styling.
 *
 */
function AlertDialogCancel({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />
}

// /**
//  * Renders an alert dialog and a sheet component, managing their open states
//  * and handling user interactions through provided callbacks.
//  *
//  * @param {AlertDialogWrapperType} props - The properties for configuring the AlertDialogWrapper.
//  *
//  * The component utilizes the `useDuckAlert` hook for managing its internal state
//  * and provides a structured layout for displaying an alert dialog with a trigger,
//  * content, header, footer, and actions, as well as a sheet with nested content
//  * and customizable headers and footers. The component handles user interactions
//  * with cancel and continue actions, updating the state and invoking provided callbacks.
//  */
// export function AlertDialogWrapper({
//   alertTrigger,
//   alertContent,
//   duckHook,
// }: AlertDialogWrapperType) {
//   const { _header, _footer, ...contentProps } = alertContent ?? {}
//   const { _title, _description, ...headerProps } = _header ?? {}
//   const { _submit, _cancel, ...footerProps } = _footer ?? {}

//   return (
//     <AlertDialog open={duckHook?.state.alert}>
//       <AlertDialogTrigger
//         {...alertTrigger}
//         onClick={(e) => {
//           duckHook?.setState({ shape: true, alert: false })
//           alertTrigger?.onClick?.(e)
//         }}
//       />
//       <AlertDialogContent {...contentProps}>
//         <AlertDialogHeader {...headerProps}>
//           {headerProps.children ? (
//             headerProps.children
//           ) : (
//             <>
//               <AlertDialogTitle {..._title} />
//               <AlertDialogDescription {..._description} />
//             </>
//           )}
//         </AlertDialogHeader>

//         <AlertDialogFooter {...footerProps}>
//           <AlertDialogCancel
//             {..._cancel}
//             onClick={(e) => {
//               duckHook?.handleAlertCancel()
//               _cancel?.onClick?.(e)
//             }}
//             asChild
//           >
//             {_cancel?.children ?? 'Cancel'}
//           </AlertDialogCancel>
//           <AlertDialogAction
//             {..._submit}
//             onClick={(e) => {
//               duckHook?.handleAlertContinue()
//               _submit?.onClick?.(e)
//             }}
//             asChild
//           >
//             {_submit?.children ?? 'Continue'}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// /**
//  * AlertDialogSheet is a component that provides a structured layout for displaying
//  * an alert dialog with a trigger, content, header, footer, and actions, as well as
//  * a sheet with nested content and customizable headers and footers. The component
//  * handles user interactions with cancel and continue actions, updating the state
//  * and invoking provided callbacks.
//  *
//  * @param {AlertDialogSheetProps} props - The properties for configuring the AlertDialogSheet.
//  *
//  * The component utilizes the `useDuckAlert` hook for managing its internal state
//  * and provides a structured layout for displaying an alert dialog with a trigger,
//  * content, header, footer, and actions, as well as a sheet with nested content
//  * and customizable headers and footers. The component handles user interactions
//  * with cancel and continue actions, updating the state and invoking provided callbacks.
//  */
// function AlertDialogSheet<T = string>({
//   alertTrigger,
//   alertContent,
//   content,
//   state,
// }: AlertDialogSheetProps<T>) {
//   const duckHook = useDuckAlert({ state })

//   return (
//     <>
//       <AlertDialogWrapper
//         alertTrigger={alertTrigger}
//         alertContent={alertContent}
//         duckHook={duckHook}
//       />
//       <SheetWrapper content={content} duckHook={duckHook} />
//     </>
//   )
// }

// AlertDialogSheet.displayName = 'AlertDialogSheet'

// /**
//  * AlertDialogDrawer is a component that provides a structured layout for displaying
//  * an alert dialog with a trigger, content, header, footer, and actions, as well as
//  * a drawer with nested content and customizable headers and footers. The component
//  * handles user interactions with cancel and continue actions, updating the state
//  * and invoking provided callbacks.
//  *
//  * @param {AlertDialogDrawerProps} props - The properties for configuring the AlertDialogDrawer.
//  *
//  * The component utilizes the `useDuckAlert` hook for managing its internal state
//  * and provides a structured layout for displaying an alert dialog with a trigger,
//  * content, header, footer, and actions, as well as a drawer with nested content
//  * and customizable headers and footers. The component handles user interactions
//  * with cancel and continue actions, updating the state and invoking provided callbacks.
//  */

// function AlertDialogDrawer<T = string>({
//   alertTrigger,
//   alertContent,
//   // content,
//   state,
// }: AlertDialogDrawerProps<T>) {
//   const duckHook = useDuckAlert<T>({ state })

//   return (
//     <>
//       <AlertDialogWrapper
//         alertTrigger={alertTrigger}
//         alertContent={alertContent}
//         duckHook={duckHook}
//       />
//     </>
//     // <DrawerWrapper content={content} duckHook={duckHook} />
//   )
// }

// AlertDialogSheet.displayName = 'AlertDialogDrawer'

// /**
//  * Renders an alert dialog and a dialog component, managing their open states
//  * and handling user interactions through provided callbacks.
//  *
//  * @template T
//  * @param {AlertDialogDialogProps} props - The properties for configuring the AlertDialogDialog.
//  *
//  * The component utilizes the `useDuckAlert` hook for managing its internal state
//  * and provides a structured layout for displaying an alert dialog with a trigger,
//  * content, header, footer, and actions, as well as a dialog with nested content
//  * and customizable headers and footers. The component handles user interactions
//  * with cancel and continue actions, updating the state and invoking provided callbacks.
//  */

// function AlertDialogDialog<T = string>({
//   alertTrigger,
//   alertContent,
//   // content,
//   state,
// }: AlertDialogDialogProps<T>) {
//   const duckHook = useDuckAlert<T>({ state })

//   return (
//     <>
//       <AlertDialogWrapper
//         alertTrigger={alertTrigger}
//         alertContent={alertContent}
//         duckHook={duckHook}
//       />
//       {/* ! FIX: create DialogWrapper  */}
//       {/* <DialogWrapper content={content} duckHook={duckHook} /> */}
//     </>
//   )
// }

// AlertDialogSheet.displayName = 'AlertDialogDialog'

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  // AlertDialogTrigger,
  AlertDialogDescription,
  // AlertDialogSheet,
  // AlertDialogDrawer,
  // AlertDialogDialog,
}
