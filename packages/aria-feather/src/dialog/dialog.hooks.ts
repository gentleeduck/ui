import React from 'react'
import { DialogContext } from './dialog'
import { DialogContextType } from './dialog.types'
import { useComputedTimeoutTransition } from '@gentleduck/hooks'

export function useDialogContext(name: string = 'Dialog'): DialogContextType {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error(`useDialogContext must be used within a ${name}`)
  }
  return context
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
    // useComputedTimeoutTransition(dialog, () => {
      document.body.style.overflow = open ? 'hidden' : 'auto'
    // })

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }

    dialog?.addEventListener('close', () => handleOpenChange(false))
    return () => dialog?.removeEventListener('close', () => handleOpenChange(false))
  }, [handleOpenChange, open, openProp])

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
