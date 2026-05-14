import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const OVERLAY_NAME = 'AlertDialogOverlay'

type AlertDialogOverlayElement = React.ComponentRef<typeof DialogPrimitive.Overlay>

export const AlertDialogOverlay = React.forwardRef<AlertDialogOverlayElement, IAlertDialog.IOverlayProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.IOverlayProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Overlay {...dialogScope} {...overlayProps} ref={forwardedRef} />
  },
)

AlertDialogOverlay.displayName = OVERLAY_NAME
