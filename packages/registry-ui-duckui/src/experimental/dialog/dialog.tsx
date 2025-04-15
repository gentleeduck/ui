import { cn } from '@gentelduck/libs/cn'
import { Button, ButtonProps } from '../../button'
import React, { useRef } from 'react'
import { X } from 'lucide-react'

export interface DialogContextType {
  toggleDialog: () => void
}

export const DialogContext = React.createContext<DialogContextType | null>(null)

export function useDialogContext() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }
  return context
}

{/* <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
  {dialogContent}
</Dialog> */}



export function Dialog({
  children,
}: {
  children: React.ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  return (
    <DialogContext.Provider
      value={{ toggleDialog }}
    >
      {children}
    </DialogContext.Provider>
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

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement> { }

export function DialogContent({
  children,
  className,
  ref,
  ...props
}: DialogContentProps): JSX.Element {
  const { toggleDialog } = useDialogContext()

  return (
    <>
      <dialog
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 grid w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] duration-300 ease-out transition-all',
          // 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8',
          'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
          className,
        )}
        {...props}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
      >
        <X
          onClick={toggleDialog}
          // onClick={() => onOpenChange(false)}
          className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 hover:opacity-100 transition'
        />
        {children}
      </dialog>
    </>
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
