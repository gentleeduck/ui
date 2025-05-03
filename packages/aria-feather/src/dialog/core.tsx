import React from 'react'
import { DialogContextType, DialogProps } from './dialog.types'

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
export function Root({
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

export function useDialog(openProp?: boolean, onOpenChange?: (state: boolean) => void) {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const handleOpenChange = React.useCallback((state: boolean) => {
    try {
      const dialog = dialogRef.current
      if (!state) {
        dialog?.close()
        setOpen(false)
        onOpenChange?.(false)
      } else {
        dialog?.showModal()
        setOpen(true)
        onOpenChange?.(true)
      }
    } catch (e) {
      console.warn('Dialog failed to toggle', e)
    }
  }, [onOpenChange])

  React.useEffect(() => {
    const dialog = dialogRef.current
    document.body.style.overflow = open ? 'hidden' : 'auto'

    dialog?.addEventListener('close', () => handleOpenChange(false))
    return () => dialog?.removeEventListener('close', () => handleOpenChange(false))
  }, [handleOpenChange, open])

  return {
    ref: dialogRef,
    open,
    onOpenChange: handleOpenChange,
  } as const
}

export function useOverlayClose() {
  const { onOpenChange } = useDialogContext()
  function closeOverlay(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.currentTarget === e.target) onOpenChange(false)
  }
  return [closeOverlay]
}


