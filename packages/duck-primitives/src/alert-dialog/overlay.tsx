import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const OVERLAY_NAME = 'AlertDialogOverlay'

type AlertDialogOverlayElement = React.ComponentRef<typeof DialogPrimitive.Overlay>
type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
export interface IAlertDialogOverlayProps extends DialogOverlayProps {}

/** Overlay layer rendered behind the alert dialog content. */
export const AlertDialogOverlay = React.forwardRef<AlertDialogOverlayElement, IAlertDialogOverlayProps>(
  (props: ScopedProps<IAlertDialogOverlayProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Overlay {...dialogScope} {...overlayProps} ref={forwardedRef} />
  },
)

AlertDialogOverlay.displayName = OVERLAY_NAME
