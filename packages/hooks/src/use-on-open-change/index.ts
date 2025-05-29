import React from 'react'
import { useComputedTimeoutTransition } from '../use-computed-timeout-transition'

export function useOnOpenChange<const T extends React.RefObject<HTMLElement | null>>(
  ref: T,
  openProp?: boolean,
  onOpenChange?: (state: boolean) => void,
) {
  const [open, setOpen] = React.useState<boolean>(openProp ?? false)

  const handleOpenChange = React.useCallback(
    (state: boolean) => {
      if (!ref.current) return
      if (state) {
        document.body.classList.add('scroll-locked')
        setTimeout(() => {
          setOpen(true)
          onOpenChange?.(true)
        }, 100)
      } else {
        useComputedTimeoutTransition(ref.current, () => {
          document.body.classList.remove('scroll-locked')
        })
        setOpen(false)
        onOpenChange?.(false)
      }
    },
    [onOpenChange],
  )

  React.useEffect(() => {
    if (!ref.current) return
    useComputedTimeoutTransition(ref.current, () => {
      document.body.classList.toggle('scroll-locked', open)
    })

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }
  }, [handleOpenChange, open, openProp])

  return {
    ref,
    open,
    onOpenChange: handleOpenChange,
  }
}
