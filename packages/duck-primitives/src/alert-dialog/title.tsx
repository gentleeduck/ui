import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const TITLE_NAME = 'AlertDialogTitle'

type AlertDialogTitleElement = React.ComponentRef<typeof DialogPrimitive.Title>

/** Accessible title for the alert dialog. */
export const AlertDialogTitle = React.forwardRef<AlertDialogTitleElement, IAlertDialog.ITitleProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.ITitleProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Title {...dialogScope} {...titleProps} ref={forwardedRef} />
  },
)

AlertDialogTitle.displayName = TITLE_NAME
