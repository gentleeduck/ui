import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { type ScopedProps, useDialogScope } from './alert-dialog'

const TRIGGER_NAME = 'AlertDialogTrigger'

type AlertDialogTriggerElement = React.ComponentRef<typeof DialogPrimitive.Trigger>
type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
export interface IAlertDialogTriggerProps extends DialogTriggerProps {}

/** Button that opens the alert dialog. */
export const AlertDialogTrigger = React.forwardRef<AlertDialogTriggerElement, IAlertDialogTriggerProps>(
  (props: ScopedProps<IAlertDialogTriggerProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Trigger {...dialogScope} {...triggerProps} ref={forwardedRef} />
  },
)

AlertDialogTrigger.displayName = TRIGGER_NAME
