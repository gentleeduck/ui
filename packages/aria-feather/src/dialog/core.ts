import React from 'react'

export function useDialog(openProp?: boolean, onOpenChange?: (state: boolean) => void) {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const handleOpenChange = React.useCallback((state: boolean) => {
    try {
      const dialog = dialogRef.current

      if (!state) {
        dialog?.close()
        setOpen(false)
        document.body.style.overflow = 'auto'
        onOpenChange?.(false)
      } else {
        dialog?.showModal()
        setOpen(true)
        onOpenChange?.(true)
        document.body.style.overflow = 'hidden'
      }
    } catch (e) {
      console.warn('Dialog failed to toggle', e)
    }
  }, [onOpenChange])

  React.useEffect(() => {
    const dialog = dialogRef.current
    const handleClose = () => handleOpenChange(false)

    dialog?.addEventListener('close', handleClose)
    return () => dialog?.removeEventListener('close', handleClose)
  }, [handleOpenChange])

  return {
    ref: dialogRef,
    open,
    onOpenChange: handleOpenChange,
  } as const
}
