'use client'

// import { sheetVariants } from './sheet.constants'
// import { SheetContentProps, SheetWrapperProps } from './sheet.types'
import { cn } from '@gentleduck/libs/cn'
import { AnimSheetVariants, AnimVariants } from '@gentleduck/motion/anim'
import DialogPrimitive, {
  useDialogContext,
  // useDrawerDrag,
} from '@gentleduck/primitives/dialog'
import React from 'react'
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../dialog'
import { useDrawerDrag } from './drawer.hooks'
import { NESTED_DISPLACEMENT } from './src/constants'

type DrawerContextProps = {
  ref: React.RefObject<HTMLDialogElement>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)
const useDrawerContext = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer.Root')
  }
  return context
}

const Drawer = ({ children }: { children: React.ReactNode }) => {
  const drawerRef = React.useRef<HTMLDialogElement>(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const els = document.querySelectorAll('[data-drawer]')

    const value = els[els.length - 1]?.attributes.getNamedItem('data-open')?.value
    console.log(value)

    // drawerRef.current = els[els.length - 1] as any
    // console.log(value, els?.[0]?.id)
  }, [open])

  return (
    <DrawerContext.Provider value={(drawerRef, open, setOpen)}>
      <DialogPrimitive.Root>{children}</DialogPrimitive.Root>
    </DrawerContext.Provider>
  )
}

const DrawerTrigger = ({ children, onClick, ...props }: React.ComponentPropsWithRef<typeof DialogTrigger>) => {
  const { open, setOpen } = useDrawerContext()
  return (
    <DialogTrigger
      {...props}
      onClick={(e) => {
        onClick?.(e)
        setOpen(!open)
      }}>
      {children}
    </DialogTrigger>
  )
}

function DrawerDrag({ className }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <div
      className={cn('mx-auto my-4 h-2 w-[100px] rounded-full bg-muted cursor-grab active:cursor-grabbing', className)}
    />
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
  side = 'bottom',
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
}): React.JSX.Element => {
  const { open, ref, onOpenChange } = useDialogContext()
  const holdUpThreshold = 10
  const { onPointerDown, onPointerUp, onPointerMove, isDragging } = useDrawerDrag({
    holdUpThreshold,
    onOpenChange,
    ref: ref as React.RefObject<HTMLDialogElement>,
  })
  const id = React.useId()

  // useScaleBackground({
  //   open,
  //   ref: ref as React.RefObject<HTMLDialogElement>,
  //   direction: side,
  //   shouldScaleBackground: true,
  //   setBackgroundColorOnScale: true,
  //   noBodyStyles: true,
  // })

  return (
    <dialog
      closedby="any"
      data-drawer
      data-open={open ? 'true' : 'false'}
      id={'drawer' + id}
      ref={ref}
      {...props}
      className={cn(
        `ease-cubic-bezier(0.32,_0.72,_0,_1)
        active:duration-0 duration-500 rounded-t-lg [@media(hover:none)]:open:duration-0 has-active:backdrop:pointer-events-none
        will-change-transform `,
        AnimVariants(),
        AnimSheetVariants({ side: side }),
        className,
        "p-0 select-none touch-none"
      )}>
      <div
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        // style={{
        //   willChange: 'transform',
        //   touchAction: 'none',
        //   userSelect: isDragging ? 'none' : 'auto',
        // }}
        //
      >
        <DrawerDrag />
        {children}
      </div>
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

export { Drawer, DrawerTrigger as DrawerClose, DrawerContent, DrawerTrigger }

export function useScaleBackground({
  ref,
  open,
  // direction,
  // shouldScaleBackground,
  // setBackgroundColorOnScale,
  // noBodyStyles,
}: {
  ref: React.RefObject<HTMLDialogElement>
  open: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
}) {
  return React.useEffect(() => {
    if (open) {
      document.body.classList.add(
        'transition-all',
        'duration-250',
        'ease-(--duck-motion-ease)',
        'will-change-[transform,border-radius]',
        'transition-discrete',
      )
      document.body.style.transform = 'scale(0.97) translateY(1rem)'
      document.body.style.borderRadius = '20px'
      document.documentElement.style.background = 'black'
    } else {
      document.body.style.transform = ''
      document.body.style.borderRadius = ''
      if (ref?.current) {
        ref.current.style.transform = 'translateY(0px)'
      }
    }
  }, [open, ref])
}
