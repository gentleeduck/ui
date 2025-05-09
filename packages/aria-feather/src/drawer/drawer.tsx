

import React from "react"
import { DialogProps, useScaleBackground } from "../dialog"
import { DrawerContextType, DrawerProps } from "./src/types"
import { Slot } from "../slot"

/**
 * Context for managing the open state of the Drawer.
 *
 */
export const DrawerContext = React.createContext<DrawerContextType | null>(null)

/**
 * Hook to access the DrawerContext. It holds the open state of the Drawer
 * and a function to update it.
 *
 * @returns {DrawerContextType} The Drawer context object.
 * @throws {Error} If the hook is used outside of a Drawer.
 */
export function useDrawerContext(name: string = 'Drawer'): DrawerContextType {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error(`useDrawerContext must be used within a ${name}`)
  }
  return context
}


export function useOverlayClose() {
  const { onOpenChange } = useDrawerContext()
  function closeOverlay(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.currentTarget === e.target) onOpenChange(false)
  }
  return [closeOverlay]
}


export function Trigger({
  onClick,
  open,
  ...props
}: React.ComponentPropsWithRef<typeof Slot> & {
  open?: boolean
  asChild?: boolean
}): React.JSX.Element {
  const { onOpenChange, open: _open } = useDrawerContext()

  return (
    <Slot
      onClick={(e) => {
        onOpenChange(open ?? !_open)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

export function useDrawer({
  open: openProp,
  onOpenChange,
  direction = 'bottom',
  noBodyStyles = false,
  shouldScaleBackground = true,
  setBackgroundColorOnScale = true,
}: Omit<DrawerProps, 'children'>): {
  ref: React.RefObject<HTMLDialogElement>;
  open: boolean;
  onOpenChange: (state: boolean) => void;
  direction: DrawerProps['direction'];
  shouldScaleBackground: boolean;
  setBackgroundColorOnScale: boolean;
  noBodyStyles: boolean;
} {
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
          setOpen(false)
          //FIX: the animation is not working on exit, so i mocked this behaviour.
          setTimeout(() => {
            dialog?.close()
          }, 300)
          return onOpenChange?.(false)
        }
      } catch (e) {
        console.warn('Drawer failed to toggle', e)
      }
    },
    [onOpenChange],
  )

  React.useEffect(() => {
    const dialog = dialogRef.current
    document.body.style.overflow = open ? 'hidden' : 'auto'

    if (openProp) {
      handleOpenChange(true)
    } else if (openProp === false) {
      handleOpenChange(false)
    }

    dialog?.addEventListener('close', () => handleOpenChange(false))
    return () => dialog?.removeEventListener('close', () => handleOpenChange(false))
  }, [handleOpenChange, open, openProp])

  useScaleBackground({
    open,
    noBodyStyles,
    setBackgroundColorOnScale,
    shouldScaleBackground,
    direction,
  })

  return {
    ref: dialogRef,
    open,
    onOpenChange: handleOpenChange,
    direction,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    noBodyStyles,
  } as const
}


export function DrawerRoot({
  children,
  open: openProp,
  onOpenChange,
  direction = 'bottom',
  noBodyStyles = false,
  shouldScaleBackground = true,
  setBackgroundColorOnScale = true,
}: DrawerProps): React.JSX.Element {
  const { open, onOpenChange: _onOpenChange, ref, direction: _direction, shouldScaleBackground: _shouldScaleBackground, setBackgroundColorOnScale: _setBackgroundColorOnScale, noBodyStyles: _noBodyStyles } = useDrawer({
    open: openProp,
    onOpenChange,
    direction,
    noBodyStyles,
    shouldScaleBackground,
    setBackgroundColorOnScale,
  })

  return (
    <DrawerContext.Provider
      value={{
        open: open ?? false,
        onOpenChange: _onOpenChange,
        ref,
        direction: _direction,
        shouldScaleBackground: _shouldScaleBackground,
        setBackgroundColorOnScale: _setBackgroundColorOnScale,
        noBodyStyles: _noBodyStyles,
      }}>
      {children}
    </DrawerContext.Provider>
  )
}



