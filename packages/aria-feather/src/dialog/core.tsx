import React from 'react'
import { DialogContextType, DialogProps, UseDrawerDragProps, UseDrawerDragReturn } from './dialog.types'

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
export function Root({ children, open: openProp, onOpenChange }: DialogProps): React.JSX.Element {
  const { open, onOpenChange: _onOpenChange, ref } = useDialog(openProp, onOpenChange)

  return (
    <DialogContext.Provider
      value={{
        open: open ?? false,
        onOpenChange: _onOpenChange,
        ref,
      }}>
      {children}
    </DialogContext.Provider>
  )
}

export function useDialog(openProp?: boolean, onOpenChange?: (state: boolean) => void) {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const handleOpenChange = React.useCallback(
    (state: boolean) => {
      try {
        const dialog = dialogRef.current
        if (state) {
          dialog?.showModal()
          setOpen(true)
          onOpenChange?.(true)
        } else {
          dialog?.close()
          setOpen(false)
          onOpenChange?.(false)
        }
      } catch (e) {
        console.warn('Dialog failed to toggle', e)
      }
    },
    [onOpenChange],
  )

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

export function useDebounce<T extends (...args: any[]) => void>(func: T, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function useDrawerDrag({ ref, onOpenChange, holdUpThreshold = 10 }: UseDrawerDragProps): UseDrawerDragReturn {
  let isDragging = false
  let startY = 0
  let currentY = 0
  const FRAME_TIME = 4
  const SMOOTH_FACTOR = 1

  const updateTransform = useDebounce((deltaY: number) => {
    if (!ref?.current) return
    const limitedDeltaY = Math.max(-holdUpThreshold, Math.min(deltaY, window.innerHeight))
    const currentTransform =
      Number.parseFloat(ref.current.style.transform.replace('translateY(', '').replace('px)', '')) || 0
    const smoothedDeltaY = currentTransform + (limitedDeltaY - currentTransform) * SMOOTH_FACTOR

    ref.current.style.transform = `translateY(${Math.round(smoothedDeltaY)}px)`
  }, FRAME_TIME)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only handle left mouse button
    isDragging = true
    startY = e.clientY
    currentY = startY

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = Math.round(e.clientY - startY)
      updateTransform(deltaY)
      currentY = e.clientY
    }

    const handleMouseUp = () => {
      if (!ref?.current) return
      isDragging = false
      const deltaY = Math.round(currentY - startY)
      const shouldClose = deltaY > 150 // Close if dragged more than 150px

      if (shouldClose && onOpenChange) {
        onOpenChange(false)
      } else {
        ref.current.style.transform = 'translateY(0px)'
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging = true
    startY = e.touches[0]?.clientY ?? 0
    currentY = startY
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !e.touches[0]) return
    const deltaY = Math.round(e.touches[0].clientY - startY)
    updateTransform(deltaY)
    currentY = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!ref?.current) return
    isDragging = false
    const deltaY = Math.round(currentY - startY)
    const shouldClose = deltaY > 150 // Close if dragged more than 150px

    if (shouldClose && onOpenChange) {
      onOpenChange(false)
    } else {
      ref.current.style.transform = 'translateY(0px)'
    }
  }

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
