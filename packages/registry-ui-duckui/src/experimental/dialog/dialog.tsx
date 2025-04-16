import { cn } from '@gentelduck/libs/cn'
import { Button, ButtonProps } from '../../button'
import React from 'react'
import { X } from 'lucide-react'

export interface DialogContextType {
  toggleDialog: () => void
  openDialog: () => void
  closeDialog: () => void
  ref: React.RefObject<HTMLDialogElement>
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
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const openDialog = () => {
    const dialog = dialogRef.current
    if (!dialog) return

    document.body.style.overflow = 'hidden'
    try {
      dialog.showModal()
    } catch (e) {
      console.warn('Dialog failed to open', e)
    }
  }

  const closeDialog = () => {
    const dialog = dialogRef.current
    if (!dialog) return

    document.body.style.overflow = 'auto'
    dialog.close()
  }

  const toggleDialog = () => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.open ? closeDialog() : openDialog()
  }

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      document.body.style.overflow = 'auto'
    }

    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [])

  return (
    <DialogContext.Provider value={{ toggleDialog, openDialog, closeDialog, ref: dialogRef as React.RefObject<HTMLDialogElement> }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogContent({
  children,
  className,
  ...props
}: React.HTMLProps<HTMLDialogElement>) {
  const { closeDialog, ref } = useDialogContext()

  return (
    <dialog
      ref={ref}
      {...props}
      className={cn(
        'fixed left-1/2 top-1/2 open:grid w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] transition-all ease-[cubic-bezier(1,0.235,0,1.65)] starting:open:backdrop-none starting:open:opacity-0 starting:open:scale-90',
        className
      )}
      onClick={(e) => {
        if (e.currentTarget === e.target) closeDialog()
      }}
    >
      <button
        aria-label='close'
        className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 rounded-md hover:opacity-100 transition-all'
        onClick={closeDialog}
      >
        <X aria-hidden />
      </button>
      {children}
    </dialog>
  )
}


export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> { }

export function DialogTrigger({ onClick, ...props }: DialogTriggerProps) {
  const { toggleDialog } = useDialogContext()

  return (
    <Button
      onClick={(e) => {
        toggleDialog()
        onClick?.(e)

      }}
      {...(props as ButtonProps)}
    />
  )
}

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
