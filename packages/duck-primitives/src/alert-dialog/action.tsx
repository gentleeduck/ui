import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const ACTION_NAME = 'AlertDialogAction'

type AlertDialogActionElement = React.ComponentRef<typeof DialogPrimitive.Close>
type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
export interface IAlertDialogActionProps extends DialogCloseProps {}

/** Button that confirms the alert dialog action and closes it. */
export const AlertDialogAction = React.forwardRef<AlertDialogActionElement, IAlertDialogActionProps>(
  (props: ScopedProps<IAlertDialogActionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Close {...dialogScope} {...actionProps} ref={forwardedRef} />
  },
)

AlertDialogAction.displayName = ACTION_NAME
