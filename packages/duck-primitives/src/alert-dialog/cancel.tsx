import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useComposedRefs } from '../libs/compose-ref'
import { type ScopedProps, useDialogScope } from './alert-dialog'
import { useAlertDialogContentContext } from './content'

const CANCEL_NAME = 'AlertDialogCancel'

type AlertDialogCancelElement = React.ComponentRef<typeof DialogPrimitive.Close>
type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
export interface IAlertDialogCancelProps extends DialogCloseProps {}

/** Button that cancels the alert dialog action and closes it. Receives initial focus. */
export const AlertDialogCancel = React.forwardRef<AlertDialogCancelElement, IAlertDialogCancelProps>(
  (props: ScopedProps<IAlertDialogCancelProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog)
    const dialogScope = useDialogScope(__scopeAlertDialog)
    const ref = useComposedRefs(forwardedRef, cancelRef)
    return <DialogPrimitive.Close {...dialogScope} {...cancelProps} ref={ref} />
  },
)

AlertDialogCancel.displayName = CANCEL_NAME
