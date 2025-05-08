import React from 'react'
import { DialogContextType, DialogProps } from './dialog.types'
import { Slot } from '../slot'
import { useDialog, useDialogContext } from './dialog.hooks'

/**
 * Context for managing the open state of the dialog.
 *
 */
export const DialogContext = React.createContext<DialogContextType | null>(null)

/**
 * Dialog component that provides a context for managing its open state and
 * behavior. It uses a ref to handle the underlying HTMLDialogElement.
 */
export function Root({ children, open: openProp, onOpenChange }: DialogProps): React.JSX.Element {
  const { open, onOpenChange: _onOpenChange, ref } = useDialog(openProp, onOpenChange)

  console.log(open, 'haasdfasfdasdfasdfasdfasdf')
  return (
    <DialogContext.Provider
      value={{
        open: open, //?? false,
        onOpenChange: _onOpenChange,
        ref,
      }}>
      {children}
    </DialogContext.Provider>
  )
}

export function Trigger({
  onClick,
  open,
  ...props
}: React.ComponentPropsWithRef<typeof Slot> & {
  open?: boolean
}): React.JSX.Element {
  const { onOpenChange } = useDialogContext()

  return (
    <Slot
      onClick={(e) => {
        onOpenChange(open ?? !open)
        onClick?.(e)
      }}
      {...props}
    />
  )
}

export default {
  Root,
  Trigger,
}
