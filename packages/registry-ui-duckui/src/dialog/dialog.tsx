import { cn } from '@gentleduck/libs/cn'
import { Button } from '../button'
import React from 'react'
import { X } from 'lucide-react'
import { AnimDialogVariants, AnimVariants } from '@gentelduck/motion/anim'
import { DialogContextType, DialogProps } from './dialog.types'
import { useDialog } from '@gentelduck/aria-feather'
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
  const { open, onOpenChange: _onOpenChange, ref } = useDialog(openProp, onOpenChange)

  return (
    <DialogContext.Provider
      value={{
        open: open ?? false,
        onOpenChange: _onOpenChange,
        ref
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

/**
 * A component that renders the content of the dialog when it is open.
 *
 * @param {React.HTMLProps<HTMLDialogElement>} props - The properties for the dialog content.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the dialog.
 * @param {boolean} [props.renderOnce] - If true, the content will only be rendered once.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional props for the dialog content.
 *
 * @returns {React.JSX.Element} A dialog content component.
 *
 */
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
        AnimDialogVariants(),
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

/**
 * DialogHeader component renders a header section for a dialog.
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
 * @param {React.HTMLProps<HTMLDivElement>} props - The properties passed to the component.
 * @param {string} props.className - Additional class names for styling.
 * @param {React.RefObject<HTMLDivElement>} props.ref - The ref to be forwarded to the component.
 * @param {React.HTMLProps<HTMLDivElement>} [...props] - Additional properties for the component.
 *
 * @returns {React.JSX.Element} The rendered DialogFooter component.
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
 * `DialogTitle` is a React component that forwards its ref to the `DialogTitle` component.
 * It accepts all props that `DialogTitle` accepts, along with an optional `className` prop
 * to customize its styling.
 *
 * @param {React.HTMLProps<HTMLHeadingElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Optional additional class names to apply to the component.
 * @param {React.RefObject<HTMLHeadingElement>} [props.ref] - A ref that will be forwarded to the `DialogTitle` component.
 * @param {React.HTMLProps<HTMLHeadingElement>} [...props] - Additional props to be passed to the `DialogTitle` component.
 *
 * @returns {React.JSX.Element} The rendered `DialogTitle` component with forwarded ref and applied props.
 */
export interface DialogTitleProps extends React.HTMLProps<HTMLHeadingElement> { }
export function DialogTitle({
  className,
  ref,
  ...props
}: DialogTitleProps): React.JSX.Element {
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
 * `DialogDescription` is a React component that forwards its ref to the `DialogDescription` component.
 * It applies additional class names to style the description text.
 *
 * @param {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the description text.
 * @param {React.RefObject<HTMLParagraphElement>} [props.ref] - The ref to be forwarded to the `DialogDescription` component.
 * @param {React.HTMLProps<HTMLParagraphElement>} [..props] - Additional props to be passed to the `DialogDescription` component.
 *
 * @returns {React.JSX.Element} The rendered `DialogDescription` component with forwarded ref and applied class names.
 */
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
