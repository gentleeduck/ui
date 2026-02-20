import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const OVERLAY_NAME = 'AlertDialogOverlay'

type AlertDialogOverlayElement = React.ElementRef<typeof DialogPrimitive.Overlay>
type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
export interface AlertDialogOverlayProps extends DialogOverlayProps {}

/** Overlay layer rendered behind the alert dialog content. */
export const AlertDialogOverlay = React.forwardRef<AlertDialogOverlayElement, AlertDialogOverlayProps>(
  (props: ScopedProps<AlertDialogOverlayProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Overlay {...dialogScope} {...overlayProps} ref={forwardedRef} />
  },
)

AlertDialogOverlay.displayName = OVERLAY_NAME
