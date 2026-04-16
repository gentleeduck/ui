import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const ACTION_NAME = 'AlertDialogAction'

type AlertDialogActionElement = React.ComponentRef<typeof DialogPrimitive.Close>

/** Button that confirms the alert dialog action and closes it. */
export const AlertDialogAction = React.forwardRef<AlertDialogActionElement, IAlertDialog.IActionProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.IActionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Close {...dialogScope} {...actionProps} ref={forwardedRef} />
  },
)

AlertDialogAction.displayName = ACTION_NAME
