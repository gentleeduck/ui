import { cn } from '@gentelduck/libs/cn'
import { Button, ButtonProps } from '../button'
import React from 'react'
import { X } from 'lucide-react'
import { Portal, PortalProps } from './_new/portal'

let DIALOG_STACK: number[] = []
let INSTANCE = 0

export interface DialogContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  index: number
}

export const DialogContext = React.createContext<DialogContextType | null>(null)

export function useDialogContext() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }
  return context
}

export function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const idx = React.useMemo(() => {
    return (INSTANCE += 1)
  }, [])

  return (
    <DialogContext.Provider value={{ open, setOpen, index: idx }}>
      {children}
    </DialogContext.Provider>
  )
}

export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> { }

export function DialogTrigger({ onClick, ...props }: DialogTriggerProps) {
  const { setOpen } = useDialogContext()
  return (
    <Button
      onClick={(e) => {
        setOpen(true)
        onClick?.(e)
      }}
      {...(props as ButtonProps)}
    />
  )
}

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement> { }

export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps): JSX.Element {
  const { open, setOpen, index } = useDialogContext()
  const [shouldRender, setShouldRender] = React.useState<boolean>(false)
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    if (open) {
      // Add this dialog to the stack when opened
      DIALOG_STACK.push(index)
      setShouldRender(true)

      if (DIALOG_STACK.length === 1) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      // Remove this dialog from the stack when closed
      DIALOG_STACK = DIALOG_STACK.filter((dialogId) => dialogId !== index)

      if (DIALOG_STACK.length === 0) {
        document.body.style.overflow = 'auto'
      }
    }

    // Only handle ESC key for the topmost dialog
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Only close if this is the topmost dialog
        if (DIALOG_STACK[DIALOG_STACK.length - 1] === index) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(false)
        }
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, index, setOpen])

  const zIndex = 50 + ((index ?? 10) + 5)

  return (
    <DialogPortal>
      {shouldRender ? (
        <>
          <dialog
            open={open}
            ref={ref}
            data-state={open ? 'open' : 'closed'}
            className={cn(
              'fixed left-1/2 top-1/2 grid w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] duration-300 ease-out',
              'data-[state=open]:fade-in data-[state=open]:scale-in data-[state=closed]:fade-out data-[state=closed]:scale-out data-[state=closed]:hidden shadow-md',
              className,
            )}
            style={{
              zIndex: zIndex + 1,
            }}
            {...props}
          >
            <X
              onClick={() => setOpen(false)}
              className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 hover:opacity-100 transition'
            />
            {children}
          </dialog>
          <DialogOverlay
            onClick={() => setOpen(false)}
            style={{
              zIndex,
            }}
            data-state={open ? 'open' : 'closed'}
          />
        </>
      ) : null}
    </DialogPortal>
  )
}

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof Button> { }
export function DialogClose({ onClick, ...props }: DialogCloseProps) {
  const { setOpen } = useDialogContext()
  return (
    <Button
      onClick={(e) => {
        setOpen(false)
        onClick?.(e)
      }}
      {...(props as ButtonProps)}
    />
  )
}

/**
 * `DialogOverlay` is a React forwardRef component that renders an overlay for a dialog.
 * It uses `DialogPrimitive.Overlay` as the base component and applies additional styles
 * and animations based on the dialog's state.
 *
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the overlay.
 * @param {React.RefObject<HTMLDivElement>} [props.ref] - A ref to be forwarded to the `DialogPrimitive.Overlay` component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props to be passed to the `DialogPrimitive.Overlay` component.
 *
 * @returns {JSX.Element} The rendered overlay component.
 */
export interface DialogOverlayProps extends React.HTMLProps<HTMLDivElement> { }
const DialogOverlay = ({ className, ref, ...props }: DialogOverlayProps) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none',
      className,
    )}
    {...props}
  />
)
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
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
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
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  )
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
export interface DialogTitleProps extends React.HTMLProps<HTMLHeadingElement> { }
export function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
    <h2
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  )
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
  extends React.HTMLProps<HTMLParagraphElement> { }
export const DialogDescription = ({
  className,
  ref,
  ...props
}: DialogDescriptionProps) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

interface DialogPortalProps {
  children?: React.ReactNode
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container']
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

export function DialogPortal({
  children,
  forceMount,
  ...props
}: DialogPortalProps) {
  return React.Children.map(children, (child) => (
    <Portal {...props}>{child}</Portal>
  ))
}
// const context = useDialogContext()
// <Presence present={forceMount || context.open}></Presence>
