'use client'

import { X } from 'lucide-react'
// import { sheetVariants } from './sheet.constants'
// import { SheetContentProps, SheetWrapperProps } from './sheet.types'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { AnimSheetVariants, AnimVariants } from '@gentleduck/motion/anim'
import * as DialogPrimitive from '@gentleduck/aria-feather/dialog'
import { useShouldRender, useDialogContext, useOverlayClose } from '@gentleduck/aria-feather/dialog'
import { DialogTrigger } from '../dialog'

function Sheet({ ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

export interface SheetTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {}

function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <DialogTrigger {...props} open={true} />
}

function SheetClose({ ...props }: SheetTriggerProps) {
  return <DialogTrigger {...props} open={false} />
}

/**
 * `SheetContent` is a React component that renders the content of a sheet.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.side='right'] - The side of the sheet where the content will appear. Defaults to 'right'.
 * @param {string} [props.className] - Additional class names to apply to the content.
 * @param {React.Ref} [props.ref] - The ref to be forwarded to the `SheetContent` component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the sheet.
 *
 * @returns {React.JSX.Element} The rendered sheet content.
 */

const SheetContent = ({
  children,
  className,
  renderOnce,
  side,
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
}): React.JSX.Element => {
  const { open, ref, onOpenChange } = useDialogContext()
  const [shouldRender] = useShouldRender(open, renderOnce ?? false)
  const [closeOverlay] = useOverlayClose()

  return (
    <>
      <dialog
        ref={ref}
        className={cn(
          'border border-border m-0 bg-background p-6 inset-unset shadow-sm duration-400',
          AnimVariants(),
          AnimSheetVariants({ side: side }),
          className,
        )}
        onClick={closeOverlay}
        {...props}>
        {shouldRender && (
          <div className="p-6 w-full h-full">
            <button
              aria-label="close"
              className="absolute right-4 top-4 size-4 cursor-pointer opacity-70 rounded hover:opacity-100 transition-all"
              onClick={() => onOpenChange(false)}>
              <X aria-hidden size={20} />
            </button>
            {children}
          </div>
        )}
      </dialog>
    </>
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
function SheetHeader({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
}

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
function SheetFooter({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  )
}

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
const SheetTitle = ({ className, ref, ...props }: React.HTMLProps<HTMLHeadingElement>): React.JSX.Element => (
  <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
)

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
const SheetDescription = ({ className, ref, ...props }: React.HTMLProps<HTMLParagraphElement>): React.JSX.Element => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
)

// /**
//  * `SheetWrapper` is a React component that wraps a `Sheet` component and renders children elements
//  * conditionally based on the screen size. If the screen width is 768px or greater, a `Drawer` is rendered; otherwise,
//  * a `Sheet` is rendered.
//  * @param {SheetWrapperProps} props - The properties passed to the component.
//  * @returns {React.JSX.Element} The rendered `Drawer` or `Sheet` component.
//  */
// function SheetWrapper({
//   trigger,
//   content,
//   duckHook,
//   ...props
// }: SheetWrapperProps): React.JSX.Element {
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

//   return (
//     <Sheet
//       open={duckHook?.state.shape}
//       onOpenChange={duckHook?.handleOpenChange}
//       {...props}
//     >
//       <SheetTrigger {...trigger} />
//       <SheetContent
//         className={cn('flex flex-col w-full h-full', subContentClassName)}
//         {...subContentProps}
//       >
//         <div data-role-wrapper className='flex flex-col gap-4 w-full h-full'>
//           {_header && (
//             <SheetHeader {...subHeaderProps}>
//               {subHeaderProps.children ? (
//                 subHeaderProps.children
//               ) : (
//                 <>
//                   <SheetTitle {...subTitle} />
//                   <SheetDescription {...subDescription} />
//                 </>
//               )}
//             </SheetHeader>
//           )}
//           {subcontentChildren}
//           <SheetFooter
//             className={cn('gap-2', subFooterClassName)}
//             {...subFooterProps}
//           >
//             <SheetClose asChild {..._subCancel} />
//             <div
//               {..._subSubmit}
//               className={cn('ml-0', _subSubmit?.className)}
//               onClick={(e) => {
//                 duckHook?.setState({ shape: false, alert: false })
//                 _subSubmit?.onClick?.(e)
//               }}
//             />
//           </SheetFooter>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }
// SheetWrapper.displayName = 'SheetWrapper'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  // SheetWrapper,
}
