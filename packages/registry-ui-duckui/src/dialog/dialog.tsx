import React from 'react'
import { Button } from '../button'
import { DialogContextType, DialogProps } from './dialog.types'
import { cn } from '@gentelduck/libs/cn'
import { X } from 'lucide-react'
// import motion from '@gentelduck/motion'
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
				const dialog = dialogRef.current
				// setTimeout(() => {
				// 	motion(dialog)
				// }, 200)
				dialog?.close()
				setOpen(false)
				document.body.style.overflow = 'auto'
				return onOpenChange?.(false)

			} else {
				// motion(dialog)
				// motion(overlay)
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
		open && dialogRef.current?.showModal()
	}, [])

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

/**
 * DialogContent component to be used inside a Dialog.
 *
 * It takes all the props of the HTMLDialogElement and an additional
 * `className` property to apply additional CSS classes.
 *
 * @param {React.HTMLProps<HTMLDialogElement>} props - The properties for the dialog content.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the dialog.
 * @param {string} [props.className] - Additional CSS classes to apply to the dialog content.
 * @param {boolean} [props.renderOnce] - Whether to render the content only once.
 * @param {React.HTMLProps<HTMLDialogElement>} [...props] - The properties for the dialog content.
 *
 * @returns {React.JSX.Element} The dialog content component with applied props and classes.
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

	const handleClose = () => {
		onOpenChange(false)
	}

	return (
		<dialog
			ref={ref}
			{...props}
			className={cn(
				'open:grid inset-1/2 -translate-1/2 w-full sm:max-w-md max-w-lg gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg transition-all',
				className,
			)}
			onClick={(e) => {
				if (e.currentTarget === e.target) handleClose()
			}}
		>
			<button
				aria-label='close'
				className='absolute right-4 top-4 size-4 cursor-pointer opacity-70 rounded-md hover:opacity-100 transition-all'
				onClick={handleClose}
			>
				<X aria-hidden />
			</button>
			{children}
			{/* {_shouldRender && children} */}
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
 * `DialogDescription` is a React component that forwards its ref to the `DialogDescription` component.
 * It applies additional class names to style the description text.
 *
 * @praam {React.HTMLProps<HTMLParagraphElement>} props - The properties passed to the component.
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
