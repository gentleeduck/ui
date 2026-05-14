import * as React from 'react'
import * as DialogPrimitive from '../dialog'
import { useDialogScope } from './alert-dialog'
import type { IAlertDialog } from './alert-dialog.types'

const TRIGGER_NAME = 'AlertDialogTrigger'

type AlertDialogTriggerElement = React.ComponentRef<typeof DialogPrimitive.Trigger>

export const AlertDialogTrigger = React.forwardRef<AlertDialogTriggerElement, IAlertDialog.ITriggerProps>(
  (props: IAlertDialog.IScoped<IAlertDialog.ITriggerProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogPrimitive.Trigger {...dialogScope} {...triggerProps} ref={forwardedRef} />
  },
)

AlertDialogTrigger.displayName = TRIGGER_NAME
