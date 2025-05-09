'use client'
// import { sheetVariants } from './sheet.constants'
// import { SheetContentProps, SheetWrapperProps } from './sheet.types'
import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { AnimSheetVariants, AnimVariants } from '@gentleduck/motion/anim'
import DialogPrimitive from '@gentleduck/aria-feather/dialog'
import { useShouldRender } from '@gentleduck/aria-feather/dialog'
import { DrawerRoot, useDrawerContext, useOverlayClose, Trigger,useDrawerDrag } from '@gentleduck/aria-feather/drawer'

import './drawer.css'
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../dialog'
import { Button } from '../../button'
import { X } from 'lucide-react'


export interface SheetTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> { }

export function DialogTrigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Trigger>
      <Button {...props}>{children}</Button>
    </Trigger>
  )
}

function DrawerTrigger({ ...props }: SheetTriggerProps) {
  return <DialogTrigger {...props} />
}

export function DrawerClose({
  ref,
  size = 16,
  children,
  className,
  ...props
}: React.HTMLProps<HTMLButtonElement> & {
  size?: number
}): React.JSX.Element {
  const { onOpenChange } = useDrawerContext()

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      aria-label="close"
      className={cn(
        'absolute right-3 top-3 text-accent-foreground size-4 cursor-pointer opacity-70 rounded hover:opacity-100 transition-all',
        className,
      )}
      onClick={() => onOpenChange(false)}>
      {children ?? <X aria-hidden size={size} />}
    </button>
  )
}

function DrawerDrag({ className }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <div className={cn('mx-auto my-4 h-2 w-[100px] rounded-full bg-muted', className)} />
  )
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

const DrawerContent = ({
  children,
  className,
  renderOnce,
  side,
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
}): React.JSX.Element => {
  const { open, ref, onOpenChange } = useDrawerContext()
  const [shouldRender] = useShouldRender(open, renderOnce ?? false)
  const [closeOverlay] = useOverlayClose()
  const holdUpThreshold = 10 
  const { handleMouseDown, handleTouchStart, handleTouchMove, handleTouchEnd } = useDrawerDrag({
  
    ref: ref as React.RefObject<HTMLDialogElement>,
    onOpenChange,
    holdUpThreshold
  })

  return (
    <dialog

      ref={ref}
      onClick={closeOverlay}
      {...props}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* {shouldRender && ( */}
      <div
          className={cn("content-wrapper select-none" ,
          'fixed bottom-0 z-50 h-[40vh] flex flex-col rounded-t-[10px] border bg-background w-full max-w-full',
  
          `transform-gpu ease-cubic-bezier(0.32,_0.72,_0,_1) -(--duck-motion-spring) pointer-events-auto`,
          // active:duration-0 duration-450 [@media(hover:none)]:open:duration-0 has-active:backdrop:pointer-events-none,
          // AnimVariants(),
          // AnimSheetVariants({ side: side }),
          className,
        )}

        data-state={open ? 'open' : 'closed'}
        data-vaul-drawer-direction='bottom'
        data-vaul-drawer=''
        data-vaul-delayed-snap-points='false'
        data-vaul-snap-points='false'
        data-vaul-custom-container='false'
        data-vaul-animate='true'
        >
        <DrawerDrag />
        <DrawerClose />
        {children}
      </div>
      {/* )} */}
    </dialog>
  )
}

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




/**
 * DrawerHeader component renders a header section for a Drawer.
 * It supports additional class names and props to customize the
 * appearance and behavior of the header. The component uses a
 * flexbox layout to arrange its children in a vertical column
 * and applies responsive text alignment.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.RefObject<HTMLDivElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional properties for the component.
 *
 * @returns {JSX.Element} The rendered DrawerHeader component.
 */
export const DrawerHeader = DialogHeader

/**
 * DrawerFooter component renders a footer section for a Drawer.
 * It supports additional class names and props to customize the
 * appearance and behavior of the footer. The component uses a
 * flexbox layout to arrange its children in a column on small
 * screens and in a row with space between items on larger screens.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.RefObject<HTMLDivElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional properties for the component.
 *
 * @returns {React.JSX.Element} The rendered DrawerFooter component.
 */
export const DrawerFooter = DialogFooter

/**
 * `DrawerTitle` is a React component that forwards its ref to the `DrawerTitle` component.
 * It accepts all props that `DrawerTitle` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 * @param {React.HTMLProps<HTMLHeadingElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Optional additional class names to apply to the component.
 * @param {React.RefObject<HTMLHeadingElement>} [props.ref] - A ref that will be forwarded to the `DrawerTitle` component.
 * @param {React.HTMLProps<HTMLHeadingElement>} [...props] - Additional props to be passed to the `DrawerTitle` component.
 *
 * @returns {React.JSX.Element} The rendered `DrawerTitle` component with forwarded ref and applied props.
 */
export const DrawerTitle = DialogTitle

/**
 * `DrawerDescription` is a React component that forwards its ref to the `DrawerDescription` component.
 * It applies additional class names to style the description text.
 *
 * @praam {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the description text.
 * @param {React.RefObject<HTMLParagraphElement>} [props.ref] - The ref to be forwarded to the `DrawerDescription` component.
 * @param {React.HTMLProps<HTMLParagraphElement>} [..props] - Additional props to be passed to the `DrawerDescription` component.
 *
 * @returns {React.JSX.Element} The rendered `DrawerDescription` component with forwarded ref and applied class names.
 */
export const DrawerDescription = DialogDescription


export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Close: DrawerClose,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
}