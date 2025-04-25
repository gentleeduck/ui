import { cn } from '@gentelduck/libs/cn'
import { Button, ButtonProps } from '../button'
import React from 'react'
import { X } from 'lucide-react'
import { AnimVariants } from '@gentelduck/motion/anim'
/**
 * Context for managing the open state of the dialog.
 *
 */
export const DialogContext = React.createContext<DialogContextType | null>(null)

/**
 * Hook to access the DialogContext. It holds the open state of the dialog
 * and a function to update it.
 *
 * @returns {DialogContextType} The dialog context object.
 * @throws {Error} If the hook is used outside of a Dialog.
 */
export function useDialogContext(name: string = 'Dialog'): DialogContextType {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error(`useDialogContext must be used within a ${name}`)
  }
  return context
}

/**
 * Dialog component that provides a context for managing its open state and
 * behavior. It uses a ref to handle the underlying HTMLDialogElement.
 *
 * @param {DialogProps} props - The properties for the Dialog component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the dialog.
 * @param {boolean} [props.open] - Initial open state of the dialog.
 * @param {(state:boolean)=>void} [props.onOpenChange] - Callback function to handle state changes of the dialog.
 *
 * @returns {React.JSX.Element} A context provider that manages the dialog state and renders its children.
 */
export function Dialog({
  children,
  open: openProp,
  onOpenChange,
}: DialogProps): React.JSX.Element {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const _onOpenChange = (state: boolean) => {
    try {
      const dialog = dialogRef.current

      if (!state) {
        dialog?.close()
        setOpen(false)
        document.body.style.overflow = 'auto'
        return onOpenChange?.(false)
      } else {
        dialog?.showModal()
        setOpen(true)
        onOpenChange?.(true)
        document.body.style.overflow = 'hidden'
      }
    } catch (e) {
      console.warn('Dialog failed to toggle', e)
    }
  }

  React.useEffect(() => {
    const dialog = dialogRef.current

    dialog?.addEventListener('close', () => _onOpenChange(false))
    return () =>
      dialog?.removeEventListener('close', () => _onOpenChange(false))
  }, [])

  return (
    <DialogContext.Provider
      value={{
        open: open ?? false,
        onOpenChange: _onOpenChange,
        ref: dialogRef,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}

/**
 * A component that serves as a trigger for the dialog.
 *
 * It takes all the props of the Button component and an additional
 * `onClick` property that is called when the dialog is opened.
 *
 * @param {React.ComponentPropsWithoutRef<typeof Button>} props - The properties for the Button component.
 * @param {Function} [props.onClick] - Callback function to handle click events on the button.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the button.
 * @param {React.ComponentPropsWithoutRef<typeof Button>} [...props] - The properties for the Button component.
 *
 * @returns {React.JSX.Element} A button that toggles the dialog on click.
 */
export function DialogTrigger({
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>): React.JSX.Element {
  const { onOpenChange } = useDialogContext()

  return (
    <Button
      onClick={(e) => {
        onOpenChange(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

export interface DialogContentProps
  extends React.HTMLProps<HTMLDialogElement> { }

export function DialogContent({
  children,
  className,
  renderOnce,
  ...props
}: React.HTMLProps<HTMLDialogElement> & {
  renderOnce?: boolean
}): React.JSX.Element {
  const { open, ref, onOpenChange } = useDialogContext()
  const [shouldRender, setShouldRender] = React.useState<boolean>(false)
  const _shouldRender = renderOnce ? shouldRender : ref.current?.open

  React.useEffect(() => {
    if (open) return setShouldRender(true)
  }, [open])

  return (
    <dialog
      ref={ref}
      {...props}
      className={cn(
        'open:grid inset-1/2 -translate-1/2 w-full max-w-lg sm:max-w-md gap-4 border border-border bg-background p-6 shadow-sm sm:rounded-lg',
        AnimVariants(),
        className,
      )}
      onClick={(e) => {
        if (e.currentTarget === e.target) onOpenChange(false)
      }}
    >
      <button
        aria-label='close'
        className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 rounded hover:opacity-100 transition-all'
        onClick={() => onOpenChange(false)}
      >
        <X aria-hidden size={20} />
      </button>
      {_shouldRender && children}
    </dialog>
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
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
  console.log('asdfasd')
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
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement>): React.JSX.Element {
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
export function DialogTitle({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLHeadingElement>): React.JSX.Element {
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
}: React.HTMLProps<HTMLParagraphElement>): React.JSX.Element => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

/**
 * DialogClose component renders a close button for a dialog.
 * It supports additional class names and props to customize the
 * appearance and behavior of the close button. The component uses
 * the `useDialogContext` hook to access the `onOpenChange` function
 * to close the dialog.
 *
 * @param {React.ComponentPropsWithRef<typeof Button>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.RefObject<HTMLButtonElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.ComponentPropsWithRef<typeof Button>} [...props] - Additional properties for the component.
 *
 * @returns {React.JSX.Element} The rendered DialogClose component.
 */
export function DialogClose({
  onClick,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof Button>): React.JSX.Element {
  const { onOpenChange } = useDialogContext()
  return (
    <Button
      onClick={(e) => {
        onOpenChange(false)
        onClick?.(e)
      }}
      ref={ref}
      {...props}
    />
  )
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
